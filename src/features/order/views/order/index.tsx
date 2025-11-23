import { useAuth } from '@/src/components/contexts/AuthContext';
import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import { Header } from '@/src/components/layouts/Header';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { cart } from '@/src/configs/redux/slices/orderSlice';
import { services } from '@/src/configs/services';
import LoginDrawer from '@/src/features/auth/views/LoginDrawer';
import { orderStyles } from '@/src/features/order/styles/order';
import { Form, Step } from '@/src/features/order/types';
import AddressStep from '@/src/features/order/views/steps/AddressStep';
import AttributeStep from '@/src/features/order/views/steps/AttributeStep';
import CalenderStep from '@/src/features/order/views/steps/CalenderStep';
import ServiceStep from '@/src/features/order/views/steps/ServiceStep';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { OrderNavigationProp, OrderRouteProp } from '@/src/types/navigation';
import { Theme } from '@/src/types/theme';
import { DEFAULT_FORM, STEPS } from '@/src/utils/constants';
import API_ERRORS from '@/src/utils/errors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Toast } from 'toastify-react-native';

const OrderPage = () => {
  const navigation = useNavigation<OrderNavigationProp>();
  const route = useRoute<OrderRouteProp>();
  const {
    isUrgent = false,
    isMulti = false
  } = route.params || {};
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { openDrawer } = useDrawer();
  const { t } = useTranslation();
  const allServices = useAppSelector(state => state.service.allServices);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(createStyles);
  const {
    execute: submitOrder,
    loading: isLoading
  } = useAsyncOperation();
  const [selected, setSelected] = useState<Form>({
    ...DEFAULT_FORM,
    isUrgent: !!isUrgent,
    isMulti: !!isMulti,
  });
  const [isNextStepAllowed, setIsNextStepAllowed] = useState(false);
  const [step, setStep] = useState<Step>(STEPS[0]);
  const totalPrice = useMemo(() => {
    return selected.attributes?.reduce((total, attr) => total + attr.price, 0) || 0;
  }, [selected.attributes]);

  // Validation function to check if all services with hasColor have colors
  const validateColorSelection = useCallback(() => {
    for (const [serviceId, options] of Object.entries(selected.options)) {
      const service = allServices.find(s => s.id.toString() === serviceId);

      if (service?.hasColor) {
        if (!options.colors || options.colors.length === 0) {
          Toast.show({
            type: 'error',
            text1: `لطفا رنگ برای ${service.title} را انتخاب کنید`
          });
          return false;
        }
      }

      // Check addOns for hasColor
      if (options.addOns) {
        for (const addOnId of Object.keys(options.addOns)) {
          const addOnService = allServices.find(s => s.id.toString() === addOnId);
          if (addOnService?.hasColor) {
            if (!options.colors || options.colors.length === 0) {
              Toast.show({
                type: 'error',
                text1: `لطفا رنگ برای ${addOnService.title} را انتخاب کنید`
              });
              return false;
            }
          }
        }
      }
    }
    return true;
  }, [selected.options, allServices]);

  const loadSavedData = useCallback(async () => {
    try {
      const savedOrder = await services.order.getSavedOrder();
      if (savedOrder) {
        setSelected(savedOrder);
        if (savedOrder.step) {
          setStep(savedOrder.step);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  const saveOrderData = useCallback(async () => {
    try {
      await Promise.all([
        services.order.setSavedOrder(selected, step),
      ]);
    } catch (error) {
      console.error('Error saving order data:', error);
    }
  }, [selected, step]);

  const handleChangeStep = useCallback(async (action: 'next' | 'prev') => {
    if (action === 'next') {
      // Validate color selection before moving to next step from attribute step
      if (step?.index === 1) {
        if (!validateColorSelection()) {
          return; // Don't proceed if validation fails
        }
        await saveOrderData();
      }

      if (!isAuthenticated) {
        openDrawer('login', <LoginDrawer/>, { drawerHeight: 'auto' });
        return;
      }

      if (step?.index < STEPS.length - 1) {
        setStep(STEPS[step?.index + 1]);
        setIsNextStepAllowed(false);
      }
    } else {
      if (!selected?.attributeStep && !selected?.service) {
        await services.order.removeSavedOrder();
      }

      if (step?.index === 1) {
        const newParent = allServices.find(e => e.id === selected.attributeStep?.parent?.id);
        if (!newParent) {
          setStep(STEPS[0]);
          setSelected(prev => ({
            ...prev,
            attributeStep: undefined,
            options: {},
            attributes: []
          }));
        } else {
          setSelected(prev => ({
            ...prev,
            attributeStep: allServices?.find(e => e.id === prev.attributeStep?.parent?.id)
          }));
        }
      } else if (step?.index === 2){
        setSelected(prev => ({ ...prev, worker: null }))
      }
      if (step?.index > 0) {
        setStep(STEPS[step?.index - 1]);
      }
    }
  }, [step, selected, isAuthenticated, allServices, openDrawer, saveOrderData, validateColorSelection]);

  const handleBackPress = useCallback(() => {
    if (step?.index > 0) {
      handleChangeStep('prev');
    } else {
      navigation.goBack();
    }
  }, [step?.index, handleChangeStep, navigation]);

  const handleSubmitOrder = useCallback(async () => {
    // Final validation before submission
    if (!validateColorSelection()) {
      return;
    }

    try {
      const res = await submitOrder(() => services.order.submitOrder(selected, allServices));

      if (res.code === 201) {
        await services.order.removeSavedOrder();
        setSelected(DEFAULT_FORM);
        setStep(STEPS[0]);
        dispatch(cart());

        Toast.show({
          type: 'success',
          text1: 'سفارش شما با موفقیت ثبت شد',
        });
        await new Promise(resolve => setTimeout(resolve, 300));
        router.push('/cart');

      } else{
        Toast.error(t(API_ERRORS[res.code] ? `api_error.${API_ERRORS[res.code]}` : 'error.general'));
      }
    } catch (error: any) {
      if (error?.code === 'COLOR_REQUIRED') {
        Toast.show({
          type: 'error',
          text1: 'لطفا رنگ های مورد نیاز را انتخاب کنید',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'خطا در ثبت سفارش',
        });
      }
    }
  }, [selected, submitOrder, dispatch, navigation, validateColorSelection, allServices]);

  const toggleUrgentMode = useCallback((value: boolean) => {
    setSelected(prev => ({
      ...prev,
      isUrgent: value,
      date: value ? prev.date : null,
      time: value ? prev.time : null,
    }));
  }, []);

  const toggleMultiMode = useCallback((value: boolean) => {
    setSelected(prev => ({
      ...prev,
      isMulti: value,
    }));
  }, []);

  const renderStepContent = () => {
    switch (step.name) {
      case 'service':
        return <ServiceStep selected={selected} setSelected={setSelected} setStep={setStep}/>;
      case 'attribute':
        return <AttributeStep selected={selected} setSelected={setSelected} setIsNextStepAllowed={setIsNextStepAllowed}/>;
      case 'address':
        return <AddressStep selected={selected} setSelected={setSelected} setIsNextStepAllowed={setIsNextStepAllowed}/>;
      case 'worker':
        return <CalenderStep selected={selected} setSelected={setSelected} setStep={setStep}/>;
      default:
        return null;
    }
  };

  useEffect(() => {
    // AsyncStorage.clear();
    console.log('loading...');
    loadSavedData();
  }, [loadSavedData]);

  useEffect(() => {

    setSelected(prev => ({
      ...prev,
      price: totalPrice
    }));
  }, [totalPrice]);

  return (
    <View style={[orderStyles.main, Platform.OS == 'web' && orderStyles.paddingBottom84]}>
      <Header onBackPress={step?.index > 0 ? handleBackPress : undefined}/>

      <View style={styles.progressContainer}>
        <View style={orderStyles.progressBackground}>
          <View
            style={[
              orderStyles.progressActive,
              { width: `${((step?.index + 1) / 4) * 100}%` }
            ]}
          />
        </View>
      </View>

      <View style={styles.stepContent}>
        {renderStepContent()}
      </View>

      {step?.index > 0 && (
        <View style={styles.bottomSection}>
          <View style={orderStyles.switchContainer}>
            <View style={styles.switchRow}>
              {/* @ts-ignore */}
              <Switch activeThumbColor={'white'}
                      value={selected.isUrgent}
                      onValueChange={toggleUrgentMode}
                      trackColor={{
                        false: theme.textSecondary,
                        true: colors.pink
                      }}
              />
              <TextView style={styles.switchLabel}>سفارش فوری</TextView>
            </View>

            {step?.index < 2 && (
              <View style={styles.switchRow}>
                {/* @ts-ignore */}
                <Switch activeThumbColor={'white'}
                        value={selected.isMulti}
                        onValueChange={toggleMultiMode}
                        trackColor={{
                          false: theme.textSecondary,
                          true: colors.pink
                        }}
                />
                <TextView style={styles.switchLabel}>سفارش گروهی</TextView>
              </View>
            )}
          </View>

          <View style={orderStyles.buttonSection}>
            {step?.index === STEPS.length - 1 ? (
              <TouchableOpacity
                style={orderStyles.submitButton}
                onPress={handleSubmitOrder}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <TextView style={orderStyles.submitButtonText}>ثبت سفارش</TextView>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  orderStyles.continueButton,
                  !isNextStepAllowed && orderStyles.disabledButton
                ]}
                onPress={() => handleChangeStep('next')}
                disabled={!isNextStepAllowed}
                activeOpacity={0.8}
              >
                <TextView style={[
                  orderStyles.continueButtonText,
                  !isNextStepAllowed ? orderStyles.disabledButtonText : undefined
                ]}>
                  ادامه
                </TextView>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  stepContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: theme.background,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    // backgroundColor: colors.lightPink,
    borderRadius: 8,
    marginBottom: 4,
    width: '48%'
  },
  bottomSection: {
    backgroundColor: theme.primary,
    gap: 4,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: theme.border
  }
});

export default OrderPage;
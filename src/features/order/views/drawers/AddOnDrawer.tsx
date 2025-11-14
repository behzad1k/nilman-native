import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { addOnDrawerStyles } from '@/src/features/order/styles/addOnDrawer';
import { sharedOrderStyles } from '@/src/features/order/styles/serviceStep';
import { Form } from '@/src/features/order/types';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import { engNumToPersian, formatPrice } from '@/src/utils/funs';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Minus, Plus, Trash2 } from 'react-native-feather';
import { Toast } from 'toastify-react-native';

interface IAddOnDrawerProps {
  currentAttribute: Service;
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  setShouldPickAddOns: (value: boolean) => void;
  setPickingColor: (value: any) => void;
}

const AddOnDrawer = ({
                       currentAttribute,
                       selected,
                       setSelected,
                       setShouldPickAddOns,
                       setPickingColor,
                     }: IAddOnDrawerProps) => {
  const serviceReducer = useAppSelector(state => state.service);
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const sortedAddOns = useMemo(() => {
    return currentAttribute?.addOns
    ?.slice()
    ?.sort((a, b) => (a?.sort || 1000) - (b?.sort || 1000))
    ?.filter(addOn => addOn?.id) || [];
  }, [currentAttribute?.addOns]);

  const handleAddOnSelect = useCallback((secAttr: Service) => {
    setSelected(prev => {
      const newOptions = { ...prev.options };
      const currentOption = newOptions[currentAttribute.id] || { count: 1 };
      const currentAddOns = currentOption.addOns || {};

      if (!prev.isMulti) {
        // Replace existing add-on in single mode
        newOptions[currentAttribute.id] = {
          ...currentOption,
          addOns: { [secAttr.id]: { count: 1 } }
        };
      } else {
        // Add or increment in multi mode
        const existingAddOn = currentAddOns[secAttr.id];
        const shouldIncrement = existingAddOn && prev.isMulti;

        newOptions[currentAttribute.id] = {
          ...currentOption,
          count: currentOption.count + (shouldIncrement ? 0 : 1),
          addOns: {
            ...currentAddOns,
            [secAttr.id]: {
              count: shouldIncrement ? existingAddOn.count + 1 : 1
            }
          }
        };
      }

      return { ...prev, options: newOptions };
    });
  }, [currentAttribute.id, setSelected]);
  console.log(selected.options);
  const handleQuantityChange = useCallback((secAttr: Service, newCount: number) => {
    setSelected(prev => {
      const newOptions = { ...prev.options };
      const currentOption = newOptions[currentAttribute.id];

      if (!currentOption?.addOns) return prev;

      if (newCount <= 0) {
        if (Object.values(currentOption?.addOns).length > 1) {
          delete currentOption.addOns[secAttr.id];
        } else {
          Toast.show({
            type: 'warn',
            text2: t('error.atLeastOneAddOn')
          })
        }
      } else {
        currentOption.addOns[secAttr.id] = {
          ...currentOption.addOns[secAttr.id],
          count: newCount
        };
      }

      currentOption.count = Object.values(currentOption?.addOns)?.reduce((acc, curr) => acc + curr.count, 0);

      return { ...prev, options: newOptions };
    });
  }, [currentAttribute.id, setSelected]);

  const handleConfirm = useCallback(() => {
    setShouldPickAddOns(false);
    const currentOption = selected.options[currentAttribute.id];

    if (currentOption?.addOns) {
      if(Object.values(currentOption?.addOns || {})?.length == 0){
        Toast.show({
          type: 'warn',
          text2: t('error.atLeastOneAddOn')
        })
        return;
      }
      const colorService = Object.keys(currentOption.addOns).find(e =>
        serviceReducer.allServices?.some(j =>
          e === j.id.toString() && j.hasColor
        )
      );

      if (colorService) {
        const matchingService = serviceReducer.allServices?.find(
          j => j.id.toString() === colorService
        );
        if (matchingService) {
          setPickingColor({
            attr: matchingService,
            open: true
          });
        }
      }
    }
  }, [setShouldPickAddOns, selected.options, currentAttribute.id, serviceReducer.allServices, setPickingColor]);

  return (
    <View style={sharedOrderStyles.drawerContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TextView style={styles.subtitle}>
          برای ثبت خدمت {currentAttribute?.title} باید یکی از خدمات زیر را نیز انتخاب کنید
        </TextView>

        <View style={addOnDrawerStyles.addOnsList}>
          {sortedAddOns.map((secAttr) => {
            const currentOption = selected.options[currentAttribute.id];
            const isSelected = currentOption?.addOns?.[secAttr.id] !== undefined;
            const count = currentOption?.addOns?.[secAttr.id]?.count || 1;
            const price = count * secAttr.price * (selected.isUrgent ? 1.5 : 1);

            function faNumToEng(text: string): string {
                  throw new Error('Function not implemented.');
              }

            return (
              <TouchableOpacity
                key={secAttr.id}
                style={[styles.attrBox, isSelected && styles.selectedAttrBox]}
                onPress={() => handleAddOnSelect(secAttr)}
                activeOpacity={0.7}
              >
                <View style={sharedOrderStyles.priceContainer}>
                  <View style={sharedOrderStyles.priceRow}>
                    <TextView style={styles.currency}>تومان</TextView>
                    <TextView style={styles.price}>
                      {formatPrice(price)}
                    </TextView>
                  </View>

                  {isSelected && selected.isMulti && (
                    <View style={sharedOrderStyles.quantityContainer}>
                      <TouchableOpacity
                        style={sharedOrderStyles.quantityButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(secAttr, count - 1);
                        }}
                      >
                        {count === 1 ? (
                          <Trash2 width={16} color="#ff4444" />
                        ) : (
                          <Minus width={16} color="#666" />
                        )}
                      </TouchableOpacity>

                      <TextInputView
                        style={sharedOrderStyles.quantityInput}
                        value={engNumToPersian(count.toString())}
                        onChangeText={(text) => {
                          const newCount = Math.max(1, parseInt(faNumToEng(text)) || 1);
                          handleQuantityChange(secAttr, newCount);
                        }}
                        keyboardType="numeric"
                        textAlign="center"
                      />

                      <TouchableOpacity
                        style={sharedOrderStyles.quantityButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(secAttr, count + 1);
                        }}
                      >
                        <Plus width={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: 'row', gap: 10}}>
                  <TextView style={styles.attrTitle}>
                    {secAttr.title}
                  </TextView>
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 12, borderWidth: .5, borderColor: colors.pink}}>
                    {isSelected && <View style={styles.selectedIcon}></View>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={sharedOrderStyles.confirmButton} onPress={handleConfirm}>
        <TextView style={sharedOrderStyles.confirmButtonText}>ثبت</TextView>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    height: 'auto',
    maxHeight: 700,
    paddingBottom: 40
  },
  attrTitle: {
    fontSize: 17,
    color: theme.text,
    fontWeight: '600',
  },
  selectedAttrBox: {
    borderColor: colors.pink,
  },
  selectedIcon: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: colors.pink,
  },
  attrBox: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: 'transparent',
    backgroundColor: theme.primary
  },
  currency: {
    fontSize: 14,
    color: theme.text,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
    lineHeight: 16,

    textAlign: 'right',
  }
});

export default AddOnDrawer;
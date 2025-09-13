import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { cart } from '@/src/configs/redux/slices/orderSlice';
import { fetchUser } from '@/src/configs/redux/slices/userSlice';
import { services } from '@/src/configs/services';
import { orderStyles } from '@/src/features/cart/styles';
import CartItem from '@/src/features/cart/views/shared/CartItem';
import PortalPickerDrawer from '@/src/features/cart/views/shared/PortalPickerDrawer';
import { Order } from '@/src/features/order/types';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import API_ERRORS from '@/src/utils/errors';
import { formatPrice } from '@/src/utils/funs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Toast } from 'toastify-react-native';

const CartTab = () => {
  const items = useAppSelector(state => state.order.cart)
  const userReducer = useAppSelector((state) => state.user);
  const { execute: submit } = useAsyncOperation();
  const dispatch = useAppDispatch();
  const finalPrice = items?.reduce((acc, curr) => acc + curr.finalPrice, 0);
  const { openDrawer } = useDrawer();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [isCredit, setIsCredit] = useState(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const { t } = useTranslation();
  const deleteCartItem = async (id: number) => {
    const res = await submit(() => services.cart.deleteCartItem(id));
    if (res.code == 200) {
      dispatch(cart());
    }
  };

  const checkDiscountCode = async () => {
    if (!discountCode) {
      return
    }
    const res = await services.cart.checkDiscountCode(discountCode)

    if (res.code == 200) {
      dispatch(cart());
    } else if (API_ERRORS[res.code]){
      Toast.error(t(`api_error.${API_ERRORS[res.code]}`));
    } else {
      Toast.error(t('error.general'))
    }
  }

  const handleSubmitPayment = async () => {
    if(isCredit && userReducer.data.walletBalance > finalPrice){
      try {
        // Process credit payment
        const res = await submit(() => services.cart.processCreditPayment());
        if (res.code == 200) {
          Toast.show({
            type: 'success',
            text1: 'پرداخت از کیف پول با موفقیت انجام شد',
          });
          dispatch(cart());
          dispatch(fetchUser())
        } else {
          Toast.show({
            type: 'error',
            text1: 'خطا در پرداخت از کیف پول',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'خطا در پرداخت از کیف پول',
        });
      }
    }else{
      openDrawer('portalDrawer', <PortalPickerDrawer isCredit={isCredit} finalPrice={finalPrice}/>, {
        drawerHeight: 'auto'
      })
    }
  }

  if (!items.length) {
    return <></>;
  }
  return (
    <View style={orderStyles.cartContainer}>
      {items.map((order, index) => (
        <CartItem key={order.id} item={order} deleteCartItem={deleteCartItem}/>
      ))}
      {userReducer?.data?.walletBalance > 0 && (
        <View style={styles.cartIsCredit}>
          <Switch
            value={isCredit}
            onValueChange={(value) => setIsCredit(value)}
            trackColor={{
              false: theme.textSecondary,
              true: colors.pink
            }}
          />
          <TextView style={orderStyles.walletText}>
            استفاده از کیف پول {formatPrice(userReducer?.data?.walletBalance)}
          </TextView>
        </View>
      )}
      <View style={styles.cartIsCredit}>
        <View style={styles.cartDiscountBox}>
          <TouchableOpacity style={styles.cartDiscountButton} onPress={checkDiscountCode}>
            <TextView>بررسی</TextView>
          </TouchableOpacity>
          <TextInputView style={styles.cartDiscountInput} onChangeText={(e) => setDiscountCode(e)}/>
        </View>
        <TextView>
          کد تخفیف
        </TextView>
      </View>
      <View style={styles.cartItemContainer}>
        <View style={orderStyles.orderInfo}>
          <TextView style={orderStyles.orderInfoTitle}>فاکتور نهایی</TextView>
        </View>

        <View style={orderStyles.orderInfo}>
          <TextView style={orderStyles.orderInfoPrice}>
            {formatPrice(items.reduce((acc, curr) => acc + curr.finalPrice, 0))} تومان
          </TextView>
          <TextView style={orderStyles.orderInfoText}>جمع کل</TextView>
        </View>

        <View style={[orderStyles.orderInfo, orderStyles.dashedBottom]}>
          <TextView style={orderStyles.orderInfoPrice}>
            {formatPrice(items.reduce((acc, curr) => acc + curr.discountAmount, 0))} تومان
          </TextView>
          <TextView style={orderStyles.orderInfoText}>تخفیف</TextView>
        </View>

        <View style={orderStyles.orderInfo}>
          <TextView style={orderStyles.finalPrice}>
            {formatPrice(
              items.reduce((acc, curr) => acc + curr.finalPrice, 0) -
              (isCredit ? userReducer.data.walletBalance : 0) < 0
                ? 0
                : (items.reduce((acc, curr) => acc + curr.finalPrice, 0) -
                  (isCredit ? userReducer.data.walletBalance : 0))
            )} تومان
          </TextView>
          <TextView style={orderStyles.orderInfoTitleBold}>مبلغ قابل پرداخت</TextView>
        </View>
      </View>

      <TouchableOpacity
        style={orderStyles.payButton}
        onPress={handleSubmitPayment}
      >
        <TextView style={styles.payButtonText}>پرداخت</TextView>
      </TouchableOpacity>
    </View>
  );
};
const createStyles = (theme: Theme) => StyleSheet.create({
  cartItemContainer: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 12,
  },
  cartIsCredit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textSecondary,
  },
  cartDiscountBox: {
    flexDirection: 'row',
    gap: 4
  },
  cartDiscountButton: {
    padding: 2,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: colors.pink
  },
  cartDiscountInput: {
    width: 100,
    color: theme.text
  }
});
export default CartTab;
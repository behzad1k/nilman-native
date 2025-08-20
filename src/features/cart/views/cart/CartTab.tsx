import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { cart } from '@/src/configs/redux/slices/orderSlice';
import { orderStyles } from '@/src/features/cart/styles';
import CartItem from '@/src/features/cart/views/shared/CartItem';
import PortalPickerDrawer from '@/src/features/cart/views/shared/PortalPickerDrawer';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import { formatPrice } from '@/src/utils/funs';
import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Order } from '@/src/features/order/types'
import { services } from '@/src/configs/services';
import { useTheme } from '@/src/components/contexts/ThemeContext';

interface Props {
  items: Order[]

}

const CartTab = ({ items }: Props) => {
  const [isCredit, setIsCredit] = useState(false);
  const userReducer = useAppSelector((state) => state.user);
  const { execute: submit } = useAsyncOperation()
  const dispatch = useAppDispatch()
  const finalPrice = items?.reduce((acc, curr) => acc + curr.finalPrice, 0);
  const { openDrawer } = useDrawer();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles)
  const deleteCartItem = async (id: number) => {
    const res = await submit(() => services.cart.deleteCartItem(id));
    if (res.code == 200){
      dispatch(cart())
    }

  };
  if (!items.length){
    return <></>
  }
  return (
    <View style={orderStyles.cartContainer}>
      {items.map((order, index) => (
        <CartItem key={order.id} item={order} deleteCartItem={deleteCartItem}/>
      ))}

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

      <TouchableOpacity
        style={orderStyles.payButton}
        onPress={() => openDrawer('portalDrawer', <PortalPickerDrawer isCredit={isCredit} finalPrice={finalPrice} />, {
          drawerHeight: 'auto'
        } )}
      >
        <TextView style={styles.payButtonText}>پرداخت</TextView>
      </TouchableOpacity>
    </View>
  )
}
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
  }
})
export default CartTab;
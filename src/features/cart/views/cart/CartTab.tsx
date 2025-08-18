import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { cart } from '@/src/configs/redux/slices/orderSlice';
import { orderStyles } from '@/src/features/cart/styles';
import CartItem from '@/src/features/cart/views/shared/CartItem';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { formatPrice } from '@/src/utils/funs';
import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Order } from '@/src/features/order/types'
import { services } from '@/src/configs/services';

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
  const styles = useThemedStyles(createStyles)

  const deleteCartItem = async (id: number) => {
    const res = await submit(() => services.cart.deleteCartItem(id));
    if (res.code == 200){
      dispatch(cart())
    }

  };
  return (
    <View style={orderStyles.cartContainer}>
      {items.map((order, index) => (
        <CartItem key={order.id} item={order} deleteCartItem={deleteCartItem}/>
      ))}

      <View style={orderStyles.cartItemContainer}>
        <View style={orderStyles.orderInfo}>
          <TextView style={orderStyles.orderInfoTitle}>فاکتور نهایی</TextView>
        </View>

        <View style={orderStyles.orderInfo}>
          <TextView style={orderStyles.orderInfoText}>جمع کل</TextView>
          <TextView style={orderStyles.orderInfoPrice}>
            {formatPrice(items.reduce((acc, curr) => acc + curr.finalPrice, 0))} تومان
          </TextView>
        </View>

        <View style={[orderStyles.orderInfo, orderStyles.dashedBottom]}>
          <TextView style={orderStyles.orderInfoText}>تخفیف</TextView>
          <TextView style={orderStyles.orderInfoPrice}>
            {formatPrice(items.reduce((acc, curr) => acc + curr.discountAmount, 0))} تومان
          </TextView>
        </View>

        <View style={orderStyles.orderInfo}>
          <TextView style={orderStyles.orderInfoTitleBold}>مبلغ قابل پرداخت</TextView>
          <TextView style={orderStyles.finalPrice}>
            {formatPrice(
              items.reduce((acc, curr) => acc + curr.finalPrice, 0) -
              (isCredit ? userReducer.data.walletBalance : 0) < 0
                ? 0
                : (items.reduce((acc, curr) => acc + curr.finalPrice, 0) -
                  (isCredit ? userReducer.data.walletBalance : 0))
            )} تومان
          </TextView>
        </View>
      </View>

      {userReducer?.data?.walletBalance > 0 && (
        <View style={orderStyles.cartIsCredit}>
          <TextView style={orderStyles.walletText}>
            استفاده از کیف پول {formatPrice(userReducer?.data?.walletBalance)}
          </TextView>
          <Switch
            value={isCredit}
            onValueChange={(value) => setIsCredit(value)}
            trackColor={{
              false: '#767577',
              true: '#81b0ff'
            }}
            thumbColor={isCredit ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      )}

      {/* <TouchableOpacity */}
      {/*   style={orderStyles.payButton} */}
      {/*   onPress={() => openDrawer('portalDrawer', { */}
      {/*     finalPrice: finalPrice, */}
      {/*     isCredit: isCredit */}
      {/*   })} */}
      {/* > */}
      {/*   <Text style={orderStyles.payButtonText}>پرداخت</Text> */}
      {/* </TouchableOpacity> */}
    </View>
  )
}
const createStyles = (theme: Theme) => StyleSheet.create({

})
export default CartTab;
import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { orderStyles } from '@/src/features/cart/styles';
import CartItem from '@/src/features/cart/views/shared/CartItem';
import { formatPrice } from '@/src/utils/funs';
import React, { useState } from 'react';
import { Switch, View } from 'react-native';
import { Order } from '@/src/features/order/types'

interface Props {
  items: Order[]

}

const CartTab = ({ items }: Props) => {
  const [isCredit, setIsCredit] = useState(false);
  const userReducer = useAppSelector((state) => state.user);
  const finalPrice = items?.reduce((acc, curr) => acc + curr.finalPrice, 0);
  const { openDrawer } = useDrawer();

  const deleteCartItem = async (id: number) => {
    // const res = await api(
    //   urls.order,
    //   {
    //     method: 'DELETE',
    //     body: {
    //       orderId: id,
    //     },
    //   },
    //   true,
    // );
    // if (res.code == 200) {
    //   setSuccess(!success);
    //   dispatch(cart());
    //   dispatch(order());
    //   toast('سفارش با موفقیت از سبد خرید حذف شد', { type: 'success' });
    // }
  };
  return (
    <View>
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
export default CartTab;
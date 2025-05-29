import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { Header } from '@/src/components/layouts/Header';
import ButtonView from '@/src/components/ui/ButtonView';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import CartItem from '@/src/features/cart/views/shared/CartItem';
import OrderCard from '@/src/features/cart/views/shared/OrderCard';
import { OrderStatus } from '@/src/utils/enums';
import { formatPrice } from '@/src/utils/funs';
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Switch, StatusBar,
} from 'react-native';
import { orderStyles } from '@/src/features/cart/styles';
import type { Order } from '@/src/features/cart/types';

type tabKeys = 'Created' | 'InProgress' | 'Done'

const tabs: Record<tabKeys, string> = {
  Created: 'Created',
  InProgress: 'InProgress',
  Done: 'Done',
};

const tabTitles: Record<tabKeys, string> = {
  Created: 'سبد خرید',
  InProgress: 'در حال انجام',
  Done: 'تکمیل شده',
};

const initCounts: Record<tabKeys, number> = {
  Created: 0,
  InProgress: 0,
  Done: 0,
};

export default function Cart() {
  const cartReducer = useAppSelector((state) => state.order?.cart);
  const orders = useAppSelector(state => state.order.orders);
  const userReducer = useAppSelector((state) => state.user);
  const finalPrice = cartReducer?.reduce((acc, curr) => acc + curr.finalPrice, 0);
  const [isCredit, setIsCredit] = useState(false);
  const [tab, setTab] = useState<string | null>(null);
  const [items, setItems] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<tabKeys, number>>(initCounts);
  const dispatch = useAppDispatch();

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

  const renderContent = () => {
    if (items.length > 0) {
      if (tab == tabs.Created) {
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
                  {formatPrice(cartReducer.reduce((acc, curr) => acc + curr.finalPrice, 0))} تومان
                </TextView>
              </View>

              <View style={[orderStyles.orderInfo, orderStyles.dashedBottom]}>
                <TextView style={orderStyles.orderInfoText}>تخفیف</TextView>
                <TextView style={orderStyles.orderInfoPrice}>
                  {formatPrice(cartReducer.reduce((acc, curr) => acc + curr.discountAmount, 0))} تومان
                </TextView>
              </View>

              <View style={orderStyles.orderInfo}>
                <TextView style={orderStyles.orderInfoTitleBold}>مبلغ قابل پرداخت</TextView>
                <TextView style={orderStyles.finalPrice}>
                  {formatPrice(
                    cartReducer.reduce((acc, curr) => acc + curr.finalPrice, 0) -
                    (isCredit ? userReducer.data.walletBalance : 0) < 0
                      ? 0
                      : (cartReducer.reduce((acc, curr) => acc + curr.finalPrice, 0) -
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
        );
      } else {
        return (
          <View style={orderStyles.orderCardContainer}>
            {items.map(item => <OrderCard key={item.id} item={item}/>)}
          </View>
        );
      }
    } else {
      return (
        <View style={orderStyles.emptyContainer}>
          <TextView style={orderStyles.emptyText}>سفارشی موجود نیست</TextView>
        </View>
      );
    }
  };

  useEffect(() => {
    switch (tab) {
      case tabs.Created:
        setItems(cartReducer);
        break;
      case tabs.InProgress:
        setItems(orders.filter(e => [OrderStatus.InProgress, OrderStatus.Assigned, OrderStatus.Paid].includes(e.status)));
        break;
      case tabs.Done:
        setItems(orders.filter(e => e.status == OrderStatus.Done));
        break;
    }
  }, [tab, orders]);

  useEffect(() => {
    if (!tab) {
      if (cartReducer.length > 0) {
        setTab(tabs.Created);
      } else if (orders.filter(e => [OrderStatus.InProgress, OrderStatus.Assigned, OrderStatus.Paid].includes(e.status)).length > 0) {
        setTab(tabs.InProgress);
      } else {
        setTab(tabs.Done);
      }
    }
    setCounts({
      Created: cartReducer.length,
      InProgress: orders.filter(e => [OrderStatus.InProgress, OrderStatus.Assigned, OrderStatus.Paid].includes(e.status)).length,
      Done: orders.filter(e => e.status == OrderStatus.Done).length
    });
  }, [orders]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
      <Header/>
      <View style={orderStyles.container}>
        <ScrollView style={orderStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={orderStyles.contentContainer}>
            <View style={orderStyles.tabsContainer}>
              {(Object.keys(tabTitles) as tabKeys[]).map((key) => (
                <ButtonView
                  key={key}
                  style={[orderStyles.tab, tab === key ? orderStyles.selectedTab : {}]}
                  onPress={() => setTab(key)}
                >
                  <View style={[orderStyles.tabBadge, tab === key && orderStyles.selectedTabBadge]}>
                    <TextView style={[orderStyles.tabBadgeText, tab === key && orderStyles.selectedTabBadgeText]}>
                      {counts[key]}
                    </TextView>
                  </View>
                  <TextView style={[orderStyles.tabText, tab === key && orderStyles.selectedTabText]}>
                    {tabTitles[key]}
                  </TextView>
                </ButtonView>
              ))}
            </View>

            <View style={orderStyles.cartContainer}>
              {renderContent()}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

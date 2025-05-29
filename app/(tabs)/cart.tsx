import { Header } from '@/src/components/layouts/Header';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { CartPageTabEnum } from '@/src/features/cart/enums';
import { orderStyles } from '@/src/features/cart/styles';
import { CartPageTabKey } from '@/src/features/cart/types';
import CartPageTabs from '@/src/features/cart/views/cart/CartPageTabs';
import CartTab from '@/src/features/cart/views/cart/CartTab';
import OrderTab from '@/src/features/cart/views/cart/OrderTab';
import type { Order } from '@/src/features/order/types';
import React, { useState } from 'react';
import { ScrollView, StatusBar, View, } from 'react-native';

export default function Cart() {
  const cartItems = useAppSelector((state) => state.order?.cart);
  const orders = useAppSelector(state => state.order.orders);
  const [tab, setTab] = useState<CartPageTabKey>(CartPageTabEnum.Created);
  const [items, setItems] = useState<Order[]>([]);

  const renderContent = () => {
    if (items.length > 0) {
      switch (tab) {
        case(CartPageTabEnum.Created):
          return <CartTab items={items} />
        default:
          return <OrderTab items={items} />
      }
    } else {
      return (
        <View style={orderStyles.emptyContainer}>
          <TextView style={orderStyles.emptyText}>سفارشی موجود نیست</TextView>
        </View>
      );
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
      <Header/>
      <View style={orderStyles.container}>
        <ScrollView style={orderStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={orderStyles.contentContainer}>
            <CartPageTabs cartItems={cartItems} items={items} setTab={setTab} tab={tab} orders={orders} setItems={setItems} />
            <View style={orderStyles.cartContainer}>
              {renderContent()}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

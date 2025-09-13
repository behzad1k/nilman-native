import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { CartPageTabEnum } from '@/src/features/cart/enums';
import { orderStyles } from '@/src/features/cart/styles';
import { CartPageTabKey } from '@/src/features/cart/types';
import CartPageTabs from '@/src/features/cart/views/cart/CartPageTabs';
import CartTab from '@/src/features/cart/views/cart/CartTab';
import OrderCard from '@/src/features/cart/views/shared/OrderCard';
import type { Order } from '@/src/features/order/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.order?.cart);
  const orders = useAppSelector(state => state.order.orders);
  const [tab, setTab] = useState<CartPageTabKey>(CartPageTabEnum.Created);
  const [items, setItems] = useState<Order[]>([]);
  const styles = useThemedStyles(createStyles);

  const renderContent = () => {
    if (items.length > 0) {
      switch (tab) {
        case(CartPageTabEnum.Created):
          return <CartTab />;
        default:
          return items.map(item => <OrderCard key={item.id} item={item}/>);
        // return <OrderTab items={items} />
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
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <CartPageTabs cartItems={cartItems} items={items} setTab={setTab} tab={tab} orders={orders} setItems={setItems}/>
          <ScrollView contentContainerStyle={[styles.cartContainer, Platform.OS == 'web' && styles.contentContainerWEB]} showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>
      </View>
    </View>
  );

};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'right',
    color: theme.text
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.secondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  cartContainer: {
    paddingBottom: 70,
    paddingHorizontal: 8,
    gap: 20,
    backgroundColor: theme.background,
  },
  bottomSection: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 8,
    gap: 20,
    backgroundColor: theme.background,
    flex: 1
  },
  contentContainerWEB: {
    paddingBottom: 30
  }
});

export default CartPage;
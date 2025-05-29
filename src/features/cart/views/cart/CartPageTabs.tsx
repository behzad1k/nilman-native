import ButtonView from '@/src/components/ui/ButtonView';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch } from '@/src/configs/redux/hooks';
import { orderStyles } from '@/src/features/cart/styles';
import { Order } from '@/src/features/order/types'
import { CartPageTabKey } from '@/src/features/cart/types'
import { CartPageTabEnum } from '@/src/features/cart/enums'
import { OrderStatus } from '@/src/utils/enums';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

interface Props {
  items: Order[]
  orders: Order[]
  cartItems: Order[]
  tab: CartPageTabKey | null,
  setTab: React.Dispatch<React.SetStateAction<CartPageTabKey>>
  setItems: React.Dispatch<React.SetStateAction<Order[]>>
}

const tabTitles: Record<CartPageTabKey, string> = {
  Created: 'سبد خرید',
  InProgress: 'در حال انجام',
  Done: 'تکمیل شده',
};

const initCounts: Record<CartPageTabKey, number> = {
  Created: 0,
  InProgress: 0,
  Done: 0,
};

const CartPageTabs = ({ cartItems, tab, orders, setTab, items, setItems }: Props) => {
  const [counts, setCounts] = useState<Record<CartPageTabKey, number>>(initCounts);

  useEffect(() => {
    switch (tab) {
      case CartPageTabEnum.Created:
        setItems(cartItems);
        break;
      case CartPageTabEnum.InProgress:
        setItems(orders.filter(e => [OrderStatus.InProgress, OrderStatus.Assigned, OrderStatus.Paid].includes(e.status)));
        break;
      case CartPageTabEnum.Done:
        setItems(orders.filter(e => e.status == OrderStatus.Done));
        break;
    }
  }, [tab, orders]);

  useEffect(() => {
    if (cartItems.length > 0) {
      setTab(CartPageTabEnum.Created);
    } else if (orders.filter(e => [OrderStatus.InProgress, OrderStatus.Assigned, OrderStatus.Paid].includes(e.status)).length > 0) {
      setTab(CartPageTabEnum.InProgress);
    } else {
      setTab(CartPageTabEnum.Done);
    }
    setCounts({
      Created: cartItems.length,
      InProgress: orders.filter(e => [OrderStatus.InProgress, OrderStatus.Assigned, OrderStatus.Paid].includes(e.status)).length,
      Done: orders.filter(e => e.status == OrderStatus.Done).length
    });
  }, [orders]);
  
  return (
    <View style={orderStyles.tabsContainer}>
      {(Object.keys(tabTitles) as CartPageTabKey[]).map((key) => (
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
  )
}

export default CartPageTabs;
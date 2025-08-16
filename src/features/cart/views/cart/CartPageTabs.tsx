import ButtonView from '@/src/components/ui/ButtonView';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch } from '@/src/configs/redux/hooks';
import { orderStyles } from '@/src/features/cart/styles';
import { Order } from '@/src/features/order/types'
import { CartPageTabKey } from '@/src/features/cart/types'
import { CartPageTabEnum } from '@/src/features/cart/enums'
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import { OrderStatus } from '@/src/utils/enums';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '@/src/types/theme';

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
  const styles = useThemedStyles(createStyles)

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
  }, [orders, cartItems]);
  return (
    <View style={orderStyles.tabsContainer}>
      {(Object.keys(tabTitles) as CartPageTabKey[]).map((key) => (
        <ButtonView
          key={key}
          style={[styles.tab, tab === key ? orderStyles.selectedTab : {}]}
          onPress={() => setTab(key)}
        >
          <View style={[orderStyles.tabBadge, tab === key && orderStyles.selectedTabBadge]}>
            <TextView style={[orderStyles.tabBadgeText, tab === key && orderStyles.selectedTabBadgeText]}>
              {counts[key].toString()}
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

const createStyles = (theme: Theme) => StyleSheet.create({
  tab: {
    backgroundColor: theme.primary,
    borderStyle: 'solid',
    borderColor: colors.pink,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  }
})

export default CartPageTabs;
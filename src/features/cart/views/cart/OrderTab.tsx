import { orderStyles } from '@/src/features/cart/styles';
import OrderCard from '@/src/features/cart/views/shared/OrderCard';
import { Order } from '@/src/features/order/types'
import React from 'react';
import { View } from 'react-native';

interface Props {
  items: Order[]
}
const OrderTab = ({ items }: Props) => {
  return (
    <>
      {items.map(item => <OrderCard key={item.id} item={item} />)}
    </>
  )
}

export default OrderTab;
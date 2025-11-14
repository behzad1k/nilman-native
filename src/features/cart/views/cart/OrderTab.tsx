import { orderStyles } from '@/src/features/cart/styles';
import OrderCard from '@/src/features/cart/views/shared/OrderCard';
import { Order } from '@/src/features/order/types'
import moment from 'jalali-moment';
import React from 'react';
import { View } from 'react-native';

interface Props {
  items: Order[]
}
const OrderTab = ({ items }: Props) => {
  return (
    <>
      {items?.sort((a, b) => moment(`${b.date} ${b.time}`, 'jYYYY/jMM/jDD HH').unix() - moment(`${a.date} ${a.time}`, 'jYYYY/jMM/jDD HH').unix()).map(item => <OrderCard key={item.id} item={item} />)}
    </>
  )
}

export default OrderTab;
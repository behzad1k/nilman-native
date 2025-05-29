import { Header } from '@/src/components/layouts/Header';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { CartPageTabKey } from '@/src/features/cart/types';
import { CartPageTabEnum } from '@/src/features/cart/enums';
import CartPageTabs from '@/src/features/cart/views/cart/CartPageTabs';
import CartTab from '@/src/features/cart/views/cart/CartTab';
import OrderCard from '@/src/features/cart/views/shared/OrderCard';
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { orderStyles } from '@/src/features/cart/styles';
import type { Order } from '@/src/features/order/types';

export default function Cart() {

}

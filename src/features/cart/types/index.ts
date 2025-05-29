import { Service } from '@/src/features/service/serviceTypes';
import { User } from '@/src/features/user/types';
import { Address } from '@/src/features/address/types';
import { OrderStatus } from '@/src/utils/enums';

export interface Order {
  attributes: Service[];
  id: number;
  addressId: number;
  title: string;
  price: number;
  finalPrice: number;
  date: string;
  time: string;
  code: string;
  discount: number;
  discountAmount: number;
  transportation: number | string;
  status: OrderStatus;
  worker: User;
  serviceId: number;
  service: Service;
  attribute?: Service;
  address: Address;
  fromTime: number;
  toTime: number;
  done: boolean;
  isUrgent: boolean;
  orderServices: OrderService[];
  isFeedbacked: boolean;
  createdAt: Date
}
export interface Form {
  service: Service | null;
  attributeStep: Service | null;
  attributes: Service[];
  address: Address | null;
  price: number;
  worker: string | null;
  date: string | null;
  time: number | null;
  discount: string | null;
  isUrgent: boolean;
  isMulti: boolean;
  options: any;
};

export interface Color {
  id: number;
  title: string;
  description: string;
}

export interface OrderService {
  id: number;
  serviceId: number;
  orderId: number;
  mediaId: number | null;
  price: number;
  count: number;
  pinterest: string | null;
  date: string | null;
  time: number | null;
  isAddOn: boolean;
  finalPrice: number;
  discountPrice: number;
  order: Order;
  colors: Color[];
  service: Service;
  addOns: OrderServiceAddOn[]
};



export interface OrderServiceAddOn {
  price: number;
  singlePrice: number;
  count: number;
  addOnId: number;
  orderServiceId: number;
  addOn: Service;
};

export interface ICartSlice {
  cartItems: Order[];
}
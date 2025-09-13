import { Address } from '@/src/features/address/types';
import { Service } from '@/src/features/service/types';
import { User } from '@/src/features/user/types';
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
  attributeStep?: Service | null;
  attributes: Service[];
  address: Address | null;
  price: number;
  worker: string | null;
  date: string | null;
  time: number | null;
  discount?: string;
  isUrgent: boolean;
  isMulti: boolean;
  options: FormOptions;
}

export interface OrderStorage extends Form{
  step: Step,
  timestamp: Date,
}

export interface OrderRequest {
  service?: string;
  attributes: FormOptions;
  addressId?: number;
  workerId?: number;
  date: string | null;
  time: number | null;
  discount?: string;
  isUrgent: boolean;
}

export interface Step {
  index: number,
  name: string
}
export interface FormOptions {
  [key: string]: {
    count: number;
    colors?: string[];
    media?: {
      data: any;
      preview?: string;
    };
    pinterest?: string;
    addOns?: {
      [key: number]: {
        count: number;
      };
    };
  };
}

export interface Color {
  id: number;
  title: string;
  slug: string;
  code: string;
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

export interface PickingColor {
  attr: Service | null,
  open: boolean
}

export interface OrderServiceAddOn {
  price: number;
  singlePrice: number;
  count: number;
  addOnId: number;
  orderServiceId: number;
  addOn: Service;
};

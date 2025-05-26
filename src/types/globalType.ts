// src/types/globalType.ts

namespace globalType {
  export interface Address {
    id: number;
    title: string;
    phoneNumber?: string;
    longitude: number;
    latitude: number;
    description: string;
    pelak?: string;
    vahed?: string;
    floor?: string;
    districtId?: number;
  }

  export interface Position {
    lng: string;
    lat: string;
  }

  export interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    slug: string;
    pricePlus: number;
    section: number;
    parent?: Service;
    attributes?: Service[];
    hasColor: boolean;
    isMulti: boolean;
    hasMedia: boolean;
    color?: string;
    media: any;
    sort: number;
    openDrawer: boolean;
    showInList: boolean;
    addOns: Service[];
  }

  export interface Order {
    attributes: Service[];
    id: number;
    title: string;
    price: number;
    finalPrice: number;
    date: string;
    time: string;
    code: string;
    discount: number;
    discountAmount: number;
    transportation: number | string;
    status: 'ACCEPTED' | 'PAID' | 'Done' | 'CREATED' | 'ASSIGNED' | 'Canceled';
    worker: User;
    serviceId: number;
    service: Service;
    attribute?: Service;
    address?: Address;
    fromTime: number;
    toTime: number;
    done: boolean;
    isUrgent: boolean;
    orderServices?: OrderService[];
    isFeedbacked: boolean;
  }

  export interface User {
    id: number;
    name: string;
    lastName: string;
    nationalCode: string;
    phoneNumber: string;
    role: 'USER' | 'WORKER' | 'OPERATOR' | 'SUPER_ADMIN';
    profilePic: { url: string };
    isWorkerChoosable?: boolean;
    walletBalance: number;
    services?: Service[]
  }

  export interface Form {
    service: globalType.Service | null;
    attributeStep: globalType.Service | null;
    attributes: globalType.Service[];
    address: globalType.Address | null;
    price: number;
    worker: string | null;
    date: string | null;
    time: number | null;
    discount: string | null;
    isUrgent: boolean;
    isMulti: boolean;
    options: Record<string, any>;
  }

  export interface Color {
    id: number;
    title: string;
    description: string;
    code: string;
    slug: string;
  }

  export interface OrderService {
    id: number;
    serviceId: number;
    orderId: number;
    mediaId: number | null;
    price: number | null;
    count: number;
    pinterest: string | null;
    date: string | null;
    time: number | null;
    isAddOn: boolean;
    order: Order;
    colors: Color[];
    service: Service;
    addOns: OrderServiceAddOn[];
  }

  export interface OrderServiceAddOn {
    price: number;
    singlePrice: number;
    count: number;
    addOnId: number;
    orderServiceId: number;
    addOn: Service;
  }

  export interface ICartSlice {
    cartItems: Order[];
  }

  export interface ISliderCardInfo {
    url: string;
    title: string;
  }
}

export default globalType;

import ENDPOINTS from '@/src/configs/api/endpoints';
import { Order, Color, Form, OrderRequest, Step, OrderStorage } from '@/src/features/order/types';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';
import { STORAGE_KEYS } from '@/src/utils/storage';
import moment from 'jalali-moment';
import { Toast } from 'toastify-react-native';
import { translate as t } from '@/src/configs/translations/staticTranslations';

export class InvalidOrder extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}
class OrderService {
  constructor(private deps: ServiceDependencies) {}

  async getColors(): Promise<ApiResponse<Color[]>>{
    return await this.deps.apiClient.get(ENDPOINTS.GLOBAL.COLOR);
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return await this.deps.apiClient.get(ENDPOINTS.ORDER.INDEX);
  }

  async submitOrder(selected: Form): Promise<ApiResponse<Order>> {
    const reqOptions: OrderRequest = {
      service: selected.service?.slug,
      attributes: selected.options,
      addressId: selected.address?.id,
      time: selected.time,
      date: selected.date,
      workerId: Number(selected.worker),
      discount: selected.discount,
      isUrgent: selected.isUrgent,
    };

    return await this.deps.apiClient.post(ENDPOINTS.ORDER.INDEX, reqOptions);
  }
  async setSavedOrder(data: Form, step: Step): Promise<void> {
    await this.deps.storage.setItem(STORAGE_KEYS.NEW_ORDER, JSON.stringify({ ...data, step, timestamp: new Date() }));
  }
  async getSavedOrder(): Promise<OrderStorage | undefined> {
    const newOrderObject = await this.deps.storage.getItem(STORAGE_KEYS.NEW_ORDER)
    console.log('past', newOrderObject);
    if (newOrderObject) {
      const newOrderObjectParsed = JSON.parse(newOrderObject);
      console.log('heee');
      console.log(newOrderObjectParsed);
      console.log(newOrderObjectParsed.timestamp);
      console.log(moment().diff(newOrderObjectParsed.timestamp, 'minutes'));
      if (moment().diff(newOrderObjectParsed.timestamp, 'minutes') < 60) {
        return JSON.parse(newOrderObject)
      }
      this.deps.storage.removeItem(STORAGE_KEYS.NEW_ORDER)
    }
    return
  }
  async removeSavedOrder(): Promise<void> {
    await this.deps.storage.removeItem(STORAGE_KEYS.NEW_ORDER)
  }
}

export default OrderService
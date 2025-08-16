import ENDPOINTS from '@/src/configs/api/endpoints';
import { Order, Color, Form, OrderRequest, Step } from '@/src/features/order/types';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';
import { STORAGE_KEYS } from '@/src/utils/storage';
import Toast from 'react-native-toast-message';
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
    if (!selected.date || !selected.time) {
      Toast.show({
        type: 'error',
        text1: 'لطفا تاریخ و ساعت را انتخاب کنید',
      });
      throw new InvalidOrder(t('validation.errors.invalidDateTime'))
    }

    if (Object.keys(selected.options).length === 0) {
      Toast.show({
        type: 'error',
        text1: 'لطفا خدمات انتخاب شده را بررسی کنید',
      });
      throw new InvalidOrder(t('validation.errors.invalidServices'))
    }

    if (!selected.address?.id) {
      Toast.show({
        type: 'error',
        text1: 'لطفا آدرس انتخاب شده را بررسی کنید',
      });
      throw new InvalidOrder(t('validation.errors.invalidAddress'))
    }

    const reqOptions: OrderRequest = {
      service: selected.service?.slug,
      attributes: selected.options,
      addressId: selected.address.id,
      time: selected.time,
      date: selected.date,
      workerId: Number(selected.worker),
      discount: selected.discount,
      isUrgent: selected.isUrgent,
    };

    return await this.deps.apiClient.post(ENDPOINTS.ORDER.INDEX, reqOptions);
  }
  async getSavedOrder(): Promise<Form | undefined> {
    const newOrderObject = await this.deps.storage.getItem(STORAGE_KEYS.NEW_ORDER)
    if (newOrderObject) {
      return JSON.parse(newOrderObject)
    }
    return
  }
  async getSavedStep(): Promise<Step | undefined> {
    const orderStepObject = await this.deps.storage.getItem(STORAGE_KEYS.ORDER_STEP)
    if (orderStepObject) {
      return JSON.parse(orderStepObject)
    }
    return
  }
}

export default OrderService
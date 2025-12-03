import ENDPOINTS from '@/src/configs/api/endpoints';
import { Order, Color, Form, OrderRequest, Step, OrderStorage, Stylist } from '@/src/features/order/types';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';
import { STORAGE_KEYS } from '@/src/utils/storage';
import moment from 'jalali-moment';
import { Toast } from 'toastify-react-native';

export class InvalidOrder extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'InvalidOrderError';
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

  private validateOrderColors(selected: Form, allServices: any[]): boolean {
    // Check if all services with hasColor have colors selected
    for (const [serviceId, options] of Object.entries(selected.options)) {
      const service = allServices.find(s => s.id.toString() === serviceId);

      if (service?.hasColor) {
        if (!options.colors || options.colors.length === 0) {
          Toast.show({
            type: 'error',
            text1: `لطفا رنگ برای ${service.title} را انتخاب کنید`
          });
          return false;
        }
      }

      // Check addOns for hasColor
      if (options.addOns) {
        for (const addOnId of Object.keys(options.addOns)) {
          const addOnService = allServices.find(s => s.id.toString() === addOnId);
          if (addOnService?.hasColor) {
            if (!options.colors || options.colors.length === 0) {
              Toast.show({
                type: 'error',
                text1: `لطفا رنگ برای ${addOnService.title} را انتخاب کنید`
              });
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  async submitOrder(selected: Form, allServices?: any[]): Promise<ApiResponse<Order>> {
    // Validate colors before submission if allServices is provided
    if (allServices && !this.validateOrderColors(selected, allServices)) {
      throw new InvalidOrder('Color selection is required for some services', 'COLOR_REQUIRED');
    }

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

  async fetchWorkerOffs(attributes: string[], addressId: number, workerId?: number | null): Promise<ApiResponse<Stylist[]>> {
    return await this.deps.apiClient.post(ENDPOINTS.USER.WORKER_OFFS, { attributes, workerId, addressId });
  }

  async getSavedOrder(): Promise<OrderStorage | undefined> {
    const newOrderObject = await this.deps.storage.getItem(STORAGE_KEYS.NEW_ORDER)
    if (newOrderObject) {
      const newOrderObjectParsed = JSON.parse(newOrderObject);
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

  async paymentVerify(data: any): Promise<void> {
    return await this.deps.apiClient.post(ENDPOINTS.ORDER.PAYMENT_VERIFY, data)
  }
}

export default OrderService
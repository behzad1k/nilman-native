import ENDPOINTS from '@/src/configs/api/endpoints';
import { ApiResponse } from '@/src/types/api';
import { Order } from '@/src/features/order/types'
import { ServiceDependencies } from '@/src/types/services';

export class OrderServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OrderServiceError';
  }
}

export class OrderService {
  constructor(private deps: ServiceDependencies) {}

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return await this.deps.apiClient.get(ENDPOINTS.ORDER.INDEX);
  }

  async getCart(): Promise<ApiResponse<Order[]>> {
    return await this.deps.apiClient.get(ENDPOINTS.ORDER.CART);
  }

  async storeStep(step: any): Promise<void> {
    try {
      await this.deps.storage.setItem('step', JSON.stringify(step));
    } catch (error) {
      console.error('Error storing step:', error);
    }
  }

  async getStep(): Promise<any | undefined> {
    try {
      const step = await this.deps.storage.getItem('step');
      return step ? JSON.parse(step) : null;
    } catch (error) {
      console.error('Error getting step:', error);
      return null;
    }
  };

  async storeNewOrder(order: Order): Promise<void> {
    try {
      await this.deps.storage.setItem('new-order', JSON.stringify(order));
    } catch (error) {
      console.error('Error storing new order:', error);
    }
  };

  async getNewOrder(): Promise<Order | null> {
    try {
      const order = await this.deps.storage.getItem('new-order');
      return order ? JSON.parse(order) : null;
    } catch (error) {
      console.error('Error getting new order:', error);
      return null;
    }
  };

  async removeStep(): Promise<void> {
    try {
      await this.deps.storage.removeItem('step');
    } catch (error) {
      console.error('Error removing step:', error);
    }
  };

  async removeNewOrder(): Promise<void> {
    try {
      await this.deps.storage.removeItem('new-order');
    } catch (error) {
      console.error('Error removing new order:', error);
    }
  }
};
export default OrderService
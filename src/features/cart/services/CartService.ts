import ENDPOINTS from '@/src/configs/api/endpoints';
import { Form, Order, OrderRequest } from '@/src/features/order/types';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';
import { STORAGE_KEYS } from '@/src/utils/storage';

export class CartServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OrderServiceError';
  }
}

class CartService {
  constructor(private deps: ServiceDependencies) {
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

  async deleteCartItem(id: number): Promise<ApiResponse> {
    try{
      return await this.deps.apiClient.delete(ENDPOINTS.ORDER.INDEX, { body: JSON.stringify({ orderId: id }) })
    } catch (e) {
      throw e;
    }
  }

  async reOrder(data: Form): Promise<void> {
    try {
      await this.deps.storage.setItem(STORAGE_KEYS.NEW_ORDER, JSON.stringify(data))
      await this.deps.storage.setItem(STORAGE_KEYS.ORDER_STEP, JSON.stringify({
        name: 'address',
        index: 2
      }))
    } catch (e) {
      throw e
    }
  }
};
export default CartService;
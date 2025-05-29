import { apiClient } from '@/src/configs/api/apiClient';
import { OrderService } from '@/src/features/cart/services/OrderService';
import { StorageService } from '@/src/utils/storage';
import { AuthService } from '@/src/features/auth/services/AuthService';
import { ServiceDependencies } from '@/src/types/services';

// Create the dependencies object
const dependencies: ServiceDependencies = {
  apiClient: apiClient,
  storage: StorageService,
};

// Create service instances
export const authService = new AuthService(dependencies);
export const orderService = new OrderService(dependencies);

// You can add more services here as you create them
// export const userService = new UserService(dependencies);
// export const orderService = new OrderService(dependencies);

export const services = {
  auth: authService,
  // user: userService,
  order: orderService,
} as const
;
import { apiClient } from '@/src/configs/api/apiClient';
import AddressService from '@/src/features/address/services/AddressService';
import CartService from '@/src/features/cart/services/CartService';
import OrderService from '@/src/features/order/services/OrderService';
import ServiceService from '@/src/features/service/services/ServiceService';
import UserService from '@/src/features/user/services/UserService';
import { StorageService } from '@/src/utils/storage';
import { AuthService } from '@/src/features/auth/services/AuthService';
import { ServiceDependencies } from '@/src/types/services';

const baseDependencies = {
  apiClient: apiClient,
  storage: StorageService,
};

export const cartService = new CartService(baseDependencies);

export const serviceService = new ServiceService(baseDependencies);

export const orderService = new OrderService(baseDependencies);

export const authService = new AuthService(baseDependencies);

export const addressService = new AddressService(baseDependencies);

const userServiceDependencies: ServiceDependencies = {
  ...baseDependencies,
  cartService: cartService,
};

export const userService = new UserService(userServiceDependencies);

export const services = {
  auth: authService,
  user: userService,
  cart: cartService,
  service: serviceService,
  order: orderService,
  address: addressService
} as const;

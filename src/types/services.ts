// Define what each service dependency should look like
import CartService from '@/src/features/cart/services/CartService';

export interface ApiClient {
  post<T>(url: string, data: any, config?: any): Promise<T>;
  get<T>(url: string, config?: any): Promise<T>;
  put<T>(url: string, data: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
}

export interface StorageProvider {
  // Basic storage
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;

  // Auth-specific storage
  setToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  removeToken(): Promise<void>;
  setTempToken(token: string): Promise<void>;
  getTempToken(): Promise<string | null>;
  removeTempToken(): Promise<void>;
}

export interface ServiceDependencies {
  apiClient: ApiClient;
  storage: StorageProvider;
  cartService?: CartService;
}

import { apiClient } from '@/src/configs/api/apiClient';
import ENDPOINTS from '@/src/configs/api/endpoints';
import { User } from '@/src/features/user/types';
import { ApiResponse } from '@/src/types/api';
import { Address } from '@/src/features/address/types'
import { ServiceDependencies } from '@/src/types/services';

export class UserServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

class UserService {
  constructor(private deps: ServiceDependencies) {}

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await this.deps.apiClient.get(ENDPOINTS.USER.INDEX);
  }
  async getUserWorkers(): Promise<ApiResponse<User[]>> {
    return await this.deps.apiClient.get(ENDPOINTS.USER.WORKERS);
  }
  async logout(): Promise<boolean> {
    try{
      await this.deps.storage.removeToken();
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }
}
export default UserService
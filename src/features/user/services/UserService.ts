import { apiClient } from '@/src/configs/api/apiClient';
import ENDPOINTS from '@/src/configs/api/endpoints';
import { User } from '@/src/features/user/types';
import { ApiResponse } from '@/src/types/api';
import { Address } from '@/src/features/address/types'

export class UserServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

const UserService = {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiClient.get(ENDPOINTS.USER.INDEX);
  },
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return await apiClient.get(ENDPOINTS.ADDRESS.INDEX);
  },
  async getUserWorkers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get(ENDPOINTS.USER.WORKERS);
  },
};
export default UserService
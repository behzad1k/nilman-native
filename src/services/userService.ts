import { apiClient } from '@/src/configs/api/apiClient';
import { ApiResponse } from '@/src/types/api';
import { StorageService } from '@/src/utils/storage';

export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const userService = {
  async login(credentials: LoginRequest): Promise<User> {
    const response: ApiResponse<LoginResponse> = await apiClient.post(
      '/auth/login',
      credentials,
      { skipAuth: true }
    );

    // Store the token
    await StorageService.setToken(response.data.token);

    return response.data.user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      await StorageService.removeToken();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response: ApiResponse<User> = await apiClient.get('/user');
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response: ApiResponse<User> = await apiClient.put('/user/profile', userData);
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const response: ApiResponse<{ token: string }> = await apiClient.post('/auth/refresh');
    await StorageService.setToken(response.data.token);
    return response.data.token;
  },

  async isAuthenticated(): Promise<boolean> {
    return await StorageService.hasToken();
  },
};

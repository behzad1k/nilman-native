import ENDPOINTS from '@/src/configs/api/endpoints';
import { translate as t } from '@/src/configs/translations/staticTranslations';
import { LoginRequest, LoginResponse, VerifyRequest, VerifyResponse } from '@/src/features/auth/authTypes';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';

export class AuthServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export class AuthService {
  constructor(private deps: ServiceDependencies) {}

  async login(credentials: LoginRequest): Promise<boolean> {
    if (!credentials.phoneNumber) {
      throw new AuthServiceError(t('validation.phoneNumberNotSet'));
    } else if (credentials.phoneNumber.length != 11){
      throw new AuthServiceError(t('validation.phoneNumberInvalid'))
    }

    try {
      const response: LoginResponse = await this.deps.apiClient.post(
        ENDPOINTS.AUTH.LOGIN,
        credentials,
        { skipAuth: true }
      );

      await this.deps.storage.setTempToken(response.token);
      return true;
    } catch (error) {
      throw new AuthServiceError('Login failed');
    }
  }

  async verifyOTP(data: VerifyRequest): Promise<ApiResponse<VerifyResponse>> {
    if (!data.code || data.code.length !== 6) {
      throw new AuthServiceError(t('validation.optInvalid'))
    }

    try {
      const response: ApiResponse<VerifyResponse> = await this.deps.apiClient.post(
        ENDPOINTS.AUTH.VERIFY,
        data,
        { skipAuth: true }
      );

      await this.deps.storage.removeTempToken();
      await this.deps.storage.setToken(response.data.token);

      return response;
    } catch (error) {
      throw new AuthServiceError('OTP verification failed');
    }
  }

  async logout(): Promise<void> {
    await this.deps.storage.removeToken();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.deps.storage.getToken();
    return !!token;
  }

  async getTempToken(): Promise<string | null> {
    return await this.deps.storage.getTempToken();
  }
}

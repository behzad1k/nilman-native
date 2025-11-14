import ENDPOINTS from '@/src/configs/api/endpoints';
import { translate as t } from '@/src/configs/translations/staticTranslations';
import { LoginForm, LoginRequest, LoginResponse, VerifyRequest, VerifyResponse } from '@/src/features/auth/authTypes';
import { ApiResponse } from '@/src/types/api';
import { ServiceDependencies } from '@/src/types/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';

export class AuthServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

// Add event types for auth state changes
export type AuthEventType = 'login' | 'logout' | 'tokenExpired' | 'authStateChanged';
export type AuthEventCallback = (eventType: AuthEventType, data?: any) => void;

export class AuthService {
  private authEventListeners: AuthEventCallback[] = [];

  constructor(private deps: ServiceDependencies) {}

  // Event management methods
  onAuthStateChange(callback: AuthEventCallback): () => void {
    this.authEventListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.authEventListeners.indexOf(callback);
      if (index > -1) {
        this.authEventListeners.splice(index, 1);
      }
    };
  }

  private emitAuthEvent(eventType: AuthEventType, data?: any): void {
    this.authEventListeners.forEach(callback => {
      try {
        callback(eventType, data);
      } catch (error) {
        console.error('Error in auth event callback:', error);
      }
    });
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    if (!credentials.phoneNumber) {
      throw new AuthServiceError(t('validation.phoneNumberNotSet'));
    } else if (credentials.phoneNumber.length != 11) {
      throw new AuthServiceError(t('validation.phoneNumberInvalid'));
    }
    try {
      const response: LoginResponse = await this.deps.apiClient.post(
        ENDPOINTS.AUTH.LOGIN,
        credentials,
        { skipAuth: true }
      );
      await this.deps.storage.setTempToken(response.token);

      // Don't emit login event yet - wait for OTP verification
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw new AuthServiceError('Login failed');
    }
  }

  async verifyOTP(data: VerifyRequest): Promise<ApiResponse<VerifyResponse>> {
    if (!data.code || data.code.length !== 6) {
      throw new AuthServiceError(t('validation.optInvalid'));
    }

    try {
      const response: ApiResponse<VerifyResponse> = await this.deps.apiClient.post(
        ENDPOINTS.AUTH.VERIFY,
        data,
        { skipAuth: true }
      );

      await this.deps.storage.removeTempToken();
      await this.deps.storage.setToken(response.data.token);

      // Emit login event after successful verification
      this.emitAuthEvent('login', { token: response.data.token });
      this.emitAuthEvent('authStateChanged', { isAuthenticated: true });

      return response;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw new AuthServiceError('OTP verification failed');
    }
  }

  async logout(): Promise<boolean> {
    try {
      await AsyncStorage.clear();

      // Clear any other auth-related data
      // if (this.deps.sessionService) {
      //   await this.deps.sessionService.clearAllSessions();
      // }

      // Emit logout events
      this.emitAuthEvent('logout');
      this.emitAuthEvent('authStateChanged', { isAuthenticated: false });

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {

    try {
      const token = await this.deps.storage.getToken();

      if (!token) {
        return false;
      }

      // Optional: Validate token with server
      const isValid = await this.validateToken(token);

      if (!isValid) {
        // Token is invalid, clean up
        await this.handleInvalidToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  async validateToken(token?: string): Promise<boolean> {
    try {
      const tokenToValidate = token || await this.deps.storage.getToken();

      if (!tokenToValidate) {
        return false;
      }

      // Optional: Add token validation endpoint call
      // const response = await this.deps.apiClient.get(ENDPOINTS.AUTH.VALIDATE_TOKEN);
      // return response.valid;

      // For now, just check if token exists and is not expired
      // You can add JWT token parsing here if needed
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  private async handleInvalidToken(): Promise<void> {
    await this.deps.storage.removeToken();
    await this.deps.storage.removeTempToken();

    this.emitAuthEvent('tokenExpired');
    this.emitAuthEvent('authStateChanged', { isAuthenticated: false });
  }

  async getTempToken(): Promise<string | null> {
    try {
      return await this.deps.storage.getTempToken();
    } catch (error) {
      console.error('Error getting temp token:', error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await this.deps.storage.getToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const currentToken = await this.deps.storage.getToken();

      if (!currentToken) {
        return false;
      }

      // Add refresh token endpoint call if you have one
      // const response = await this.deps.apiClient.post(ENDPOINTS.AUTH.REFRESH, {
      //   token: currentToken
      // });
      //
      // await this.deps.storage.setToken(response.data.token);
      // this.emitAuthEvent('authStateChanged', { isAuthenticated: true });

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.handleInvalidToken();
      return false;
    }
  }
  async completeProfile(data: LoginForm): Promise<VerifyResponse> {
    if (!data.name || data.name.length < 3) {
      Toast.show({
        type: 'warn',
        text1: 'لطفا نام خود را به درستی وارد کنید',
        position: 'bottom',
      });
      throw new AuthServiceError(t('validation.nameInvalid'));
    }

    if (!data.lastName || data.lastName.length < 3) {
      Toast.show({
        type: 'warn',
        text1: 'لطفا نام خانوادگی خود را به درستی وارد کنید',
        position: 'bottom',
      });
      throw new AuthServiceError(t('validation.lastNameInvalid'));
    }

    if (!data.nationalCode || data.nationalCode.length !== 10) {
      Toast.show({
        type: 'warn',
        text1: 'لطفا کد ملی خود را به درستی وارد کنید',
        position: 'bottom',
      });
      throw new AuthServiceError(t('validation.nationalCodeInvalid'));
    }
    try{
      const res: VerifyResponse = await this.deps.apiClient.put(ENDPOINTS.USER.INDEX, data);
      if (res.code == 200){
        await Promise.all([
          this.deps.storage.setToken(res.token),
          this.deps.storage.removeItem('login-step'),
          this.deps.storage.removeItem('login-step-token')
        ]);
        Toast.show({
          type: 'success',
          text1: t('general.welcome'),
          position: 'top',
        });

        return res;
      } else if (res.code === 1005) {
        Toast.show({
          type: 'error',
          text1: t('api_error.nationalCodeAndPhoneNotMatched'),
          position: 'top',
        });
        throw new AuthServiceError(t('api_error.nationalCodeAndPhoneNotMatched'));
      } else {
        throw new AuthServiceError(t('api_error.invalidRequest'));
      }
    }catch (e){
      console.log(e);
      throw new AuthServiceError(t('api_error.invalidResponse'));
    }
  }
  async getLoginStep(): Promise<string | null> {
    return await this.deps.storage.getItem('login-step')
  }
  // Method to manually trigger auth state check
  async checkAndUpdateAuthState(): Promise<boolean> {
    const isAuth = await this.isAuthenticated();
    this.emitAuthEvent('authStateChanged', { isAuthenticated: isAuth });
    return isAuth;
  }
}

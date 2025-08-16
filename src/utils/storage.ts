import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  LANGUAGE: 'user-language',
  USER_PREFERENCES: 'user-preferences',
  TEMP_TOKEN_KEY: '@app_auth_tmp_token',
  TOKEN_KEY: '@app_auth_token',
  THEME: 'app_theme_preference',
  LOGIN_STEP: 'app_login_step',
  ORDER_STEP: 'app_order_step',
  NEW_ORDER: 'app_new_order',
} as const;

export class StorageService {
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  static async getLanguage(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
  }

  static async setLanguage(language: string): Promise<void> {
    return AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static async getTempToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TEMP_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_KEY, token, );
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  }

  static async setTempToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TEMP_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  static async removeTempToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TEMP_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  static async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null && token.length > 0;
  }
}

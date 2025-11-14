import { User } from '@/src/features/user/types';

export interface LoginForm {
  phoneNumber: string;
  otp?: string;
  name?: string;
  lastName?: string;
  nationalCode?: string;
  birthday?: string;
}

export interface LoginRequest {
  phoneNumber: string;
}

export interface VerifyRequest {
  code: string;
  token: string;
}

export interface LoginResponse {
  code: number;
  token: string;
}

export interface VerifyResponse {
  code?: number;
  user: User,
  token: string
}

export type LoginState = 'phoneNumber' | 'otp' | 'complete-profile';

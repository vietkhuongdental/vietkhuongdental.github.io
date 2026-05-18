import type { RoleType } from '@/constants';

export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birth?: string;
  imageUrl?: string;
  role?: 'expert' | 'patient';
}

export interface UserSignUp {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: RoleType;
  ageConfirm: boolean;
  agreePolicyConfirm: boolean;
}

export interface OtpVerification {
  email: string;
  otpCode: string;
}

export interface ResendOtpVerification {
  email: string;
}

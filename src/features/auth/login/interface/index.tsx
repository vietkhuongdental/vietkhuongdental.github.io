import type { RoleType } from '@/constants';

export interface UserLogin {
  userName: string;
  password: string;
  role?: string;
  rememberMe?: boolean;
}

export interface UserLoginResponse {
  account: AccountResponse;
  token: TokenResponse;
  signature: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessZaloToken: string;
}

interface AccountResponse {
  id: string;
  userName: string;
  role: RoleType;
}

export interface OtpVerification {
  email: string;
  otpCode: string;
}

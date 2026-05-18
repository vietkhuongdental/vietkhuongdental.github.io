/* eslint-disable @typescript-eslint/naming-convention */
export const configs = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_GOOGLE_URL: import.meta.env.VITE_API_GOOGLE_URL,
  SUPABASE_FUNCTIONS_URL: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL,
  SUPABASE_PUBLISHABLE_DEFAULT_KEY: import.meta.env
    .VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  ZALO_OAID: import.meta.env.VITE_ZALO_OAID,
  CONNECTION_TIMEOUT: 30000
};

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAt: Date;
  refreshTokenExpiredAt: Date;
}

// Match with BE config:
export const ErrorCode = {
  NoError: 0,
  ErrorInternalServer: 1,
  ErrorInvalidToken: 2,
  ErrorTokenExpired: 3,
  ErrorAccountNotFound: 4,
  ErrorFileNotFound: 5,
  ErrorUnauthorized: 6,
  ErrorAccountBlocked: 7,
  ErrorAccountDoNotHaveEnoughPermission: 8,

  ErrorTwilioResponse: 9,
  ErrorEmailNotFound: 10,
  ErrorCodeRateLimitExceeded: 11,
  ErrorEmailAlreadyInUse: 12,
  ErrorInvalidParameter: 13,
  ErrorInvalidCredentials: 14,
  ErrorInvalidResetPasswordToken: 15,
  ErrorAccountPasswordCorrupted: 16,
  ErrorInvalidOtpCode: 17,
  ErrorValidationFailed: 18,
  ErrorEmailAlreadySoftDeleted: 19
};

export interface ForgotPasswordEmailInput {
  email: string;
}

export interface ForgotPasswordNewPasswordPayload {
  email: string;
  newPassword: string;
  resetPasswordToken: string;
}

export interface ForgotPasswordNewPasswordInput {
  newPassword: string;
  confirmNewPassword: string;
}

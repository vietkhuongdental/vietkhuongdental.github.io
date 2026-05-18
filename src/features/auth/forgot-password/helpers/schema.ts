/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';

import type {
  ForgotPasswordEmailInput,
  ForgotPasswordNewPasswordInput
} from '../interface';

export enum EmailInputFormKey {
  Email = 'email'
}

export const ForgotPasswordEmailInputSchema = z.object({
  [EmailInputFormKey.Email]: z
    .string()
    .min(1, 'This field is required')
    .email('Invalid format')
});

export type ForgotPasswordEmailInputSData = z.infer<
  typeof ForgotPasswordEmailInputSchema
>;

export const initialValue: ForgotPasswordEmailInput = {
  [EmailInputFormKey.Email]: ''
};

export enum NewPasswordInputFormKey {
  ConfirmNewPassword = 'confirmNewPassword',
  Email = 'email',

  NewPassword = 'newPassword',

  ResetPasswordToken = 'resetPasswordToken'
}

export const ForgotPasswordNewPasswordInputSchema = z.object({
  [NewPasswordInputFormKey.NewPassword]: z
    .string()
    .min(1, 'This field is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  [NewPasswordInputFormKey.ConfirmNewPassword]: z
    .string()
    .min(1, 'This field is required')
});

export type ForgotPasswordNewPasswordInputSData = z.infer<
  typeof ForgotPasswordNewPasswordInputSchema
>;

export const initialNewPasswordValue: ForgotPasswordNewPasswordInput = {
  [NewPasswordInputFormKey.NewPassword]: '',
  [NewPasswordInputFormKey.ConfirmNewPassword]: ''
};

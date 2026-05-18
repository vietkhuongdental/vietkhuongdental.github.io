/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import type { ChangePasswordForm } from '@/features/account/interface';
import { z } from 'zod';

export enum ChangePasswordFormKey {
  ConfirmPassword = 'confirmPassword',
  CurrentPassword = 'currentPassword',
  NewPassword = 'newPassword'
}

export const changePasswordFormSchema = z
  .object({
    [ChangePasswordFormKey.CurrentPassword]: z
      .string()
      .min(1, 'This field is required')
      .max(100, 'Maximum characters is 100')
      .regex(
        /[A-Z]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[a-z]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[0-9]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    [ChangePasswordFormKey.NewPassword]: z
      .string()
      .min(1, 'This field is required')
      .min(
        8,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[A-Z]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[a-z]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[0-9]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    [ChangePasswordFormKey.ConfirmPassword]: z
      .string()
      .min(1, 'This field is required')
      .regex(
        /[A-Z]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[a-z]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[0-9]/,
        'Use at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      )
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      )
  })
  .refine(
    (data) =>
      data[ChangePasswordFormKey.NewPassword] ===
      data[ChangePasswordFormKey.ConfirmPassword],
    {
      path: [ChangePasswordFormKey.ConfirmPassword],
      message: 'Passwords do not match'
    }
  );

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export const initialValue: ChangePasswordForm = {
  [ChangePasswordFormKey.ConfirmPassword]: '',
  [ChangePasswordFormKey.NewPassword]: '',
  [ChangePasswordFormKey.CurrentPassword]: ''
};

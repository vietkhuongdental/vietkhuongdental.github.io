/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { RoleType } from '@/constants';
import type { UserSignUp } from '@/features/auth/sign-up/interface';
import { z } from 'zod';

export enum SignUpFormKey {
  AgeConfirm = 'ageConfirm',
  AgreePolicyConfirm = 'agreePolicyConfirm',
  ConfirmPassword = 'confirmPassword',
  Email = 'email',
  FullName = 'fullName',
  Password = 'password',
  Role = 'role'
}

export const signUpSchema = z
  .object({
    [SignUpFormKey.FullName]: z
      .string()
      .min(1, 'This field is required')
      .max(100, 'Maximum characters is 100'),
    [SignUpFormKey.Email]: z
      .string()
      .min(1, 'This field is required')
      .email('Invalid format'),
    [SignUpFormKey.Password]: z
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
    [SignUpFormKey.ConfirmPassword]: z
      .string()
      .min(1, 'This field is required'),
    [SignUpFormKey.AgeConfirm]: z
      .boolean()
      .refine((val) => val === true, { message: 'This field is required' }),

    [SignUpFormKey.AgreePolicyConfirm]: z
      .boolean()
      .refine((val) => val === true, { message: 'This field is required' })
  })
  .refine(
    (data) =>
      data[SignUpFormKey.Password] === data[SignUpFormKey.ConfirmPassword],
    {
      path: [SignUpFormKey.ConfirmPassword],
      message: 'Passwords do not match'
    }
  );

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const initialValue: UserSignUp = {
  [SignUpFormKey.ConfirmPassword]: '',
  [SignUpFormKey.Email]: '',
  [SignUpFormKey.FullName]: '',
  [SignUpFormKey.Password]: '',
  [SignUpFormKey.Role]: RoleType.PATIENT,
  [SignUpFormKey.AgeConfirm]: false,
  [SignUpFormKey.AgreePolicyConfirm]: false
};

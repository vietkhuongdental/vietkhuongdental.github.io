/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import type { RoleType, VerifyProfileStatus } from '@/constants';
import type { FileKey, FileProps, User } from '@/shared/interface';
import { z } from 'zod';

export const VerifyPatientSchema = z.object({
  organization: z
    .string()
    .min(1, 'This field is required')
    .max(150, 'Maximum 150 characters'),
  disease: z
    .string()
    .min(1, 'This field is required')
    .max(150, 'Maximum 150 characters'),
  documents: z
    .array(z.any(), {
      required_error: 'This field is required'
    })
    .min(1, 'This field is required')
    .max(3, 'Accept maximum 3 files')
});

export interface VerifyPatientRequest {
  disease: string;
  organization: string;
  documents: FileProps[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile extends User {
  role: RoleType;
  profile?: {
    accountID?: string;
    disease?: string;
    documents?: string[];
    id?: string;
    metadata?: {
      documents: FileKey[];
      verifyComment?: string;
    };
    name?: string;
    organization?: string;
    status?: VerifyProfileStatus;
  };
}

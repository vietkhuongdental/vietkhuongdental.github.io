/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import type { AccountStatus } from '@/constants';
import type {
  Disease,
  FileKey,
  ProfileExpert,
  ProfilePatient,
  User
} from '@/shared/interface';

export interface UserProfilePatient extends ProfilePatient {
  account_id: string; // UUID
  metadata?: {
    documents: FileKey[];
    verifyComment?: string;
  };
}

export interface UserProfileExpert extends ProfileExpert {
  accountID: string;
  diseaseExpIn: Disease[];
}

export interface UserAccountProfile extends User {
  email: string;
  status: AccountStatus;
  profile: UserProfilePatient;
  profileExpert: UserProfileExpert;
}

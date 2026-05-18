// import type { VerifyProfileStatus } from '@/constants';
import type { TableParams } from '@/shared/components/blocks/DataTable/helpers';
import type { User } from '@/shared/interface';

export interface UserListRequest extends TableParams {
  role?: string[];
  status?: string[];
  search?: string;
}

export interface UserResponse extends User {
  fullName: string;
  zaloName: string;
  phone: string;
  address: string;
  zaloUserId: string;
  dob: string;
  gender: string;
  profilePicture: string;
  // profileStatus: VerifyProfileStatus;
  createdDate: string;
  updatedDate: string;
  sentTemplateIds: string[];
}

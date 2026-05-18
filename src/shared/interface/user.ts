import type { AccountStatus, RoleType, VerifyProfileStatus } from '@/constants';

export interface User {
  id?: string;
  name?: string;
  status?: AccountStatus;
  role?: RoleType;
  email?: string;
  password?: string;
  profileExpert?: ProfileExpert;
  profile?: ProfilePatient;
  signature?: string;
}

export interface ProfileExpert {
  id?: string; // UUID
  accountID?: string; // UUID
  status?: VerifyProfileStatus;
  name?: string;
  diseaseExpIn?: unknown[];
  country?: string;
  dob?: Date; // ISO date string
  sex?: string;
  profilePicture?: string;
  localProfilePicture?: string;
  organization?: string;
  countryOfOrganization?: string;
  department?: string;
  position?: string;
  bioDescription?: string;
  verifyComment?: string;
  medicalLicense?: string;
  countryOfIssue?: string;
  dateOfIssue?: Date; // ISO date string
}

export interface ProfilePatient {
  id?: string; // UUID
  accountID?: string; // UUID
  name?: string;
  status?: VerifyProfileStatus;
  disease?: string;
  organization?: string;
  metadata?: {
    documents?: unknown[];
  };
}

export interface AgeRange {
  minAge: number;
  maxAge: number;
}

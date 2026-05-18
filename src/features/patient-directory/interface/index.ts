import type { AgeRange, PotentialDisease } from '@/shared/interface';

export interface PatientDirectoryRequest {
  diseaseCodes: string[];
  sex?: string[];
  ageRange?: AgeRange[];
  country?: string[];
}

export interface PatientDirectoryResponse {
  id: string;
  anonymizedName: string;
  ageRange: AgeRange;
  country: string;
  matchingDiseases: PotentialDisease[];
}

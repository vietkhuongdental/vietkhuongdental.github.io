/* eslint-disable @typescript-eslint/naming-convention */
import type {
  AnalysisStatus,
  AnalysisStep
} from '@/features/health-record/helpers';
import type {
  AgeRange,
  FileKey,
  PotentialDisease,
  Symptom,
  VoteType
} from '@/shared/interface';

export interface AnonymizedHealthRecordMetadata {
  id: string;
  ageRange: AgeRange;
  country: string;
  sex: string;
  diagnosedDisease?: string;
  symptoms?: Symptom[];
  treatmentPlace?: string;
  geneFileKey: FileKey;
  ehrFileKey: FileKey;
}

export interface BasicHealthRecord extends Omit<HealthRecord, 'id'> {
  title: string;
  dayOfBirth: Date;
  sex: string;
  country: string;
  diagnosedDisease?: string;
}

export interface HealthRecord {
  id?: string;
  title?: string;
  dayOfBirth: Date;
  sex: string;
  country: string;
  isPublish?: boolean;
  analysisStep?: AnalysisStep;
  analysisStatus?: AnalysisStatus;
  metadata?: {
    diagnosedDisease?: string;
  };

  hospitalClinic?: string;
  hospitalDocument?: string;
  diseaseOrganisations?: string;
}

export interface AnonymizedHealthRecord {
  id: string;
  accountId: string;
  anonymizedName?: string;
  createdBy?: string;
  metadata: AnonymizedHealthRecordMetadata;
  analysisStatus: AnalysisStatus;
  analysisStep: AnalysisStep;
  analysisResults: AnalysisResult;
}

export interface AnalysisPayload {
  hpoIDs: string[];
  dayOfBirth?: string;
  sex?: string;
  country?: string;
  encryptedDEK?: string;
  geneFile: FileKey;
  ehrFile?: FileKey;
}

export interface AnalysisResult {
  analysisDate: Date;
  potentialDiseases: PotentialDisease[] | null;
}

export interface AnalysisHistory {
  analysisDate: Date;
  id: string;
  symptomNames: string[];
  version: number;
  potentialDiseases?: PotentialDisease[];
}

export interface HealthRecordAnalysisMetadata {
  country: string;
  dayOfBirth: Date;
  ehrFileKey: FileKey;
  geneFileKey: FileKey;
  sex: string;
  symptoms: Symptom[];
  version: number;
}

export interface HealthRecordAnalysis {
  id: string;
  accountId: string;
  metadata: HealthRecordAnalysisMetadata;
  analysisStatus: AnalysisStatus;
  analysisStep: AnalysisStep;
  analysisResults: AnalysisResult;
  histories?: AnalysisHistory[];
}

export interface EHRDownloadRequest {
  healthRecordId: string;
  fileKey: string;
}

export interface VotePayload {
  vote: VoteType;
  orphaCode?: string;
  comment?: string;
  id?: string;
}

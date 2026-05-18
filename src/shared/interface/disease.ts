import type { Symptom } from '@/shared/interface/symptom';

interface DiseaseReferences {
  source: string;
  status: string;
}

interface DiseaseMetadataResponse {
  orphaCode: string;
  references?: DiseaseReferences[];
  description?: string;
}

export interface Disease {
  id?: string;
  name: string;
  synonyms?: string[];
  metadata: DiseaseMetadataResponse;
  symptoms?: Symptom[];
}

export interface PotentialDisease {
  orphaCode: string;
  confidence: number;
  name: string;
  description?: string;
  agreeCount?: number;
  disagreeCount?: number;
  notSureCount?: number;
  currentUserVote?: VoteType;
}

export enum VoteType {
  AGREE = 'agree',
  DISAGREE = 'disagree',
  NOT_SURE = 'not_sure'
}

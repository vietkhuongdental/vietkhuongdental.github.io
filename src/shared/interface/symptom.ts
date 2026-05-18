export interface Symptom {
  id: string;
  name: string;
  synonyms: string[];
  metadata: SymptomMetadata;
}

interface SymptomMetadata {
  hpoId: string;
  description: string;
}

import type { PicklistOption } from '@/shared/components/blocks/Picklist';
import type { Symptom } from '@/shared/interface';

export const convertSymptomOptions = (
  symptoms: Symptom[]
): PicklistOption[] => {
  const options = symptoms.map((symptom) => ({
    label: symptom.name,
    value: symptom.metadata.hpoId,
    synonym: symptom.synonyms.join(' | '),
    description: symptom.metadata.description,
    hpoId: symptom.metadata.hpoId
  }));
  return options;
};

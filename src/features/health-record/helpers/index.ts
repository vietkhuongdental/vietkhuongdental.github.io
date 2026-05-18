export const enum AnalysisStep {
  Analyze = 'analyze', // Analyzer calculates similarity scores
  Encrypt = 'encrypt', // Patient uploads genome file
  NotStarted = 'not_started',
  Preprocess = 'preprocess', // added
  ResultReady = 'result_ready', // Final results stored
  SecureData = 'secure_data', // Trusted partner processes genome data
  Validation = 'validation' // added
}

export const AnalysisStepErrorMap: Record<string, string> = {
  [`${AnalysisStep.SecureData}`]: 'securing',
  [`${AnalysisStep.Validation}`]: 'securing',
  [`${AnalysisStep.Preprocess}`]: 'encrypting',
  [`${AnalysisStep.Encrypt}`]: 'encrypting',
  [`${AnalysisStep.Analyze}`]: 'analysing',
  [`${AnalysisStep.ResultReady}`]: 'finishing'
};

export const enum AnalysisStatus {
  Fail = 'fail',
  Pending = 'pending',
  Processing = 'processing',
  Success = 'success'
}

export const convertDobToAge = (date: Date): number => {
  const yearOfBirth = new Date(date).getFullYear();
  const thisYear = new Date().getFullYear();
  return thisYear - yearOfBirth;
};

const progressMap: Record<string, number> = {
  [`${AnalysisStep.SecureData}:${AnalysisStatus.Processing}`]: 25,
  [`${AnalysisStep.SecureData}:${AnalysisStatus.Fail}`]: 25,
  [`${AnalysisStep.SecureData}:${AnalysisStatus.Success}`]: 25,

  [`${AnalysisStep.Validation}:${AnalysisStatus.Processing}`]: 25,
  [`${AnalysisStep.Validation}:${AnalysisStatus.Fail}`]: 25,
  [`${AnalysisStep.Validation}:${AnalysisStatus.Success}`]: 50,

  [`${AnalysisStep.Preprocess}:${AnalysisStatus.Processing}`]: 50,
  [`${AnalysisStep.Preprocess}:${AnalysisStatus.Fail}`]: 50,
  [`${AnalysisStep.Preprocess}:${AnalysisStatus.Success}`]: 50,

  [`${AnalysisStep.Encrypt}:${AnalysisStatus.Processing}`]: 50,
  [`${AnalysisStep.Encrypt}:${AnalysisStatus.Fail}`]: 50,
  [`${AnalysisStep.Encrypt}:${AnalysisStatus.Success}`]: 75,

  [`${AnalysisStep.Analyze}:${AnalysisStatus.Processing}`]: 75,
  [`${AnalysisStep.Analyze}:${AnalysisStatus.Fail}`]: 75,
  [`${AnalysisStep.Analyze}:${AnalysisStatus.Success}`]: 100,

  [`${AnalysisStep.ResultReady}:${AnalysisStatus.Processing}`]: 100,
  [`${AnalysisStep.ResultReady}:${AnalysisStatus.Fail}`]: 100,
  [`${AnalysisStep.ResultReady}:${AnalysisStatus.Success}`]: 100
};

export const convertStatusToPercent = (
  step: AnalysisStep,
  status: AnalysisStatus
): number => progressMap[`${step}:${status}`] ?? 0;

export const getAnalysisStatusColor = (status?: string) => {
  switch (status) {
    case AnalysisStep.Analyze:
    case AnalysisStep.Preprocess:
    case AnalysisStep.Encrypt:
    case AnalysisStep.SecureData:
    case AnalysisStep.Validation:
      return 'red';
    case AnalysisStep.ResultReady:
      return 'green';
    case AnalysisStep.NotStarted:
    default:
      return 'red';
  }
};

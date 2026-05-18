import { AnalysisStatus, AnalysisStep } from '@/features/health-record/helpers';

interface Props {
  status: AnalysisStatus;
  step: AnalysisStep;
  progress: number;
}

export function StepResultIcon({ progress, status, step }: Props) {
  if (step === AnalysisStep.ResultReady && status === AnalysisStatus.Fail) {
    return <StepResultFail />;
  }

  if (progress >= 100) {
    if (
      status === AnalysisStatus.Success &&
      step === AnalysisStep.ResultReady
    ) {
      return <StepResultDone />;
    }

    return <StepResultProcessing />;
  }

  return <StepResultNotStart />;
}

function StepResultFail() {
  return (
    <svg
      fill="none"
      height="36"
      viewBox="0 0 36 36"
      width="36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z"
        fill="#AC0C22"
      />
      <path
        d="M24.6666 13L15.4999 22.1667L11.3333 18"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function StepResultDone() {
  return (
    <svg
      fill="none"
      height="36"
      viewBox="0 0 36 36"
      width="36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z"
        fill="#E56200"
      />
      <path
        d="M24.6666 13L15.4999 22.1667L11.3333 18"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function StepResultProcessing() {
  return (
    <div className="relative h-10 w-10 rounded-full">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-border-subtle border-t-primary-500" />
      <svg
        fill="none"
        height="40"
        viewBox="0 0 40 40"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 1C30.4934 1 39 9.50659 39 20C39 30.4934 30.4934 39 20 39C9.50659 39 1 30.4934 1 20C1 9.50659 9.50659 1 20 1Z"
          fill="white"
        />
        <path
          d="M20 1C30.4934 1 39 9.50659 39 20C39 30.4934 30.4934 39 20 39C9.50659 39 1 30.4934 1 20C1 9.50659 9.50659 1 20 1Z"
          stroke="#E56200"
          strokeWidth="2"
        />
        <path
          d="M26.6666 15L17.4999 24.1667L13.3333 20"
          stroke="#E56200"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function StepResultNotStart() {
  return (
    <svg
      fill="none"
      height="36"
      viewBox="0 0 36 36"
      width="36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z"
        fill="#E8E6E6"
      />
      <path
        d="M24.6666 13L15.4999 22.1667L11.3333 18"
        stroke="#726B66"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

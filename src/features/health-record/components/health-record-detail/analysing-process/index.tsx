import { GenreIcon } from '@/assets/icons/genre-icon';
import type { AnalysisStep } from '@/features/health-record/helpers';
import {
  AnalysisStatus,
  convertStatusToPercent
} from '@/features/health-record/helpers';
import useRetryAnalysis from '@/features/health-record/hooks/api/useRetryAnalysis';
import { Button } from '@/shared/components/ui/Button';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo } from 'react';

interface Props {
  id: string;
  step: AnalysisStep;
  status: AnalysisStatus;
  onGetAnalysis: () => void;
  onSetStatus: Dispatch<SetStateAction<AnalysisStatus>>;
  onBackToAnalysingForm: () => void;
}

export default function AnalysingProcess({
  id,
  step,
  status,
  onGetAnalysis,
  onSetStatus,
  onBackToAnalysingForm
}: Props) {
  const progress = useMemo(
    () => convertStatusToPercent(step, status),
    [step, status]
  );

  const { onRetryAnalysis } = useRetryAnalysis(
    { id },
    {
      onSuccess: () => {
        onGetAnalysis();
      }
    }
  );

  const handleClickRetry = () => {
    onRetryAnalysis({});
  };

  useEffect(() => {
    if (progress >= 100) {
      //waiting 5s for change to next screen
      onSetStatus(AnalysisStatus.Success);
    }
  }, [progress]);

  useEffect(() => {
    // re- get - analysis on every 10s
    const interval = setInterval(() => {
      onGetAnalysis();
    }, 10_000);

    if (status === AnalysisStatus.Fail) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="h-fit flex-1 rounded-lg bg-background-default shadow-sm">
      <div className="border-b">
        <div className="flex flex-row items-center gap-3 p-6">
          <GenreIcon />
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold text-text-default">
              Genorare analysis
            </span>
            <span className="text-sm font-normal text-text-description">
              AI-identification based on symptoms and genome file
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center gap-6">
        {/* <DiagnosisProgress progress={progress} status={status} step={step} /> */}
        {status === AnalysisStatus.Fail && (
          <div className="flex flex-row items-center justify-center gap-4 pb-4">
            <Button onClick={onBackToAnalysingForm} size="md" variant="outline">
              Back to adding
            </Button>
            <Button
              onClick={handleClickRetry}
              size="md"
              type="submit"
              variant="primary"
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

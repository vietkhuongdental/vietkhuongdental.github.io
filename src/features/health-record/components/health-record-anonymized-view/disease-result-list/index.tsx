import { AttachedFileIcon } from '@/assets/icons/attached-file-icon';
import { ErrorIcon } from '@/assets/icons/error-icon';
import { GenreIcon } from '@/assets/icons/genre-icon';
// import { ConnectionStatus } from '@/features/connection/common/helpers';
import DiseaseCard from '@/features/health-record/components/health-record-detail/disease-result-list/disease-card';
import UploadedFilesModal from '@/features/health-record/components/health-record-detail/disease-result-list/uploaded-files-modal';
import { AnalysisStep } from '@/features/health-record/helpers';
import useCreateUpdateVote from '@/features/health-record/hooks/api/useCreateUpdateVote';
import useGetAnonymizedHealthRecordById from '@/features/health-record/hooks/api/useGetAnonymizedHealthRecordById';
import type {
  AnonymizedHealthRecord,
  VotePayload
} from '@/features/health-record/interface';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider, useToastProvider } from '@/shared/hooks';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

interface Props {
  analysisData: AnonymizedHealthRecord;
  connectionStatus: string;
}

export default function DiseaseResultList({
  analysisData,
  connectionStatus
}: Props) {
  const { showToast } = useToastProvider();
  const { onShowModal } = useModalProvider();

  const [filterSymptoms, setFilterSymptoms] = useState(
    analysisData?.metadata?.symptoms
      ? analysisData?.metadata?.symptoms.slice(0, 3)
      : []
  );

  const { handleInvalidateHealthRecordById } = useGetAnonymizedHealthRecordById(
    {
      id: analysisData.id
    }
  );

  const { onCreateUpdateVote } = useCreateUpdateVote({
    onError: () => {
      showToast({
        title: 'Vote Error'
      });
      handleInvalidateHealthRecordById({ id: analysisData.id });
    }
  });

  const handleVote = async (data: VotePayload) => {
    const response = await onCreateUpdateVote({ ...data, id: analysisData.id });
    return response.data;
  };

  const handleShowUploadedFiles = useCallback(() => {
    if (
      !analysisData?.metadata.ehrFileKey &&
      !analysisData?.metadata.geneFileKey
    ) {
      return;
    }

    onShowModal({
      title: 'Uploaded files',
      hideButton: true,
      children: (
        <UploadedFilesModal
          ehrFile={analysisData?.metadata.ehrFileKey}
          geneFile={analysisData?.metadata.geneFileKey}
          healthRecordId={analysisData.id}
        />
      )
    });
  }, [analysisData]);

  if (analysisData?.analysisStep !== AnalysisStep.ResultReady) {
    return (
      <div className="h-fit flex-1 rounded-lg bg-background-default shadow-sm">
        <div className="flex w-full flex-row gap-2 rounded-t-lg bg-background-brand-primary-subtle px-6 py-2">
          <ErrorIcon color="#726B66" />
          <span className="text-sm font-normal text-text-description">
            Genorare doesn't provide medical advice or diagnosis.
          </span>
        </div>
        <div className="flex h-fit w-[100%] p-10">
          <main className="flex w-full flex-col items-center justify-center gap-2">
            <img
              alt="empty"
              className="h-40 w-40 object-cover"
              src="/empty-disease.png"
            />
            <span className="text-xl font-bold">No analysis result</span>
            <p className="max-w-[527px] text-center text-md font-normal text-text-default">
              There's no analysis result for this health record
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit flex-1 rounded-lg bg-background-default shadow-sm">
      <div className="pb-4">
        <div className="flex w-full flex-row gap-2 rounded-t-lg bg-background-brand-primary-subtle px-6 py-2">
          <ErrorIcon color="#726B66" />
          <span className="text-sm font-normal text-text-description">
            Genorare doesn't provide medical advice or diagnosis.
          </span>
        </div>
        <div className="relative flex flex-row justify-between p-6">
          <Button
            className="absolute right-5 top-5"
            // isDisabled={connectionStatus !== ConnectionStatus.ACTIVE}
            onClick={handleShowUploadedFiles}
            variant="outline"
          >
            <AttachedFileIcon />
          </Button>
          <div className="flex flex-row items-center gap-3">
            <GenreIcon />
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-text-default">
                Top potential rare diseases
              </span>
              <span className="text-sm font-normal text-text-description">
                Analysed on{' '}
                {dayjs(analysisData?.analysisResults?.analysisDate).format(
                  'DD/MM/YYYY HH:mm'
                )}
              </span>
            </div>
          </div>
        </div>
        {analysisData?.metadata?.symptoms ? (
          <div className="flex flex-row items-start gap-3 px-6">
            <span className="w-fit whitespace-nowrap text-sm font-normal text-text-subtle">
              Your symptoms
            </span>
            <div className="flex flex-wrap gap-3 overflow-hidden transition-all duration-300">
              {filterSymptoms?.map((symptom) => (
                <span
                  className="w-fit rounded-md bg-background-subtle px-2 text-sm font-normal text-text-subtle"
                  key={symptom?.id}
                >
                  {symptom?.name}
                </span>
              ))}

              {analysisData?.metadata?.symptoms?.length > 3 ? (
                <span
                  onClick={() =>
                    setFilterSymptoms((prev) =>
                      prev.length > 3
                        ? prev.slice(0, 3)
                        : analysisData.metadata.symptoms!
                    )
                  }
                  className="flex cursor-pointer text-md text-sm text-link-default"
                >
                  {filterSymptoms.length <= 3 ? 'See all' : 'See less'}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {!analysisData?.analysisResults.potentialDiseases ? (
        <div className="flex h-fit w-full flex-col">
          <div className="flex h-fit w-[100%] p-10">
            <main className="flex w-full flex-col items-center justify-center gap-2">
              <img
                alt="empty"
                className="h-40 w-40 object-cover"
                src="/empty-disease.png"
              />
              <span className="text-xl font-bold">
                No rare diseases detected
              </span>
              <p className="max-w-[527px] text-center text-md font-normal text-text-default">
                We couldn't detect any potential rare disease. Try “Analyse"
                again when if you have new symptoms or new genome file.
              </p>
            </main>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col">
          {analysisData?.analysisResults.potentialDiseases?.map(
            (disease, index) => (
              <DiseaseCard
                connectionStatus={connectionStatus}
                disease={disease}
                index={index + 1}
                key={index}
                onVote={handleVote}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

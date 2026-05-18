/* eslint-disable @typescript-eslint/naming-convention */
import { AttachedFileIcon } from '@/assets/icons/attached-file-icon';
import { ErrorIcon } from '@/assets/icons/error-icon';
import { GenreIcon } from '@/assets/icons/genre-icon';
import ReloadIcon from '@/assets/icons/reload-icon';
import { VerifyProfileStatus } from '@/constants';
import useGetMyProfile from '@/features/account/hooks/useGetMyProfile';
import DiseaseCard from '@/features/health-record/components/health-record-detail/disease-result-list/disease-card';
import HistoriesModal from '@/features/health-record/components/health-record-detail/disease-result-list/histories-modal';
import ReanalyseModal from '@/features/health-record/components/health-record-detail/disease-result-list/reanalysing-modal';
import UploadedFilesModal from '@/features/health-record/components/health-record-detail/disease-result-list/uploaded-files-modal';
import LimitCreationModal from '@/features/health-record/components/limit-creation-modal';
import type { HealthRecordAnalysis } from '@/features/health-record/interface';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider } from '@/shared/hooks';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  analysisData?: HealthRecordAnalysis;
}

export default function DiseaseResultList({ analysisData }: Props) {
  const params = useParams();
  const { onShowModal } = useModalProvider();
  const { id } = params;

  const [filterSymptoms, setFilterSymptoms] = useState(
    analysisData?.metadata?.symptoms?.slice(0, 3) || []
  );

  const { myProfile } = useGetMyProfile();

  const handleShowUploadedFiles = useCallback(() => {
    if (
      !id ||
      (!analysisData?.metadata.ehrFileKey &&
        !analysisData?.metadata.geneFileKey)
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
          healthRecordId={id}
        />
      )
    });
  }, [id, analysisData]);

  const handleClickReanalyse = useCallback(() => {
    if (myProfile?.profile?.status === VerifyProfileStatus.Verified) {
      return onShowModal({
        hideButton: true,
        children: <ReanalyseModal initData={analysisData?.metadata} />
      });
    }

    onShowModal({
      title: 'Verify as a patient to have unlimited analysis',
      children: <LimitCreationModal type="analysis" />,
      hideButton: true
    });
  }, [analysisData, myProfile]);

  const handleShowHistories = useCallback(() => {
    onShowModal({
      hideButton: true,
      title: 'Old results',
      children: <HistoriesModal data={analysisData?.histories} />
    });
  }, []);

  return (
    <div className="relative h-fit flex-1 rounded-lg bg-background-default shadow-sm">
      <div className="pb-4">
        <div className="flex w-full flex-row gap-2 rounded-t-lg bg-background-brand-primary-subtle px-6 py-2">
          <ErrorIcon color="#726B66" />
          <span className="text-sm font-normal text-text-description">
            Genorare doesn't provide medical advice or diagnosis.
          </span>
        </div>
        <div className="flex flex-col justify-between p-6 md:flex-row">
          <div className="flex flex-row items-center gap-3">
            <GenreIcon />
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-text-default">
                Top potential rare diseases
              </span>
              <div className="flex gap-2">
                <span className="text-sm font-normal text-text-description">
                  Analysed on{' '}
                  {dayjs(analysisData?.analysisResults?.analysisDate).format(
                    'DD/MM/YYYY HH:mm'
                  )}
                </span>
                {analysisData?.metadata?.version !== 1 && (
                  <button
                    className="rounded-none border-l pl-2 text-sm font-semibold hover:underline"
                    onClick={handleShowHistories}
                  >
                    Old results
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <Button
              isDisabled={
                !analysisData?.metadata.ehrFileKey &&
                !analysisData?.metadata.geneFileKey
              }
              leadingIcon={<AttachedFileIcon />}
              onClick={handleShowUploadedFiles}
              variant="outline"
            />
            <Button
              leadingIcon={<ReloadIcon />}
              onClick={handleClickReanalyse}
              variant="outline"
            >
              Analyse
            </Button>
          </div>
        </div>
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

            {analysisData?.metadata?.symptoms &&
            analysisData?.metadata?.symptoms?.length > 3 ? (
              <span
                onClick={() =>
                  setFilterSymptoms((prev) =>
                    prev.length > 3
                      ? prev.slice(0, 3)
                      : analysisData?.metadata.symptoms
                  )
                }
                className="flex cursor-pointer text-md text-sm text-link-default"
              >
                {filterSymptoms.length <= 3 ? 'See all' : 'See less'}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {!analysisData?.analysisResults.potentialDiseases ? (
        <div className="h-fit flex-1 rounded-lg bg-background-default shadow-sm">
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
              <DiseaseCard disease={disease} index={index + 1} key={index} />
            )
          )}
        </div>
      )}
    </div>
  );
}

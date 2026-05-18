import { AttachedFileIcon } from '@/assets/icons/attached-file-icon';
import { ErrorIcon } from '@/assets/icons/error-icon';
import { GenreIcon } from '@/assets/icons/genre-icon';
import DiseaseCard from '@/features/health-record/components/health-record-detail/disease-result-list/disease-card';
import UploadedFilesModal from '@/features/health-record/components/health-record-detail/disease-result-list/uploaded-files-modal';
import useGetEhrAnalysisHistoryById from '@/features/health-record/hooks/api/useGetEhrAnalysisHistoryById';
import type { AnalysisHistory } from '@/features/health-record/interface';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider } from '@/shared/hooks';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

interface Props {
  data: AnalysisHistory;
}

export default function HistoryDetailModal({ data }: Props) {
  const { onShowModal, onCloseModal } = useModalProvider();

  const [filterSymptoms, setFilterSymptoms] = useState(data.symptomNames);

  const { data: historyDetail } = useGetEhrAnalysisHistoryById({
    id: data.id
  });

  const handleShowUploadedFiles = useCallback(() => {
    if (
      !historyDetail?.metadata.ehrFileKey &&
      !historyDetail?.metadata.geneFileKey
    ) {
      return;
    }

    onShowModal({
      title: 'Uploaded files',
      hideButton: true,
      children: (
        <UploadedFilesModal
          ehrFile={historyDetail?.metadata.ehrFileKey}
          geneFile={historyDetail?.metadata.geneFileKey}
          healthRecordId={data.id}
        />
      )
    });
  }, [data.id, historyDetail]);

  return (
    <div className="h-fit max-w-[1000px] xl:w-[1000px]">
      <div className="h-[calc(75vh-145px)] overflow-auto">
        <div className="flex flex-row gap-2 bg-button-risk-bg-low px-6 py-2 text-sm">
          <ErrorIcon color="#726B66" />
          Genorare doesn't provide medical advice or diagnosis.
        </div>
        <div className="flex flex-row justify-between p-6">
          <div className="flex flex-row items-center gap-3">
            <GenreIcon />
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-text-default">
                Top potential rare diseases
              </span>
              <div className="flex flex-row gap-2">
                <span className="text-sm font-normal text-text-description">
                  Analysed on{' '}
                  {dayjs(data?.analysisDate).format('DD/MM/YYYY HH:mm')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              isDisabled={
                !historyDetail?.metadata.ehrFileKey &&
                !historyDetail?.metadata.geneFileKey
              }
              leadingIcon={<AttachedFileIcon />}
              onClick={handleShowUploadedFiles}
              variant="outline"
            />
          </div>
        </div>
        <div className="flex flex-row items-start gap-3 px-6 pb-6">
          <span className="w-fit whitespace-nowrap text-sm font-normal text-text-subtle">
            Your symptoms
          </span>
          <div className="flex flex-wrap gap-3 overflow-hidden transition-all duration-300">
            {data.symptomNames?.map((name) => (
              <span
                className="w-fit rounded-md bg-background-subtle px-2 text-sm font-normal text-text-subtle"
                key={name}
              >
                {name}
              </span>
            ))}

            {data.symptomNames?.length > 3 ? (
              <span
                onClick={() =>
                  setFilterSymptoms((prev) =>
                    prev.length > 3 ? prev.slice(0, 3) : data.symptomNames
                  )
                }
                className="flex cursor-pointer text-md text-sm text-link-default"
              >
                {filterSymptoms.length <= 3 ? 'See all' : 'See less'}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col">
          {historyDetail?.analysisResults.potentialDiseases?.map(
            (disease, index) => (
              <DiseaseCard disease={disease} index={index + 1} key={index} />
            )
          )}
        </div>
      </div>
      <div className="flex w-full justify-start px-6 py-4">
        <Button onClick={onCloseModal} size={'lg'} variant={'outline'}>
          Back
        </Button>
      </div>
    </div>
  );
}

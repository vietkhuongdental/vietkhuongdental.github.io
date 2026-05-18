import HistoryDetailModal from '@/features/health-record/components/health-record-detail/disease-result-list/history-detail-modal';
import type { AnalysisHistory } from '@/features/health-record/interface';
import { useModalProvider } from '@/shared/hooks';
import dayjs from 'dayjs';
import { useCallback } from 'react';

interface Props {
  data?: AnalysisHistory[];
}

export default function HistoriesModal({ data }: Props) {
  const { onShowModal } = useModalProvider();

  const handleClickDetail = useCallback((detail: AnalysisHistory) => {
    onShowModal({
      title: dayjs(detail.analysisDate).format('DD/MM/YYYY HH:mm'),
      children: <HistoryDetailModal data={detail} />,
      hideButton: true
    });
  }, []);

  if (!data || data.length === 0) return null;
  return (
    <div className="h-fit max-w-[1000px] xl:w-[1000px]">
      <div className="h-[calc(75vh) -145px] overflow-auto">
        {data.map((result) => (
          <div
            className="relative flex cursor-pointer flex-col p-6 hover:border hover:border-border-brand-primary-hover"
            key={result.id}
            onClick={() => handleClickDetail(result)}
          >
            <div className="absolute bottom-0 left-5 right-5 border-b" />
            <span className="text-md font-semibold">
              {dayjs(result.analysisDate).format('DD/MM/YYYY HH:mm')}
            </span>
            <p className="text-sm font-normal text-text-description">
              Symptoms: {result.symptomNames.join(' ,')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import AnalysingForm from '@/features/health-record/components/health-record-detail/analysing-form';
import useGetAnalysis from '@/features/health-record/hooks/api/useGetAnalysis';
import type { HealthRecordAnalysisMetadata } from '@/features/health-record/interface';
import { useParams } from 'react-router-dom';

interface Props {
  initData?: HealthRecordAnalysisMetadata;
}

export default function ReanalyseModal({ initData }: Props) {
  const { id } = useParams();
  const { onGetAnalysis } = useGetAnalysis({
    id
  });

  return (
    <div className="h-fit max-w-[1000px] xl:w-[1000px]">
      <AnalysingForm
        id={id || ''}
        initData={initData}
        onGetAnalysis={onGetAnalysis}
      />
    </div>
  );
}

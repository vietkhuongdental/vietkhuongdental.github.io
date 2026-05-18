import HealthRecordDetail from '@/features/health-record/components/health-record-detail';
import { useParams } from 'react-router-dom';

const HealthRecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <HealthRecordDetail id={id} />;
};

export default HealthRecordDetailPage;

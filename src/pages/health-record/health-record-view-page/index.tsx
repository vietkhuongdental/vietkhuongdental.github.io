import HealthRecordAnonymizedView from '@/features/health-record/components/health-record-anonymized-view';
import { useParams } from 'react-router-dom';

const HealthRecordViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <HealthRecordAnonymizedView id={id} />;
};

export default HealthRecordViewPage;

// import ExpertProfile from '@/features/expert-profile/components';
import { useParams } from 'react-router-dom';

const ExpertProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  // return <ExpertProfile id={id} />;
};

export default ExpertProfilePage;

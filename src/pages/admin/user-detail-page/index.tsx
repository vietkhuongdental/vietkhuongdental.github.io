import UserDetail from '@/features/user-detail/components';
import { useParams } from 'react-router-dom';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <UserDetail id={id} />;
}

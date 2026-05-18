import { RoleType } from '@/constants';
import HealthRecordList from '@/features/health-record/components/health-record-list';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

export default function HealthRecordPage() {
  const { authStore } = useAuthStore();

  const user = useMemo(() => authStore.user, [authStore]);

  if (user?.role !== RoleType.PATIENT) return <Navigate to={'/'} replace />;

  return <HealthRecordList />;
}

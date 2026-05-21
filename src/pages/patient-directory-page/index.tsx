import { RoleType } from '@/constants';
import PatientDirectory from '@/features/patient-directory/components';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

const PatientDirectoryPage: React.FC = () => {
  const { authStore } = useAuthStore();

  const user = useMemo(() => authStore.user, [authStore]);

  if (user?.role !== RoleType.EXPERT)
    return <Navigate to={'/admin/'} replace />;
  return <PatientDirectory />;
};

export default PatientDirectoryPage;

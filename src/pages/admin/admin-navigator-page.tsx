import { RoleType, RoleTypeMap } from '@/constants';
import { useToastProvider } from '@/shared/hooks';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Navigate } from 'react-router-dom';

export const AdminNavigatorPage = () => {
  const { user, authStore } = useAuthStore();
  const { showToast } = useToastProvider();

  if (user?.role && user?.role !== RoleType.ADMIN) {
    showToast({
      variant: 'error',
      title: `${RoleTypeMap[user.role]} does not available for on this route.`
    });
    authStore.logout();
  }

  return <Navigate to={'/admin/user-management'} replace />;
};

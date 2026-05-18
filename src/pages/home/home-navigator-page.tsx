/* eslint-disable import/no-unresolved */
import { RoleType, RoleTypeMap } from '@/constants';
// import useGetMyProfile from '@/features/account/hooks/useGetMyProfile';
import { useToastProvider } from '@/shared/hooks';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const HomeNavigatorPage = () => {
  // const { myProfile, isLoading } = useGetMyProfile();
  const { showToast } = useToastProvider();
  const { authStore } = useAuthStore();

  const location = useLocation();

  if (authStore?.user?.role === RoleType.ADMIN) {
    showToast({
      variant: 'error',
      title: `${RoleTypeMap[authStore.user.role]} does not available for on this route.`
    });
    authStore.logout();
  }

  const firstRoute = useMemo(() => {
    if (authStore?.user?.role === RoleType.PATIENT) {
      return '/health-record';
    }

    if (authStore?.user?.role === RoleType.EXPERT) {
      return '/patient-directory';
    }

    return '/auth';
  }, [authStore.user?.role]);

  const from = (location.state as { from?: string })?.from || firstRoute;

  // if (isLoading) return null;

  return <Navigate state={{ from }} to={firstRoute} replace />;
};

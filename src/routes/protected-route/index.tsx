import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({
  children,
  redirectTo = '/auth/login'
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate state={{ from: location.pathname }} to={redirectTo} replace />
    );
  }

  return children;
}

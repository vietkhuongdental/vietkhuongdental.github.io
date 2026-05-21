/* eslint-disable import/no-unresolved */
import { Header } from '@/shared/components/layouts/header';
import Sidebar from '@/shared/components/layouts/sidebar';
import { useMobile } from '@/shared/hooks';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateLayout() {
  const isMobile = useMobile();

  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Navigate state={{ from: location.pathname }} to="/admin/auth" replace />
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar initialExpanded={isMobile} />
      <div className="flex max-h-screen flex-1 flex-col overflow-y-auto pt-[72px]">
        <Header hasLogo={false} />
        <main className="flex-1 bg-background-canvas p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* eslint-disable import/no-unresolved */
import { Header } from '@/shared/components/layouts/header';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function NoSidebarLayout() {
  const { authStore } = useAuthStore();
  const user = useMemo(() => authStore.user, [authStore]);
  if (!user) return <Navigate to={'/admin/auth'} replace />;
  return (
    <div className="flex min-h-screen">
      <div className="flex max-h-screen flex-1 flex-col overflow-y-auto pt-[72px]">
        <Header hasLogo />
        <main className="flex-1 bg-background-canvas p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

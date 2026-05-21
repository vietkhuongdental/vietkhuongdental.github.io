/* eslint-disable import/no-unresolved */
import { Image } from '@/shared/components/ui/Image';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { ChevronLeft } from 'lucide-react';
import type React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  const showBackButton = false;
  const backUrl = '';
  const backLabel = 'Back';

  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return (
      <Navigate state={{ from: location.pathname }} to="/admin/" replace />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden w-1/2 md:flex lg:block">
        <Image
          alt="Genorare Banner"
          className="h-full w-full object-cover"
          src="/auth-banner.png"
        />
        {/* <Image
          alt="Logo Full"
          className="absolute left-[calc(15%)] top-0 h-[30%]"
          src="/logo-full-2.png"
        /> */}
        {/* <p className="absolute left-[calc(15%)] top-[calc(8%)] h-[8%] text-3xl font-bold text-text-brand-primary">
          Nha Khoa Việt Khương
        </p> */}
        <div className="absolute left-0 top-[128px] flex h-[calc(100vh-128px)] w-1/2 flex-col items-center justify-center gap-[calc(5%)]">
          <div className="flex h-[100%] w-[66%] justify-center">
            <Image
              alt="Slogan Secure"
              className="h-full object-contain"
              src="/slogan-secure.png"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col overflow-y-auto bg-base-white p-8">
        <div className="mb-8 flex items-center justify-between">
          {showBackButton && (
            <a
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              href={backUrl}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {backLabel}
            </a>
          )}
          <div className="flex-1" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full sm:max-w-lg md:max-w-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

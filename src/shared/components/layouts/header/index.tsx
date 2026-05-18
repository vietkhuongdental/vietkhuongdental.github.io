/* eslint-disable import/no-restricted-paths */
/* eslint-disable import/no-unresolved */
import { RoleType, RoleTypeMap } from '@/constants';
import NavbarMessage from '@/shared/components/blocks/NavbarMessage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu';
import { useLogout } from '@/shared/hooks';
import { cn } from '@/shared/libs/utils';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  hasLogo?: boolean;
}

export const Header = ({ hasLogo = false }: Props) => {
  const navigate = useNavigate();
  const { authStore, user } = useAuthStore();
  // const { myProfile } = useGetMyProfile();

  const { onLogout } = useLogout({
    onSuccess: () => {
      authStore.logout();
    },
    onError: () => {
      authStore.logout();
    }
  });

  const handleClickLogout = async () => {
    await onLogout({});
    navigate('/auth/login', {
      state: { from: '/' }, // pass extra data
      replace: true // optional: replace history entry
    });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background-default p-2 px-4">
      {hasLogo ? (
        <div className="flex items-center justify-between">
          <img
            alt="Genorare Logo"
            className={cn('transition-all', 'h-10 w-36')}
            onClick={() => navigate('/')}
            src={'/logo-full-2.png'}
            style={{ objectFit: 'contain', objectPosition: 'left' }}
          />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-background-subtle">
                  <img
                    src={
                      user?.role === RoleType.ADMIN
                        ? '/anonymous-admin-avatar.png'
                        : '/anonymous-avatar.png'
                    }
                    alt="User Avatar"
                    className="h-12 w-12 rounded-full border object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="flex w-[calc(100vw-100px)] flex-col gap-2 border border-primary-500 p-4 md:w-fit"
              >
                <div className="flex flex-row items-center gap-3">
                  <div className="aspect-square w-14">
                    <img
                      src={
                        user?.role === RoleType.ADMIN
                          ? '/anonymous-admin-avatar.png'
                          : '/anonymous-avatar.png'
                      }
                      alt="User Avatar"
                      className="h-14 w-14 rounded-full border object-cover"
                    />
                  </div>
                </div>
                <DropdownMenuSeparator className="px-1" />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate('/account')}
                >
                  <span className="text-md">Account Setting</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate('/public/terms')}
                >
                  <span className="text-md">Terms of Use</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate('/public/policy')}
                >
                  <span className="text-md">Privacy policy</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="px-1" />
                <DropdownMenuItem
                  className="cursor-pointer text-negative-500"
                  onClick={handleClickLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            {/* Message Icon */}
            {user?.role !== RoleType.ADMIN && <NavbarMessage />}

            {/* Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-background-subtle">
                    <img
                      src={
                        user?.role === RoleType.ADMIN
                          ? '/anonymous-admin-avatar.png'
                          : '/anonymous-avatar.png'
                      }
                      alt="User Avatar"
                      className="h-12 w-12 rounded-full border object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="flex w-[calc(100vw-100px)] flex-col gap-2 p-4 md:w-fit"
                >
                  <div className="flex flex-row items-center gap-3">
                    <div className="aspect-square w-14">
                      <img
                        src={
                          user?.role === RoleType.ADMIN
                            ? '/anonymous-admin-avatar.png'
                            : '/anonymous-avatar.png'
                        }
                        alt="User Avatar"
                        className="h-14 w-14 rounded-full border object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-normal text-text-subtle">
                        {user?.role ? RoleTypeMap[user?.role] : null}
                      </span>
                      <span className="text-sm font-normal text-text-default">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="px-1" />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate('/account')}
                  >
                    <span className="text-md">Account Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate('/public/terms')}
                  >
                    <span className="text-md">Terms of Use</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate('/public/policy')}
                  >
                    <span className="text-md">Privacy policy</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="px-1" />
                  <DropdownMenuItem
                    className="cursor-pointer text-negative-500"
                    onClick={handleClickLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

import { ToggleIcon } from '@/assets/icons/toggle-icon';
import { RoleType } from '@/constants';
import { cn } from '@/shared/libs/utils';
import { useCallback, useState } from 'react';
import type React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  roles: RoleType[];
  href: string;
  patterns?: string[];
  disabled?: boolean;
  heading?: string;
}

export interface SidebarProps {
  initialExpanded?: boolean;
  menuItems: MenuItem[];
}

const SidebarAdmin: React.FC<SidebarProps> = ({
  initialExpanded = true,
  menuItems
}) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(initialExpanded);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(RoleType.ADMIN)
  );

  const handleCLickItem = useCallback((route: string) => {
    window.location.href = route;
  }, []);

  return (
    <div
      className={cn(
        'relative z-[999] flex h-screen flex-col border-r bg-background-secondary transition-all duration-300',
        expanded ? 'w-60' : 'w-[72px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center p-4">
        <img
          alt="Genorare Logo"
          className={cn('transition-all', expanded ? 'h-10 w-36' : 'h-10 w-10')}
          onClick={() => handleCLickItem('/')}
          src={expanded ? '/logo-full-2.png' : '/logo-full-2.png'}
          style={{ objectFit: 'contain', objectPosition: 'left' }}
        />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2 overflow-y-auto px-3 py-4">
        {filteredMenuItems.map((item, index) => (
          <div key={item.label}>
            {item.heading ? (
              <span className="border px-3 text-left text-xl font-bold">
                {item.heading}
              </span>
            ) : null}
            <Link
              className={cn(
                'flex items-center rounded-md px-4 py-3 text-base font-medium text-text-default transition-all',
                (item.patterns || [item.href]).some((pattern) =>
                  location.pathname.includes(pattern)
                )
                  ? 'bg-secondary-50'
                  : 'hover:bg-gray-100'
              )}
              key={index}
              to={item.href}
              reloadDocument
            >
              {item.icon}
              {expanded ? <span className="ml-3">{item.label}</span> : null}
            </Link>
          </div>
        ))}
      </div>

      <button
        className="absolute -right-3 bottom-6 rounded-full border bg-background-default p-1 shadow-md"
        onClick={() => setExpanded(!expanded)}
      >
        <ToggleIcon />
      </button>
    </div>
  );
};

export { SidebarAdmin };

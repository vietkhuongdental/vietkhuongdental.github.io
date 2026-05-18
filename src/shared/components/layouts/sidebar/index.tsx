import { AdvocacyIcon } from '@/assets/icons/advocacy-icon';
import { ConnectionIcon } from '@/assets/icons/connection-icon';
import { HealthRecordIcon } from '@/assets/icons/health-record-icon';
import { UserIcon } from '@/assets/icons/user-icon';
import { RoleType } from '@/constants';
import { SidebarAdmin } from '@/shared/components/layouts/sidebar/sidebar-admin';
import { SidebarUser } from '@/shared/components/layouts/sidebar/sidebar-user';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import type React from 'react';

interface MenuItem {
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
}

const Sidebar: React.FC<SidebarProps> = ({ initialExpanded = true }) => {
  const { user } = useAuthStore();
  const menuItems: MenuItem[] = [
    {
      icon: (
        <HealthRecordIcon
          isFilled={location.pathname.includes('/health-record')}
        />
      ),
      label: 'Health record',
      roles: [RoleType.PATIENT],
      href: '/health-record',
      patterns: ['/health-record']
    },
    {
      icon: (
        <HealthRecordIcon
          isFilled={location.pathname.includes('/patient-directory')}
        />
      ),
      label: 'Patient Directory',
      roles: [RoleType.EXPERT],
      href: '/patient-directory',
      patterns: ['/patient-directory']
    },
    {
      icon: (
        <ConnectionIcon isFilled={location.pathname.includes('/connection')} />
      ),
      label: 'Connection',
      roles: [RoleType.PATIENT, RoleType.EXPERT],
      href: '/connection',
      patterns: ['/connection']
    },
    {
      icon: (
        <UserIcon
          isFilled={
            !!user?.id &&
            location.pathname.includes(`/expert-profile/${String(user.id)}`)
          }
        />
      ),
      label: 'My Profile',
      roles: [RoleType.EXPERT],
      href: `/expert-profile/${String(user?.id)}`,
      patterns: ['/expert-profile']
    },
    {
      icon: <AdvocacyIcon isFilled={location.pathname.includes('/advocacy')} />,
      label: 'Advocacy',
      roles: [RoleType.PATIENT, RoleType.EXPERT],
      href: '/advocacy',
      patterns: ['/advocacy']
    },
    {
      icon: <UserIcon />,
      label: 'User Management',
      roles: [RoleType.ADMIN],
      href: '/user-management',
      patterns: ['/user-management', '/user-detail']
    }
  ];

  if (user?.role === RoleType.ADMIN) {
    return (
      <SidebarAdmin initialExpanded={initialExpanded} menuItems={menuItems} />
    );
  }

  return (
    <SidebarUser
      initialExpanded={initialExpanded}
      menuItems={menuItems}
      role={user?.role}
    />
  );
};

export default Sidebar;

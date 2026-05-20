import { ProtectedRoute } from '@/routes/protected-route';
import AuthLayout from '@/shared/components/layouts/auth-layout';
// import NoSidebarLayout from '@/shared/components/layouts/no-sidebar-layout';
import PrivateLayout from '@/shared/components/layouts/private-layout';
// import PublicLayout from '@/shared/components/layouts/public-layout';
import ModalStack from '@/shared/components/ui/Modal/ModalStack';
import { ModalProvider } from '@/shared/hooks';
import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import { AdminNavigatorPage } from '@/pages/admin/admin-navigator-page';
import { AuthNavigatorPage } from '@/pages/auth/auth-navigator-page';
import { HomeNavigatorPage } from '@/pages/home/home-navigator-page';

const LoginPage = lazy(() =>
  import('@/pages/auth/login').then((module) => ({
    default: module.default
  }))
);

const SignupPage = lazy(() =>
  import('@/pages/auth/sign-up').then((module) => ({
    default: module.default
  }))
);

const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/forgot-password').then((module) => ({
    default: module.default
  }))
);

// const HealthRecordPage = lazy(() =>
//   import('@/pages/health-record/health-record-list-page').then((module) => ({
//     default: module.default
//   }))
// );

// const HealthRecordDetailPage = lazy(() =>
//   import('@/pages/health-record/health-record-detail-page').then((module) => ({
//     default: module.default
//   }))
// );

// const HealthRecordViewPage = lazy(() =>
//   import('@/pages/health-record/health-record-view-page').then((module) => ({
//     default: module.default
//   }))
// );

// const DiseaseDetailPage = lazy(() =>
//   import('@/pages/disease-detail-page').then((module) => ({
//     default: module.default
//   }))
// );

// const ExpertProfilePage = lazy(() =>
//   import('@/pages/expert-profile-page').then((module) => ({
//     default: module.default
//   }))
// );

// const PatientDirectoryPage = lazy(() =>
//   import('@/pages/patient-directory-page').then((module) => ({
//     default: module.default
//   }))
// );

// const ExpertOnboardingPage = lazy(() =>
//   import('@/pages/expert-onboarding-page').then((module) => ({
//     default: module.default
//   }))
// );

// const ConnectionPage = lazy(() =>
//   import('@/pages/connection').then((module) => ({
//     default: module.default
//   }))
// );

const AccountPage = lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.default
  }))
);

// const ChatPage = lazy(() =>
//   import('@/pages/chat').then((module) => ({
//     default: module.default
//   }))
// );

const UserManagementPage = lazy(() =>
  import('@/pages/admin/user-management-page').then((module) => ({
    default: module.default
  }))
);
// const UserDetailPage = lazy(() =>
//   import('@/pages/admin/user-detail-page').then((module) => ({
//     default: module.default
//   }))
// );

export const routes: RouteObject[] = [
  // User auth routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: '', element: <AuthNavigatorPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'sign-up', element: <SignupPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> }
    ]
  },
  // User routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ModalProvider>
          <PrivateLayout />
          <ModalStack />
        </ModalProvider>
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <HomeNavigatorPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: '*', element: <Navigate to="/admin" replace /> }
    ]
  },
  // Admin auth routes
  {
    path: '/admin/auth',
    element: <AuthLayout />,
    children: [
      { path: '', element: <AuthNavigatorPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> }
    ]
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute redirectTo="/admin/auth/login">
        <ModalProvider>
          <PrivateLayout />
          <ModalStack />
        </ModalProvider>
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <AdminNavigatorPage /> },
      { path: 'user-management', element: <UserManagementPage /> },
      // { path: 'user-detail/:id', element: <UserDetailPage /> },
      { path: '*', element: <Navigate to="/admin" replace /> }
    ]
  }
];

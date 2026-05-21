import { Navigate } from 'react-router-dom';

export const AuthNavigatorPage = () => (
  <Navigate to={'/admin/auth/login'} replace />
);

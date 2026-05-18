import LoginForm from '@/features/auth/login/components/login-process/login-form';
// import { VerifyOtp } from '@/features/auth/login/components/verify-otp';
// import { useAuthStore } from '@/shared/stores/useAuthStore';
import { type Dispatch, type SetStateAction } from 'react';

interface Props {
  onSetErrorCode: Dispatch<SetStateAction<number | undefined>>;
  onSetEmail: Dispatch<SetStateAction<string>>;
}

export default function LoginProcess({ onSetErrorCode, onSetEmail }: Props) {
  // const { user } = useAuthStore();

  // if (!user?.email) {
  return <LoginForm onSetEmail={onSetEmail} onSetErrorCode={onSetErrorCode} />;
  // }

  // return <VerifyOtp email={user.email} />;
}

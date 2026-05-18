import CancelRequestScreen from '@/features/auth/login/components/cancel-request-screen';
import LoginProcess from '@/features/auth/login/components/login-process';
import { useState } from 'react';

export default function LoginScreen() {
  const [errorCode, setErrorCode] = useState<number>();
  const [email, setEmail] = useState<string>('');

  if (!errorCode) {
    return <LoginProcess onSetEmail={setEmail} onSetErrorCode={setErrorCode} />;
  }

  return <CancelRequestScreen email={email} />;
}

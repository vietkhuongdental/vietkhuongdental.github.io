import { VerifyOtp } from '@/features/auth/login/components/cancel-request-screen/verify-otp';
import WelcomeBack from '@/features/auth/login/components/cancel-request-screen/welcome-back';
import { useState } from 'react';

interface Properties {
  email: string;
}

const CancelRequestScreen = ({ email }: Properties) => {
  const [isDoneRequest, setIsDoneRequest] = useState(false);

  if (!isDoneRequest) {
    return <WelcomeBack email={email} onSetIsDoneRequest={setIsDoneRequest} />;
  }

  return <VerifyOtp email={email} />;
};

export default CancelRequestScreen;

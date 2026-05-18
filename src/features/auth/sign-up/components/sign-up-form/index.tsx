import type { RoleType } from '@/constants';
import { SignUpInformationForm } from '@/features/auth/sign-up/components/sign-up-form/sign-up-information-form';
import { VerifyOtp } from '@/features/auth/sign-up/components/verify-otp';
import { useState } from 'react';

interface Properties {
  role: RoleType;
}

const SignUpForm = ({ role }: Properties) => {
  const [isDoneRegisterStep, setIsDoneRegisterStep] = useState(false);
  const [email, setEmail] = useState('');

  if (!isDoneRegisterStep) {
    return (
      <SignUpInformationForm
        role={role}
        setEmail={setEmail}
        setIsDoneRegisterStep={setIsDoneRegisterStep}
      />
    );
  }

  return <VerifyOtp email={email} />;
};

export default SignUpForm;

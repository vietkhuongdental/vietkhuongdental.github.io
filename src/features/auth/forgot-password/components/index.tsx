import { VerifyOtp } from '@/features/auth/forgot-password/components/verify-otp';
import { useState } from 'react';

import { OtpRestEmailInputForm } from './forgot-password-email-input';
import { ForgotPasswordInputForm } from './forgot-password-new-password-input';

export default function ForgotPasswordScreen() {
  const [stepForgotPassword, setStepForgotPassword] = useState('1');
  const [email, setEmail] = useState('');
  const [resetPasswordToken, setResetPasswordToken] = useState('');

  if (stepForgotPassword === '1') {
    return (
      <OtpRestEmailInputForm
        setEmail={setEmail}
        setStepForgotPassword={setStepForgotPassword}
      />
    );
  }

  if (stepForgotPassword === '2') {
    return (
      <VerifyOtp
        email={email}
        setResetPasswordToken={setResetPasswordToken}
        setStepForgotPassword={setStepForgotPassword}
      />
    );
  }

  if (stepForgotPassword === '3') {
    return (
      <ForgotPasswordInputForm
        email={email}
        resetPasswordToken={resetPasswordToken}
      />
    );
  }
}

import { ErrorIcon } from '@/assets/icons/error-icon';
import useVerifyOTP from '@/features/auth/sign-up/hooks/api/use-verify-otp';
import { OTPInput } from '@/shared/components/blocks/OtpInput';
import { Button } from '@/shared/components/ui/Button';
import type React from 'react';

interface VerifyOtpProps {
  email: string;
}

export const VerifyOtp: React.FC<VerifyOtpProps> = ({ email }) => {
  const {
    otp,
    isError,
    setOtp,
    isLoading,
    resendDisabled,
    countdown,
    handleResendCode,
    handleVerify
  } = useVerifyOTP({ email });

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">OTP Verification</h1>
      <p className="mb-8 text-gray-600">We've sent a 6-digit code to {email}</p>

      <div className="mb-6 flex flex-col gap-4">
        <OTPInput length={6} onChange={setOtp} value={otp} />
        {isError ? (
          <div className="flex flex-row gap-1">
            <ErrorIcon />
            <p className="text-icon-error">This is required field.</p>
          </div>
        ) : null}
      </div>

      <button
        className="mb-6 block font-medium text-primary-500 hover:underline disabled:text-gray-400 disabled:no-underline"
        disabled={resendDisabled}
        onClick={handleResendCode}
      >
        {resendDisabled ? `Resend code in ${countdown}s` : 'Resend code'}
      </button>

      <Button
        className="w-full"
        disabled={isLoading}
        onClick={handleVerify}
        size="lg"
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </Button>
    </>
  );
};

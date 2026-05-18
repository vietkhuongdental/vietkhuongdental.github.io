import { ErrorIcon } from '@/assets/icons/error-icon';
import useVerifyOTPLogin from '@/features/auth/login/hooks/use-verify-otp-login';
import { OTPInput } from '@/shared/components/blocks/OtpInput';
import { Button } from '@/shared/components/ui/Button';
import type React from 'react';

interface VerifyOtpProps {
  email: string;
}

export const VerifyOtp: React.FC<VerifyOtpProps> = ({ email }) => {
  const { otp, isError, setOtp, isLoading, handleReLogin, handleVerify } =
    useVerifyOTPLogin({ email });

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">Multi-factor authentication</h1>
      <p className="mb-8 text-gray-600">
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>

      <div className="mb-6 flex flex-col gap-4">
        <OTPInput length={6} onChange={setOtp} value={otp} />
        {isError ? (
          <div className="flex flex-row gap-1">
            <ErrorIcon />
            <p className="text-icon-error">This is required field.</p>
          </div>
        ) : null}
      </div>

      <p className="flex flex-row whitespace-nowrap text-md text-text-description">
        I haven't received the code. &nbsp;
        <button
          className="mb-6 block font-medium text-primary-500 hover:underline disabled:text-gray-400 disabled:no-underline"
          onClick={handleReLogin}
        >
          {`Login again`}
        </button>
      </p>

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

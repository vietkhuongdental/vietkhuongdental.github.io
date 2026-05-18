import useResendOtp from '@/features/auth/forgot-password/hooks/api/use-resend-otp';
import useSubmitOtp from '@/features/auth/forgot-password/hooks/api/use-submit-otp';
import { useToastProvider } from '@/shared/hooks';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  email: string;
  setStepForgotPassword: React.Dispatch<React.SetStateAction<string>>;
  setResetPasswordToken: React.Dispatch<React.SetStateAction<string>>;
}

function useVerifyOTP({
  email,
  setStepForgotPassword,
  setResetPasswordToken
}: Props) {
  const { showToast } = useToastProvider();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { onSubmitOtp, isPending: isLoading } = useSubmitOtp({
    onSuccess: async (response) => {
      showToast({
        variant: 'success',
        title: 'Verification successful',
        description: 'Your email has been verified.'
      });
      setStepForgotPassword('3');
      setResetPasswordToken(response.data.resetPasswordToken);
    },
    onError: async () => {
      showToast({ variant: 'error', title: 'Submit OTP unsuccessfully!' });
      setCountdown(60);
    }
  });

  const { onResendOtp, isPending: isResending } = useResendOtp({
    onSuccess: async () => {
      setCountdown(60);

      showToast({
        variant: 'info',
        title: 'Code resent',
        description: `A new verification code has been sent to ${email}`
      });
    },
    onError: async () => {
      showToast({ variant: 'error', title: 'Resend OTP unsuccessfully!' });
      setCountdown(60);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleResendCode = useCallback(() => {
    onResendOtp({ email });
  }, [email]);

  const handleVerify = useCallback(() => {
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setIsError(true);
      return;
    }

    onSubmitOtp({ email, otpCode: otpValue });
  }, [email, otp]);

  return {
    email,
    otp,
    setOtp,
    isError,
    isLoading,
    isResending,
    countdown,
    handleResendCode,
    handleVerify
  };
}

export default useVerifyOTP;

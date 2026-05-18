import useResendOtp from '@/features/auth/sign-up/api/use-resend-otp';
import useSubmitOtp from '@/features/auth/sign-up/hooks/api/use-submit-otp';
import { useToastProvider } from '@/shared/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  email: string;
}

function useVerifyOTP({ email }: Props) {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isError, setIsError] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { onSubmitOtp, isPending: isLoading } = useSubmitOtp({
    onSuccess: async () => {
      showToast({
        variant: 'success',
        title: 'Verification successful',
        description: 'Your email has been verified.'
      });
      navigate('/auth/login');
    },
    onError: async () => {
      showToast({ variant: 'error', title: 'Submit OTP unsuccessfully!' });
      setCountdown(60);
    }
  });

  const { onResendOtp, isPending: isResending } = useResendOtp({
    onSuccess: async () => {
      setResendDisabled(true);
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
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

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
    resendDisabled,
    countdown,
    handleResendCode,
    handleVerify
  };
}

export default useVerifyOTP;

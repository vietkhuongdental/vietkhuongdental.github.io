import useSubmitOtpCancelRequest from '@/features/auth/login/hooks/api/use-submit-otp-cancel-request';
import { useToastProvider } from '@/shared/hooks';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  email: string;
}

function useVerifyOTPCancelRequest({ email }: Props) {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isError, setIsError] = useState(false);

  const { onSubmitOtpCancelRequest, isPending: isLoading } =
    useSubmitOtpCancelRequest({
      onSuccess: async () => {
        showToast({
          variant: 'success',
          title: 'Verification successful'
        });
        navigate('/');
      },
      onError: async () => {
        showToast({ variant: 'error', title: 'Submit OTP unsuccessfully!' });
      }
    });

  const handleVerify = useCallback(() => {
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setIsError(true);
      return;
    }

    onSubmitOtpCancelRequest({ email, otpCode: otpValue });
  }, [email, otp]);

  return {
    email,
    otp,
    setOtp,
    isError,
    isLoading,
    handleVerify
  };
}

export default useVerifyOTPCancelRequest;

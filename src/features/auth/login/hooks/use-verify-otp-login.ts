import useSubmitOtpLogin from '@/features/auth/login/hooks/api/use-submit-otp-login';
import { useToastProvider } from '@/shared/hooks';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  email: string;
}

function useVerifyOTPLogin({ email }: Props) {
  const { authStore } = useAuthStore();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  const navigate = useNavigate();
  const { showToast } = useToastProvider();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isError, setIsError] = useState(false);

  const { onSubmitOtpLogin, isPending: isLoading } = useSubmitOtpLogin({
    onSuccess: async (response) => {
      showToast({
        variant: 'success',
        title: 'Login successfully'
      });

      const user = {
        id: response?.data?.account.id,
        email: response?.data?.account.userName,
        role: response?.data?.account.role,
        signature: response.data?.signature
      };

      authStore.setUser(user);

      const token = {
        accessToken: response?.data?.token.accessToken,
        refreshToken: response?.data?.token.refreshToken
      };

      // // if (getValues('remember')) {
      authStore.login(user, token);
      // // } else {
      // //   useTempAuthStore.getState().login(user, token);
      // // }

      // setTimeout(() => {
      //   navigate(from, { replace: true });
      // }, 100);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    },
    onError: async () => {
      showToast({ variant: 'error', title: 'Verify unsuccessfully!' });
    }
  });

  const handleReLogin = useCallback(() => {
    authStore.logout();
  }, [email]);

  const handleVerify = useCallback(() => {
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setIsError(true);
      return;
    }

    onSubmitOtpLogin({ email, otpCode: otpValue });
  }, [email, otp]);

  return {
    email,
    otp,
    setOtp,
    isError,
    isLoading,
    handleReLogin,
    handleVerify
  };
}

export default useVerifyOTPLogin;

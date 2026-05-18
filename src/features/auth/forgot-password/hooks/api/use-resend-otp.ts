import type { ResendOtpVerification } from '@/features/auth/sign-up/interface';
import { useToastProvider } from '@/shared/hooks';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const resendOtp = async (
  payload: ResendOtpVerification
): Promise<ApiResponseType<ResendOtpVerification>> => {
  const response = await httpService.post<ResendOtpVerification>(
    '/auth/email/otp-verification',
    payload
  );

  return response;
};

const useResendOtp = (
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    ResendOtpVerification
  >
) => {
  const { showToast } = useToastProvider();

  const {
    mutate: onResendOtp,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, ResendOtpVerification>({
    mutationKey: ['resend-code-verification'],
    mutationFn: async (payload: ResendOtpVerification) =>
      await responseWrapper(resendOtp, [payload]),
    onSuccess: async () => {
      showToast({
        variant: 'success',
        title: 'Resend OTP successfully!'
      });
    },

    onError: async () => {
      showToast({
        variant: 'error',
        title: 'Resend OTP unsuccessfully!'
      });
    },
    ...options
  });

  return {
    onResendOtp,
    isSuccess,
    isError,
    isPending
  };
};

export default useResendOtp;

import type { OtpVerification } from '@/features/auth/sign-up/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const submitOtp = async (
  payload: OtpVerification
): Promise<ApiResponseType<{ resetPasswordToken: string }>> => {
  const response = await httpService.patch<{ resetPasswordToken: string }>(
    '/auth/email/verify-reset-pass',
    payload
  );

  return response;
};

const useSubmitOtp = (
  options?: UseMutationOptions<
    ApiResponseType<{ resetPasswordToken: string }>,
    Error,
    OtpVerification
  >
) => {
  const {
    mutate: onSubmitOtp,
    isSuccess,
    isPending,
    isError
  } = useMutation<
    ApiResponseType<{ resetPasswordToken: string }>,
    Error,
    OtpVerification
  >({
    mutationKey: ['verify-reset-pass'],
    mutationFn: async (payload: OtpVerification) =>
      (await responseWrapper(submitOtp, [payload])) as ApiResponseType<{
        resetPasswordToken: string;
      }>,
    ...options
  });

  return {
    onSubmitOtp,
    isSuccess,
    isError,
    isPending
  };
};

export default useSubmitOtp;

import type { OtpVerification } from '@/features/auth/sign-up/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const submitOtp = async (
  payload: OtpVerification
): Promise<ApiResponseType<OtpVerification>> => {
  const response = await httpService.patch<OtpVerification>(
    '/auth/email/verify',
    payload
  );

  return response;
};

const useSubmitOtp = (
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, OtpVerification>
) => {
  const {
    mutate: onSubmitOtp,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, OtpVerification>({
    mutationKey: ['verify-otp'],
    mutationFn: async (payload: OtpVerification) =>
      await responseWrapper(submitOtp, [payload]),
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

import type { OtpVerification } from '@/features/auth/login/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const SubmitOtpCancelRequest = async (
  payload: OtpVerification
): Promise<ApiResponseType<OtpVerification>> => {
  const response = await httpService.patch<OtpVerification>(
    '/auth/email/cancel-delete',
    payload
  );

  return response;
};

const useSubmitOtpCancelRequest = (
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, OtpVerification>
) => {
  const {
    mutate: onSubmitOtpCancelRequest,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, OtpVerification>({
    mutationKey: ['otp-cancel-delete'],
    mutationFn: async (payload: OtpVerification) =>
      await responseWrapper(SubmitOtpCancelRequest, [payload]),
    ...options
  });

  return {
    onSubmitOtpCancelRequest,
    isSuccess,
    isError,
    isPending
  };
};

export default useSubmitOtpCancelRequest;

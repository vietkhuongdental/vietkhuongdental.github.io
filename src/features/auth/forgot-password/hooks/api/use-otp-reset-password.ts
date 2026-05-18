import type { ForgotPasswordEmailInput } from '@/features/auth/forgot-password/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const otpResetEmail = async (
  payload: ForgotPasswordEmailInput
): Promise<ApiResponseType<ForgotPasswordEmailInput>> => {
  const response = await httpService.post<ForgotPasswordEmailInput>(
    '/auth/email/otp-reset-pass',
    payload
  );
  return response;
};

const useOtpResetEmail = (
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    ForgotPasswordEmailInput
  >
) => {
  const {
    mutate: onOtpResetEmail,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, ForgotPasswordEmailInput>({
    mutationKey: ['otp-reset-pass'],
    mutationFn: async (payload: ForgotPasswordEmailInput) =>
      await responseWrapper(otpResetEmail, [payload]),
    ...options
  });

  return {
    onOtpResetEmail,
    isSuccess,
    isError,
    isLoading: isPending
  };
};

export default useOtpResetEmail;

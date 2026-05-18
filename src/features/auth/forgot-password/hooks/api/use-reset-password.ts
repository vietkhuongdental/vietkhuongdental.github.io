import type { ForgotPasswordNewPasswordPayload } from '@/features/auth/forgot-password/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const resetEmail = async (
  payload: ForgotPasswordNewPasswordPayload
): Promise<ApiResponseType<ForgotPasswordNewPasswordPayload>> => {
  const response = await httpService.post<ForgotPasswordNewPasswordPayload>(
    '/auth/email/reset-pass',
    payload
  );
  return response;
};

const useResetEmail = (
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    ForgotPasswordNewPasswordPayload
  >
) => {
  const {
    mutate: onResetEmail,
    isSuccess,
    isPending,
    isError
  } = useMutation<
    ApiResponseType<unknown>,
    Error,
    ForgotPasswordNewPasswordPayload
  >({
    mutationKey: ['reset-pass'],
    mutationFn: async (payload: ForgotPasswordNewPasswordPayload) =>
      await responseWrapper(resetEmail, [payload]),
    ...options
  });

  return {
    onResetEmail,
    isSuccess,
    isError,
    isLoading: isPending
  };
};

export default useResetEmail;

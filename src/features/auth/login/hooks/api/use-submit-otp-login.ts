import type { UserLoginResponse } from '@/features/auth/login/interface';
import type { OtpVerification } from '@/features/auth/sign-up/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const submitOtpLogin = async (
  payload: OtpVerification
): Promise<ApiResponseType<UserLoginResponse>> => {
  const response = await httpService.post<UserLoginResponse>(
    '/auth/email/verify-login',
    payload
  );

  return response;
};

const useSubmitOtpLogin = (
  options?: UseMutationOptions<
    ApiResponseType<UserLoginResponse>,
    Error,
    OtpVerification
  >
) => {
  const {
    mutate: onSubmitOtpLogin,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<UserLoginResponse>, Error, OtpVerification>({
    mutationKey: ['verify-login'],
    mutationFn: async (payload: OtpVerification) =>
      (await responseWrapper(submitOtpLogin, [
        payload
      ])) as ApiResponseType<UserLoginResponse>,
    ...options
  });

  return {
    onSubmitOtpLogin,
    isSuccess,
    isError,
    isPending
  };
};

export default useSubmitOtpLogin;

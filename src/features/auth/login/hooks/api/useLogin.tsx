// Shared Imports
import type {
  UserLogin,
  UserLoginResponse
} from '@/features/auth/login/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpSupabaseService, responseWrapper } from '@/shared/services/http';
// Tanstack Imports
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const login = async (
  payload: UserLogin
): Promise<ApiResponseType<UserLoginResponse>> => {
  const response = await httpSupabaseService.post<UserLoginResponse, UserLogin>(
    '/login',
    { ...payload }
  );
  return response;
};

const useLogin = (
  options?: UseMutationOptions<
    ApiResponseType<UserLoginResponse>,
    Error,
    UserLogin
  >
) => {
  const {
    mutate: onLogin,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<UserLoginResponse>, Error, UserLogin>({
    mutationKey: ['login'],
    mutationFn: async (payload: UserLogin) =>
      (await responseWrapper(login, [
        payload
      ])) as ApiResponseType<UserLoginResponse>,
    ...options
  });

  return {
    onLogin,
    isSuccess,
    isError,
    isPending
  };
};

export default useLogin;

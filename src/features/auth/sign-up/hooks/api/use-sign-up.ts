import type { User } from '@/shared/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const signUp = async (payload: User): Promise<ApiResponseType<User>> => {
  const response = await httpService.post<User>('/auth/email/signup', payload);
  return response;
};

const useSignup = (
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, User>
) => {
  const {
    mutate: onSignup,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, User>({
    mutationKey: ['sign-up'],
    mutationFn: async (payload: User) =>
      await responseWrapper(signUp, [payload]),
    ...options
  });

  return {
    onSignup,
    isSuccess,
    isError,
    isLoading: isPending
  };
};

export default useSignup;

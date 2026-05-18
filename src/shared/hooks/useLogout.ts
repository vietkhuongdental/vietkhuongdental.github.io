import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const logout = async (): Promise<ApiResponseType<unknown>> => {
  const response = await httpService.post('/auth/logout', null);
  return response;
};

export const useLogout = (
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, unknown>
) => {
  const {
    mutateAsync: onLogout,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, unknown>({
    mutationKey: ['logout'],
    mutationFn: async () => await responseWrapper(logout, []),
    ...options
  });

  return {
    onLogout,
    isSuccess,
    isError,
    isPending
  };
};

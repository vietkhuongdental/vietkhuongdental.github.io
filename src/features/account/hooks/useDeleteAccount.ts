import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const deleteAccount = async (): Promise<ApiResponseType<unknown>> =>
  await httpService.delete(`/auth/email`);

const useDeleteAccount = (
  options?: UseMutationOptions<ApiResponseType<unknown>>
) => {
  const {
    data,
    error,
    isPending,
    mutate: onDeleteAccount
  } = useMutation<ApiResponseType<unknown>>({
    mutationFn: async () => await responseWrapper(deleteAccount, []),
    ...options
  });

  return {
    account: data?.data,
    isPending,
    error,
    onDeleteAccount
  };
};

export default useDeleteAccount;

/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { UserAccountProfile } from '@/features/user-detail/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchUserAccount = async (params: {
  id: string;
}): Promise<ApiResponseType<UserAccountProfile>> => {
  const response = await httpService.get<UserAccountProfile>(
    `admins/accounts/${params.id}`
  );
  return response;
};

const useGetAccountById = (
  params: { id: string },
  options?: UseQueryOptions<ApiResponseType<UserAccountProfile>>
) => {
  const {
    data,
    error,
    isLoading,
    refetch: onGetUserAccount
  } = useQuery<ApiResponseType<UserAccountProfile>>({
    queryKey: ['user-account', params?.id],
    queryFn: async () =>
      (await responseWrapper(fetchUserAccount, [
        params
      ])) as ApiResponseType<UserAccountProfile>,
    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateUserAccount = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['user-account', params?.id]
    });
  };

  return {
    userAccount: data?.data,
    isLoading,
    error,
    handleInvalidateUserAccount,
    onGetUserAccount
  };
};

export default useGetAccountById;

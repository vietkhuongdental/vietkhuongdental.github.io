/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { UserProfile } from '@/features/account/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchMyProfile = async (): Promise<ApiResponseType<UserProfile>> => {
  const response = await httpService.get<UserProfile>('/me');
  return response;
};

const useGetMyProfile = (
  options?: UseQueryOptions<ApiResponseType<UserProfile>>
) => {
  const { user } = useAuthStore();
  const {
    data,
    error,
    isLoading,
    refetch: onGetMyProfile
  } = useQuery<ApiResponseType<UserProfile>>({
    queryKey: ['my-profile', user?.id],
    queryFn: async () =>
      (await responseWrapper(
        fetchMyProfile,
        []
      )) as ApiResponseType<UserProfile>,
    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateMyProfile = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['my-profile', user?.id]
    });
  };

  return {
    myProfile: data?.data || ({} as UserProfile),
    isLoading,
    error,
    handleInvalidateMyProfile,
    onGetMyProfile
  };
};

export default useGetMyProfile;

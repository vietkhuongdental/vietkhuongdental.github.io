/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchUnreadMessageCount = async (): Promise<
  ApiResponseType<{ total: number }>
> => {
  const response = await httpService.get<{ total: number }>(
    '/channel/messages/unread'
  );
  return response;
};

export const useGetUnreadMessageCount = (
  options?: UseQueryOptions<ApiResponseType<{ total: number }>>
) => {
  const { user } = useAuthStore();
  const {
    data,
    error,
    isLoading,
    refetch: onGetUnreadMessageCount
  } = useQuery<ApiResponseType<{ total: number }>>({
    queryKey: ['unread-message-count', user?.id],
    queryFn: async () =>
      (await responseWrapper(fetchUnreadMessageCount, [])) as ApiResponseType<{
        total: number;
      }>,
    refetchInterval: 10_000, // Poll every 30 seconds if enabled
    refetchIntervalInBackground: false, // Only poll when tab is active
    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateUnreadMessageCount = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['unread-message-count', user?.id]
    });
  };

  return {
    unreadCount: data?.data?.total || 0,
    isLoading,
    error,
    handleInvalidateUnreadMessageCount,
    onGetUnreadMessageCount
  };
};

/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { HealthRecord } from '@/features/health-record/interface';
import type { ApiPaginationResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchHealthRecords = async (): Promise<
  ApiPaginationResponseType<HealthRecord[]>
> => {
  const response = await httpService.getMany<HealthRecord[]>(
    '/patients/health-records'
  );
  return response;
};

const useGetHealthRecords = (
  options?: UseQueryOptions<ApiPaginationResponseType<HealthRecord[]>>
) => {
  const {
    data,
    error,
    isLoading,
    refetch: onGetHealthRecords
  } = useQuery<ApiPaginationResponseType<HealthRecord[]>>({
    queryKey: ['healthRecords'],
    queryFn: async () =>
      (await responseWrapper(
        fetchHealthRecords,
        []
      )) as ApiPaginationResponseType<HealthRecord[]>,
    gcTime: 0, // cache Time
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,

    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateHealthRecords = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['healthRecords']
    });
  };

  return {
    healthRecords: data?.data?.data || [],
    isFetching: isLoading,
    error,
    handleInvalidateHealthRecords,
    onGetHealthRecords
  };
};

export default useGetHealthRecords;

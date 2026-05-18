import type { HealthRecord } from '@/features/health-record/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchHealthRecordById = async (params: {
  id?: string;
}): Promise<ApiResponseType<HealthRecord>> => {
  const response = await httpService.get<HealthRecord, typeof params>(
    `/patients/health-records/${params.id}`
  );
  return response;
};

const useGetHealthRecordById = (
  params: { id?: string },
  options?: UseQueryOptions<ApiResponseType<HealthRecord>>
) => {
  const {
    data,
    error,
    isLoading,
    refetch: onGetHealthRecordById
  } = useQuery<ApiResponseType<HealthRecord>>({
    queryKey: ['healthReccord', params.id],
    queryFn: async () =>
      (await responseWrapper<HealthRecord, [typeof params]>(
        fetchHealthRecordById,
        [params]
      )) as ApiResponseType<HealthRecord>,
    enabled: !!params.id,
    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateHealthRecordById = async (params: { id: string }) => {
    await queryClient.invalidateQueries({
      queryKey: ['healthReccord', params.id]
    });
  };

  return {
    data: data?.data,
    isFetching: isLoading,
    error,
    handleInvalidateHealthRecordById,
    onGetHealthRecordById
  };
};

export default useGetHealthRecordById;

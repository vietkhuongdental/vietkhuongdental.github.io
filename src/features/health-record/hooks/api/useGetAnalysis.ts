import type { HealthRecordAnalysis } from '@/features/health-record/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchAnalysis = async (params: {
  id?: string;
}): Promise<ApiResponseType<HealthRecordAnalysis>> => {
  const response = await httpService.get<HealthRecordAnalysis, typeof params>(
    `/patients/health-records/${params.id}/analysis`
  );
  return response;
};

const useGetAnalysis = (
  params: { id?: string },
  options?: UseQueryOptions<ApiResponseType<HealthRecordAnalysis>>
) => {
  const {
    data,
    error,
    isLoading,
    refetch: onGetAnalysis
  } = useQuery<ApiResponseType<HealthRecordAnalysis>>({
    queryKey: ['analysis', params.id],
    queryFn: async () =>
      (await responseWrapper<HealthRecordAnalysis, [typeof params]>(
        fetchAnalysis,
        [params]
      )) as ApiResponseType<HealthRecordAnalysis>,
    enabled: !!params.id,
    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateAnalysis = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['analysis', params.id]
    });
  };

  return {
    data: data?.data,
    isFetching: isLoading,
    error,
    handleInvalidateAnalysis,
    onGetAnalysis
  };
};

export default useGetAnalysis;

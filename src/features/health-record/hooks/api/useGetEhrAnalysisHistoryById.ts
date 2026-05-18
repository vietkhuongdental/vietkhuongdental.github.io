import type { HealthRecordAnalysis } from '@/features/health-record/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchEhrAnalysisHistoryById = async (params: {
  id?: string;
}): Promise<ApiResponseType<HealthRecordAnalysis>> => {
  const response = await httpService.get<HealthRecordAnalysis, typeof params>(
    `/patients/health-record-histories/${params.id}`
  );
  return response;
};

const useGetEhrAnalysisHistoryById = (
  params: { id?: string },
  options?: UseQueryOptions<ApiResponseType<HealthRecordAnalysis>>
) => {
  const {
    data,
    error,
    isLoading,
    refetch: onGetEhrAnalysisHistoryById
  } = useQuery<ApiResponseType<HealthRecordAnalysis>>({
    queryKey: ['healthReccordHistory', params.id],
    queryFn: async () =>
      (await responseWrapper<HealthRecordAnalysis, [typeof params]>(
        fetchEhrAnalysisHistoryById,
        [params]
      )) as ApiResponseType<HealthRecordAnalysis>,
    enabled: !!params.id,
    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateEhrAnalysisHistoryById = async (params: {
    id: string;
  }) => {
    await queryClient.invalidateQueries({
      queryKey: ['healthReccordHistory', params.id]
    });
  };

  return {
    data: data?.data,
    isFetching: isLoading,
    error,
    handleInvalidateEhrAnalysisHistoryById,
    onGetEhrAnalysisHistoryById
  };
};

export default useGetEhrAnalysisHistoryById;

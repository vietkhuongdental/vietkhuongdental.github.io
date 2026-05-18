import type { AnonymizedHealthRecord } from '@/features/health-record/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchHealthRecordAnonymizedById = async (params: {
  id?: string;
}): Promise<ApiResponseType<AnonymizedHealthRecord>> => {
  const response = await httpService.get<AnonymizedHealthRecord, typeof params>(
    `/experts/health-records/${params.id}/anonymized`
  );
  return response;
};

const useGetAnonymizedHealthRecordById = (
  params: { id?: string },
  options?: UseQueryOptions<ApiResponseType<AnonymizedHealthRecord>>
) => {
  const {
    data,
    error,
    isLoading,
    refetch: onGetHealthRecordById
  } = useQuery<ApiResponseType<AnonymizedHealthRecord>>({
    queryKey: ['health-record-anonymized', params.id],
    queryFn: async () =>
      (await responseWrapper<AnonymizedHealthRecord, [typeof params]>(
        fetchHealthRecordAnonymizedById,
        [params]
      )) as ApiResponseType<AnonymizedHealthRecord>,
    enabled: !!params.id,
    ...options
  });

  const queryClient = useQueryClient();

  const handleInvalidateHealthRecordById = async (params: { id: string }) => {
    await queryClient.invalidateQueries({
      queryKey: ['health-record-anonymized', params.id]
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

export default useGetAnonymizedHealthRecordById;

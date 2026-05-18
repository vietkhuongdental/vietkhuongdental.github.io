import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const deleteHealthRecordById = async (params: {
  id?: string;
}): Promise<ApiResponseType<unknown>> =>
  await httpService.delete<unknown, typeof params>(
    `/patients/health-records/${params.id}`
  );

const useDeleteHealthRecord = (
  params: { id?: string },
  options?: UseMutationOptions<ApiResponseType<unknown>>
) => {
  const {
    data,
    error,
    isPending,
    mutate: onDeleteHealthRecord
  } = useMutation<ApiResponseType<unknown>>({
    mutationFn: async () =>
      await responseWrapper(deleteHealthRecordById, [params]),
    ...options
  });

  return {
    healthRecord: data?.data,
    isPending,
    error,
    onDeleteHealthRecord
  };
};

export default useDeleteHealthRecord;

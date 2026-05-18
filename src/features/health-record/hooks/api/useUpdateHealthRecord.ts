import type { HealthRecord } from '@/features/health-record/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateUpdateHealthRecord = async (
  payload: HealthRecord
): Promise<ApiResponseType<unknown>> =>
  await httpService.put(`/patients/health-records/${payload.id}`, payload);

const useUpdateHealthRecord = (
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, HealthRecord>
) => {
  const {
    mutate: onUpdateHealthRecord,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, HealthRecord>({
    mutationFn: async (payload: HealthRecord) =>
      await responseWrapper(mutateUpdateHealthRecord, [payload]),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onUpdateHealthRecord,
    isSuccess,
    isError,
    isPending
  };
};

export default useUpdateHealthRecord;

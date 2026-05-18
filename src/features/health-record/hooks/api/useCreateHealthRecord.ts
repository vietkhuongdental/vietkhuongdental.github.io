import type { HealthRecord } from '@/features/health-record/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateCreateHealthRecord = async (
  payload: HealthRecord
): Promise<ApiResponseType<unknown>> =>
  await httpService.post<unknown, HealthRecord>(
    '/patients/health-records',
    payload
  );

const useCreateHealthRecord = (
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, HealthRecord>
) => {
  const {
    mutate: onCreateHealthRecord,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, HealthRecord>({
    mutationFn: async (payload: HealthRecord) =>
      await responseWrapper(mutateCreateHealthRecord, [payload]),
    ...options
  });

  return {
    onCreateHealthRecord,
    isSuccess,
    isError,
    isPending
  };
};

export default useCreateHealthRecord;

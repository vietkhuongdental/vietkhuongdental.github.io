import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutatePatchHealthRecordStatus = async (
  id: string,
  payload: {
    isPublish: boolean;
  }
): Promise<ApiResponseType<unknown>> =>
  await httpService.patch(`/patients/health-records/${id}/status`, payload);

const usePatchHealthRecordStatus = (
  params: { id: string },
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    { isPublish: boolean }
  >
) => {
  const {
    mutate: onUpdateHealthRecordStatus,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, { isPublish: boolean }>({
    mutationFn: async (payload: { isPublish: boolean }) =>
      await responseWrapper(mutatePatchHealthRecordStatus, [
        params.id,
        payload
      ]),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onUpdateHealthRecordStatus,
    isSuccess,
    isError,
    isPending
  };
};

export default usePatchHealthRecordStatus;

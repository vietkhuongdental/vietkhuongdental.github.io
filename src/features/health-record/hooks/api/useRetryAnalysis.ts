import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateRetryAnalysis = async (
  id: string
): Promise<ApiResponseType<unknown>> =>
  await httpService.post(`/patients/health-records/${id}/re-analyze`, {});

const useRetryAnalysis = (
  params: { id?: string },
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, unknown>
) => {
  const {
    mutate: onRetryAnalysis,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, unknown>({
    mutationFn: async () => {
      if (!params.id) throw new Error('Missing health record ID');
      return await responseWrapper(mutateRetryAnalysis, [params.id]);
    },
    ...options
  });

  return {
    onRetryAnalysis,
    isSuccess,
    isError,
    isPending
  };
};

export default useRetryAnalysis;

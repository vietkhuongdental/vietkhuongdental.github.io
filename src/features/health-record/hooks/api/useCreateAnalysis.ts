import type { AnalysisPayload } from '@/features/health-record/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateCreateAnalysis = async (
  id: string,
  payload: AnalysisPayload
): Promise<ApiResponseType<unknown>> =>
  await httpService.post(`/patients/health-records/${id}/analysis`, payload);

const useCreateAnalysis = (
  params: { id?: string },
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, AnalysisPayload>
) => {
  const {
    mutate: onCreateAnalysis,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, AnalysisPayload>({
    mutationFn: async (payload) => {
      if (!params.id) throw new Error('Missing health record ID');
      return await responseWrapper(mutateCreateAnalysis, [params.id, payload]);
    },
    ...options
  });

  return {
    onCreateAnalysis,
    isSuccess,
    isError,
    isPending
  };
};

export default useCreateAnalysis;

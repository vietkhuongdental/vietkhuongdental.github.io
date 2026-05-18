import type { VotePayload } from '@/features/health-record/interface';
import type { PotentialDisease } from '@/shared/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateVote = async (
  payload: VotePayload
): Promise<ApiResponseType<PotentialDisease>> =>
  await httpService.post<PotentialDisease, VotePayload>(
    `/experts/health-records/${payload.id}/review`,
    payload
  );

const useCreateUpdateVote = (
  options?: UseMutationOptions<
    ApiResponseType<PotentialDisease>,
    Error,
    VotePayload
  >
) => {
  const {
    mutateAsync: onCreateUpdateVote,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<PotentialDisease>, Error, VotePayload>({
    mutationFn: async (payload: VotePayload) =>
      (await responseWrapper(mutateVote, [
        payload
      ])) as ApiResponseType<PotentialDisease>,
    ...options
  });

  return {
    onCreateUpdateVote,
    isSuccess,
    isError,
    isPending
  };
};

export default useCreateUpdateVote;

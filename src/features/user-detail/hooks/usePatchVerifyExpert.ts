import type { VerifyProfileStatus } from '@/constants';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutatePatchVerifyExpert = async (
  payload: {
    comment?: string;
    status: VerifyProfileStatus;
  },
  id: string
): Promise<ApiResponseType<unknown>> =>
  await httpService.patch(`/admins/expert-profiles/${id}/verify`, payload);

const usePatchVerifyExpert = (
  params: { id: string },
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    {
      comment?: string;
      status: VerifyProfileStatus;
    }
  >
) => {
  const {
    mutate: onUpdateVerifyExpert,
    isSuccess,
    isPending,
    isError
  } = useMutation<
    ApiResponseType<unknown>,
    Error,
    {
      comment?: string;
      status: VerifyProfileStatus;
    }
  >({
    mutationFn: async (payload: {
      comment?: string;
      status: VerifyProfileStatus;
    }) => await responseWrapper(mutatePatchVerifyExpert, [payload, params.id]),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onUpdateVerifyExpert,
    isSuccess,
    isError,
    isPending
  };
};

export default usePatchVerifyExpert;

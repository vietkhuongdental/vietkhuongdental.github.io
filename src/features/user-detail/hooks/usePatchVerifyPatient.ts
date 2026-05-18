import type { VerifyProfileStatus } from '@/constants';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutatePatchVerifyPatient = async (
  payload: {
    comment?: string;
    status: VerifyProfileStatus;
  },
  id: string
): Promise<ApiResponseType<unknown>> =>
  await httpService.patch(`/admins/patient-profiles/${id}/verify`, payload);

const usePatchVerifyPatient = (
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
    mutate: onUpdateVerifyPatient,
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
    }) => await responseWrapper(mutatePatchVerifyPatient, [payload, params.id]),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onUpdateVerifyPatient,
    isSuccess,
    isError,
    isPending
  };
};

export default usePatchVerifyPatient;

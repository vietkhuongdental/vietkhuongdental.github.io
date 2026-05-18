import type { VerifyPatientRequest } from '@/features/account/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateUpdatePatientProfile = async (
  payload: VerifyPatientRequest
): Promise<ApiResponseType<unknown>> =>
  await httpService.put(`/patients/profile`, payload);

const useUpdatePatientProfile = (
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    VerifyPatientRequest
  >
) => {
  const {
    mutate: onUpdatePatientProfile,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, VerifyPatientRequest>({
    mutationFn: async (payload: VerifyPatientRequest) =>
      await responseWrapper(mutateUpdatePatientProfile, [payload]),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onUpdatePatientProfile,
    isSuccess,
    isError,
    isPending
  };
};

export default useUpdatePatientProfile;

import type { ChangePasswordRequest } from '@/features/account/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateUpdatePassword = async (
  payload: ChangePasswordRequest
): Promise<ApiResponseType<unknown>> =>
  await httpService.put(`/auth/email/change-pass`, payload);

const useUpdatePassword = (
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    ChangePasswordRequest
  >
) => {
  const {
    mutate: onUpdatePassword,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>, Error, ChangePasswordRequest>({
    mutationFn: async (payload: ChangePasswordRequest) =>
      await responseWrapper(mutateUpdatePassword, [payload]),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onUpdatePassword,
    isSuccess,
    isError,
    isPending
  };
};

export default useUpdatePassword;

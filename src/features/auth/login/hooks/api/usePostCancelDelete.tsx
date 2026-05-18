import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const postCancelDelete = async (params: {
  email: string;
}): Promise<ApiResponseType<unknown>> => {
  const response = await httpService.post('/auth/email/otp-cancel-delete', {
    ...params
  });
  return response;
};

export const usePostCancelDelete = (
  params: { email: string },
  options?: UseMutationOptions<ApiResponseType<unknown>>
) => {
  const {
    mutateAsync: onPostCancelDelete,
    isSuccess,
    isPending,
    isError
  } = useMutation<ApiResponseType<unknown>>({
    mutationKey: ['otp-cancel-delete'],
    mutationFn: async () => await responseWrapper(postCancelDelete, [params]),
    ...options
  });

  return {
    onPostCancelDelete,
    isSuccess,
    isError,
    isPending
  };
};

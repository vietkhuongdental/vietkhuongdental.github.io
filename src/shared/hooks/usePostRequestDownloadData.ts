import type { DownloadDataResponse, DownloadRequest } from '@/shared/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateRequestDownloadData = async (
  payload: DownloadRequest
): Promise<ApiResponseType<DownloadDataResponse>> =>
  await httpService.post<DownloadDataResponse, DownloadRequest>(
    '/download/private',
    payload
  );

export const usePostRequestDownloadData = (
  options?: UseMutationOptions<
    ApiResponseType<DownloadDataResponse>,
    Error,
    DownloadRequest
  >
) => {
  const {
    mutateAsync: onRequestDownloadData,
    isSuccess,
    isPending,
    isError
  } = useMutation<
    ApiResponseType<DownloadDataResponse>,
    Error,
    DownloadRequest
  >({
    mutationFn: async (payload: DownloadRequest) =>
      (await responseWrapper(mutateRequestDownloadData, [
        payload
      ])) as ApiResponseType<DownloadDataResponse>,
    ...options
  });

  return {
    onRequestDownloadData,
    isSuccess,
    isError,
    isPending
  };
};

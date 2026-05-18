import type { EHRDownloadRequest } from '@/features/health-record/interface';
import type { DownloadDataResponse } from '@/shared/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateRequestDownloadData = async (
  payload: EHRDownloadRequest
): Promise<ApiResponseType<DownloadDataResponse>> =>
  await httpService.post<DownloadDataResponse, EHRDownloadRequest>(
    '/download/health-records',
    payload
  );

export const usePostRequestDownloadEHRData = (
  options?: UseMutationOptions<
    ApiResponseType<DownloadDataResponse>,
    Error,
    EHRDownloadRequest
  >
) => {
  const {
    mutateAsync: onRequestDownloadData,
    isSuccess,
    isPending,
    isError,
    variables
  } = useMutation<
    ApiResponseType<DownloadDataResponse>,
    Error,
    EHRDownloadRequest
  >({
    mutationFn: async (payload: EHRDownloadRequest) =>
      (await responseWrapper(mutateRequestDownloadData, [
        payload
      ])) as ApiResponseType<DownloadDataResponse>,
    ...options
  });

  return {
    onRequestDownloadData,
    isSuccess,
    isError,
    fetchingFile: isPending ? variables?.fileKey : ''
  };
};

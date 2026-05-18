import type { ApiResponseType } from '@/shared/services/http';
import { httpService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type {
  FilePresignedUrlPayload,
  FilePresignedUrlResponse
} from '../interface';

const fetchPresignedUrl = async (
  params: { destination: string },
  payload: FilePresignedUrlPayload
): Promise<ApiResponseType<FilePresignedUrlResponse>> => {
  const response = await httpService.post<
    FilePresignedUrlResponse,
    FilePresignedUrlPayload
  >(`/upload/${params.destination}`, payload);
  return response;
};

export const useGetFilePresignedUrl = (
  params: { destination: string },
  options?: UseMutationOptions<
    FilePresignedUrlResponse,
    Error,
    FilePresignedUrlPayload
  >
) => {
  const {
    mutateAsync: onGetFilePresignedUrl,
    isSuccess,
    isPending,
    isError
  } = useMutation<FilePresignedUrlResponse, Error, FilePresignedUrlPayload>({
    mutationFn: async (payload: FilePresignedUrlPayload) => {
      const response = (await responseWrapper(fetchPresignedUrl, [
        params,
        payload
      ])) as ApiResponseType<FilePresignedUrlResponse>;
      return response.data;
    },
    ...options
  });

  return {
    onGetFilePresignedUrl,
    isSuccess,
    isError,
    isPending
  };
};

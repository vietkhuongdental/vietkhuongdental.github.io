/* eslint-disable @typescript-eslint/naming-convention */
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export const useCheckUploadStatus = (
  options?: UseMutationOptions<Response, Error, { sessionUrl: string }>
) => {
  const {
    mutateAsync: onCheckUploadStatus,
    isSuccess,
    isPending,
    isError
  } = useMutation<Response, Error, { sessionUrl: string }>({
    mutationFn: async (payload: { sessionUrl: string }) => {
      const response = await fetch(payload.sessionUrl, {
        method: 'PUT',
        headers: {
          'Content-Range': 'bytes */*',
          'Content-Type': 'application/octet-stream'
        }
      });
      return response;
    },
    ...options
  });

  return {
    onCheckUploadStatus,
    isSuccess,
    isError,
    isPending
  };
};

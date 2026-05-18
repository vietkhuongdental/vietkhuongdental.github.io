/* eslint-disable @typescript-eslint/naming-convention */
import type { UploadChunkPayload } from '@/shared/interface';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export const useUploadChunk = (
  options?: UseMutationOptions<Response, Error, UploadChunkPayload>
) => {
  const {
    mutateAsync: mutateUploadChunk,
    isSuccess,
    isPending,
    isError
  } = useMutation<Response, Error, UploadChunkPayload>({
    mutationFn: async (payload: UploadChunkPayload) => {
      console.log(
        'mutate uploading  :>> ',
        `bytes ${payload.offset}-${payload.offset + payload.chunk.length - 1}/${payload.totalSize}`
      );
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Range': `bytes ${payload.offset}-${payload.offset + payload.chunk.length - 1}/${payload.totalSize}`
        },
        body: payload.chunk
      };

      console.log('Payload chunk length:', payload.chunk.length);
      const response = await fetch(payload.sessionUrl, options);

      if (response.status === 308) {
        const range = response.headers.get('Range');
        console.log('Received 308, server has:', range);
      }

      if (response.status === 200 || response.status === 201) {
        console.log('Upload complete');
      }

      return response;
    },
    ...options
  });

  return {
    mutateUploadChunk,
    isSuccess,
    isError,
    isPending
  };
};

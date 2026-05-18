/* eslint-disable @typescript-eslint/naming-convention */
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { ResumableSessionUrlPayload } from '../interface';

export const useGetResumableSession = (
  options?: UseMutationOptions<string, Error, ResumableSessionUrlPayload>
) => {
  const {
    mutateAsync: onGetResumableSession,
    isSuccess,
    isPending,
    isError
  } = useMutation<string, Error, ResumableSessionUrlPayload>({
    mutationFn: async (payload: ResumableSessionUrlPayload) => {
      const response = await fetch(payload.uploadUrl, {
        method: 'POST',
        headers: {
          'x-goog-resumable': 'start',
          host: 'storage.googleapis.com',
          'x-goog-meta-file_name': payload.fileName,
          'x-goog-meta-id': payload.accountId,
          'Content-Type': payload.fileType || 'application/octet-stream'
        }
      });
      return response.headers.get('location') as string;
    },
    ...options
  });

  return {
    onGetResumableSession,
    isSuccess,
    isError,
    isPending
  };
};

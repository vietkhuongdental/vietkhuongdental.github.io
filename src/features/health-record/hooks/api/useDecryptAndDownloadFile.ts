import { handleDecryptAndDownloadFile } from '@/shared/libs/utils';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

interface DecryptAndDownloadPayload {
  encryptedKey?: string;
  fileName: string;
  fileKey: string;
  presignedUrl: string;
  signature?: string;
}

export const useDecryptAndDownloadFile = (
  options?: UseMutationOptions<void, Error, DecryptAndDownloadPayload>
) => {
  const {
    error,
    isPending,
    variables,
    mutateAsync: onDecryptAndDownloadFile
  } = useMutation({
    mutationFn: async (payload: DecryptAndDownloadPayload) =>
      await handleDecryptAndDownloadFile(payload),
    ...options
  });

  return {
    isPending,
    isHandling: isPending ? variables.fileKey : '',
    error,
    onDecryptAndDownloadFile
  };
};

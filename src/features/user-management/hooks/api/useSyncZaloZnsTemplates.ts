import type { ApiResponseType } from '@/shared/services/http';
import { httpSupabaseService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const mutateSyncZaloZnsTemplates = async (): Promise<
  ApiResponseType<unknown>
> => await httpSupabaseService.post('/syncZaloZnsTemplates', {});

const useSyncZaloZnsTemplates = (
  options?: UseMutationOptions<ApiResponseType<unknown>, Error, void>
) => {
  const { mutateAsync: onSyncZaloZnsTemplates, isPending } = useMutation<
    ApiResponseType<unknown>,
    Error,
    void
  >({
    mutationFn: async () =>
      await responseWrapper(mutateSyncZaloZnsTemplates, []),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onSyncZaloZnsTemplates,
    isPending
  };
};

export default useSyncZaloZnsTemplates;

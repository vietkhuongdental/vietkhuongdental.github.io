import type { ApiResponseType } from '@/shared/services/http';
import { httpSupabaseService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export interface SendZaloZnsPayload {
  userId: string;
  phone: string;
  templateId: string; // templateNumber
  templateUuid: string; // uuid
  customerId: string;
  templateData: {
    customerName: string;
  };
}

const mutateSendZaloZns = async (
  payload: SendZaloZnsPayload
): Promise<ApiResponseType<unknown>> =>
  await httpSupabaseService.post('/sendZaloZns', payload);

const useSendZaloZns = (
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    SendZaloZnsPayload
  >
) => {
  const { mutateAsync: onSendZaloZns, isPending } = useMutation<
    ApiResponseType<unknown>,
    Error,
    SendZaloZnsPayload
  >({
    mutationFn: async (payload: SendZaloZnsPayload) =>
      await responseWrapper(mutateSendZaloZns, [payload]),
    onError: ({ message }) => {
      throw new Error(message);
    },
    ...options
  });

  return {
    onSendZaloZns,
    isPending
  };
};

export default useSendZaloZns;

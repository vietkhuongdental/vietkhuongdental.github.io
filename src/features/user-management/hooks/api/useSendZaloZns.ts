import type { ApiResponseType } from '@/shared/services/http';
import { httpSupabaseService, responseWrapper } from '@/shared/services/http';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export interface SendZaloZnsRecipient {
  phone: string;
  customerId: string;
  templateData: {
    customerName: string;
  };
}

export interface SendZaloZnsBatchPayload {
  channelId: string;
  templateId: string; // templateNumber
  templateUuid: string; // uuid
  recipients: SendZaloZnsRecipient[];
}

const mutateSendZaloZns = async (
  payload: SendZaloZnsBatchPayload
): Promise<ApiResponseType<unknown>> =>
  await httpSupabaseService.post('/sendZaloZns', payload);

const useSendZaloZns = (
  options?: UseMutationOptions<
    ApiResponseType<unknown>,
    Error,
    SendZaloZnsBatchPayload
  >
) => {
  const { mutateAsync: onSendZaloZns, isPending } = useMutation<
    ApiResponseType<unknown>,
    Error,
    SendZaloZnsBatchPayload
  >({
    mutationFn: async (payload: SendZaloZnsBatchPayload) =>
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

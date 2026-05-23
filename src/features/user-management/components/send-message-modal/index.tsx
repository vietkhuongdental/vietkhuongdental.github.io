import { RoleType } from '@/constants';
import { useGetZnsTemplates } from '@/features/user-management/hooks/api/useGetZnsTemplates';
import useSendZaloZns from '@/features/user-management/hooks/api/useSendZaloZns';
import useSyncZaloZnsTemplates from '@/features/user-management/hooks/api/useSyncZaloZnsTemplates';
import type { UserResponse } from '@/features/user-management/interface';
import type { PicklistOption } from '@/shared/components/blocks/Picklist';
import { Picklist } from '@/shared/components/blocks/Picklist';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useModalProvider } from '@/shared/hooks';
import { configs } from '@/shared/services/http/configs';
import { supabaseClient } from '@/shared/services/supabase/client';
import { isEmpty } from 'lodash-es';
import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';

type ActiveTab = 'not-sent' | 'sent';

type SendStatus = 'error' | 'idle' | 'sending' | 'success';

interface Props {
  selectedUsers: UserResponse[];
  onDoneSendMessages?: () => void;
}

// How long to wait for the axios interceptor to complete the /authRefresh call
// before retrying the failed request.
const TOKEN_REFRESH_WAIT_MS = 5_000;

// Number of recipients packed into a single Edge Function call.
const BATCH_SIZE = 50;

// Maximum time (ms) to wait for all Realtime status events after the last batch fires.
const REALTIME_TIMEOUT_MS = 5 * 60 * 1_000; // 5 minutes

/**
 * Returns true when the error is a 401 Unauthorized, regardless of whether
 * axios surfaces it as a structured AxiosError or as a serialised JSON string
 * in `error.message` (common when the error is re-thrown from a hook).
 */
const isUnauthorizedError = (err: unknown): boolean => {
  if (!err || typeof err !== 'object') return false;

  // Standard AxiosError shape: err.response.status
  if (
    'response' in err &&
    (err as { response?: { status?: number } }).response?.status === 401
  ) {
    return true;
  }

  // Serialised JSON error shape: JSON.parse(err.message).status / .statusCode
  try {
    const parsed = JSON.parse((err as Error).message) as {
      status?: number;
      statusCode?: number;
    };
    return parsed?.status === 401 || parsed?.statusCode === 401;
  } catch {
    return false;
  }
};

export default function SendMessageModal({
  selectedUsers,
  onDoneSendMessages
}: Props) {
  const { onCloseModal } = useModalProvider();
  const { onSendZaloZns } = useSendZaloZns();
  const {
    templates,
    isFetching: isFetchingTemplates,
    handleInvalidateTemplates
  } = useGetZnsTemplates();
  const { onSyncZaloZnsTemplates, isPending: isSyncing } =
    useSyncZaloZnsTemplates();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, SendStatus>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>('not-sent');
  const [showResendConfirm, setShowResendConfirm] = useState(false);

  // Tracks pending Realtime channel cleanup between renders
  const realtimeChannelRef = useRef<ReturnType<
    typeof supabaseClient.channel
  > | null>(null);

  const templateId = templates?.find(
    (t) => t.key === selectedTemplateId
  )?.templateId;

  const notSentUsers = selectedUsers.filter(
    (u) => !templateId || !u.sentTemplateIds?.includes(templateId)
  );
  const sentUsers = selectedUsers.filter(
    (u) => !!templateId && u.sentTemplateIds?.includes(templateId)
  );
  const tabUsers = activeTab === 'not-sent' ? notSentUsers : sentUsers;

  const templateOptions = !isEmpty(templates)
    ? templates?.map((t) => ({
        value: t.key, // uuid
        label: t.label
      }))
    : ([] as PicklistOption[]);

  const handleSync = async () => {
    await onSyncZaloZnsTemplates();
    await handleInvalidateTemplates();
  };

  /**
   * Calls onSendZaloZns and, on a first 401, pauses for TOKEN_REFRESH_WAIT_MS
   * so the axios interceptor can complete the /authRefresh flow and store the
   * new token, then retries the same request exactly once.
   * Any other error (or a 401 on the retry) is re-thrown to the caller.
   */
  const sendWithTokenRefreshRetry = async (
    payload: Parameters<typeof onSendZaloZns>[0],
    attempt = 0
  ): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(
      `[ZNS] → HTTP sendZaloZns (attempt=${attempt})`,
      `channel=${payload.channelId}`,
      `recipients=${payload.recipients.length}`,
      payload.recipients.map((r) => r.phone)
    );

    try {
      const res = await onSendZaloZns(payload);

      // eslint-disable-next-line no-console
      console.log(`[ZNS] ← HTTP 202 accepted`, res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[ZNS] ← HTTP error (attempt=${attempt})`, err);

      if (isUnauthorizedError(err) && attempt === 0) {
        // Yield the event-loop long enough for the interceptor to finish
        // calling /authRefresh and patching the stored access token.
        await new Promise<void>((resolve) =>
          setTimeout(resolve, TOKEN_REFRESH_WAIT_MS)
        );
        return sendWithTokenRefreshRetry(payload, 1);
      }

      throw err;
    }
  };

  /** Normalise a Vietnamese phone number to the 84xxxxxxxxx format. */
  const normalizePhone = (rawPhone: string): string => {
    const trimmedPhone = rawPhone.trim().replace(/\s+/g, '');
    if (trimmedPhone.startsWith('+84') && trimmedPhone.length > 11)
      return `84${trimmedPhone.slice(3, 12)}`;
    if (trimmedPhone.startsWith('84') && trimmedPhone.length > 10)
      return `84${trimmedPhone.slice(2, 11)}`;
    if (trimmedPhone.startsWith('0')) return `84${trimmedPhone.slice(1, 10)}`;
    return `84${trimmedPhone.slice(0, 9)}`;
  };

  const handleSend = async (usersToSends = notSentUsers) => {
    if (!selectedTemplateId) return;

    setIsSending(true);

    // Mark every recipient as 'sending' immediately
    setStatusMap((prev) => {
      const next = { ...prev };
      for (const u of usersToSends) next[u.id ?? ''] = 'sending';
      return next;
    });

    const resolvedTemplateId =
      templates?.find((t) => t.key === selectedTemplateId)?.templateId ?? '';

    // ── 1. Open a Supabase Realtime channel ──────────────────────────────────
    const channelId = `zalo-zns-${Date.now()}`;
    const channel = supabaseClient.channel(channelId);
    realtimeChannelRef.current = channel;

    let receivedCount = 0;
    const totalCount = usersToSends.length;

    // (1): declare batchGate with pending = new Set()
    // Mutable references updated before each batch fires so the shared
    // broadcast handler knows which batch is currently in-flight.
    // Using an object avoids the no-loop-func lint issue (property mutation
    // vs. variable reassignment in a loop closure).
    const batchGate: { pending: Set<string>; resolve: (() => void) | null } = {
      pending: new Set(),
      resolve: null
    };

    channel.on(
      'broadcast',
      { event: 'zalo-status' },
      ({
        payload
      }: {
        payload: { customerId: string; error?: string; status: string };
      }) => {
        // eslint-disable-next-line no-console
        console.log(
          `[ZNS] broadcast zalo-status received`,
          `customerId=${payload.customerId}`,
          `status=${payload.status}`,
          `receivedCount=${receivedCount + 1}/${totalCount}`,
          payload.error ? `error=${payload.error}` : ''
        );

        const { customerId, status, error: errorMsg } = payload;

        // BE broadcasts 'sent' for success, 'failed' for failure
        if (status === 'sent') {
          setStatusMap((prev) => ({ ...prev, [customerId]: 'success' }));
        } else {
          setStatusMap((prev) => ({ ...prev, [customerId]: 'error' }));

          if (errorMsg) {
            setErrorMap((prev) => ({ ...prev, [customerId]: errorMsg }));
          }
        }

        // (3): During sendWithTokenRefreshRetry for a batch, listening the result and update the batchGate
        // Resolve the current batch when the last pending recipient confirms
        batchGate.pending.delete(customerId);
        if (batchGate.pending.size === 0) batchGate.resolve?.();

        receivedCount += 1;
      }
    );

    // Wait until the subscription is confirmed before firing requests
    await new Promise<void>((resolve, reject) => {
      channel.subscribe((status) => {
        // eslint-disable-next-line no-console
        console.log(`[ZNS] Realtime channel=${channelId} status=${status}`);
        if (status === 'SUBSCRIBED') resolve();
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')
          reject(new Error(`Realtime subscribe failed: ${status}`));
      });
    });

    // ── 2. Split users into batches of BATCH_SIZE and fire them ──────────────
    for (let i = 0; i < usersToSends.length; i += BATCH_SIZE) {
      const batch = usersToSends.slice(i, i + BATCH_SIZE);

      const recipients = batch.map((user) => ({
        userId: user.zaloUserId,
        // phone: i < 6 ? normalizePhone(user.phone ?? '') : `${user.phone}123`,
        phone: normalizePhone(user.phone ?? ''),
        customerId: user.id ?? '',
        templateData: { customerName: user.fullName }
      }));
      // (2): During Loop through batches and push each userId in the batch[i] into batchGate
      // Set up the per-batch gate before firing so the broadcast handler can
      // resolve it as soon as the last recipient in this batch is confirmed.
      batchGate.pending = new Set(batch.map((u) => u.id ?? ''));
      const batchDonePromise = new Promise<void>((res) => {
        batchGate.resolve = res;
      });

      try {
        await sendWithTokenRefreshRetry({
          channelId,
          templateId: resolvedTemplateId,
          templateUuid: selectedTemplateId,
          recipients
        });
      } catch (err) {
        // Entire batch call failed — mark all recipients in this batch as error
        // and resolve the batch gate immediately (no broadcast will arrive).
        let reason = 'Unknown error';

        try {
          const parsed = JSON.parse((err as Error).message);
          reason = parsed?.error ?? parsed?.message ?? reason;
        } catch {
          reason = (err as Error).message ?? reason;
        }

        for (const user of batch) {
          const uid = user.id ?? '';
          setStatusMap((prev) => ({ ...prev, [uid]: 'error' }));
          setErrorMap((prev) => ({ ...prev, [uid]: reason }));
          receivedCount += 1;
        }

        // (4-error): During sending to batch[i] but catched error, clear the batchGate so that be ready for next batch
        batchGate.pending.clear();
        batchGate.resolve?.();
      }

      // (4-success): After sending batch[i], mark done batchGate for resolve the result and ready for next batch's batchGate
      // Wait for every recipient in this batch to be confirmed before the
      // next batch fires (with a per-batch safety timeout).
      await Promise.race([
        batchDonePromise,
        new Promise<void>((res) => setTimeout(res, REALTIME_TIMEOUT_MS))
      ]);
    }

    await supabaseClient.removeChannel(channel);
    realtimeChannelRef.current = null;

    onDoneSendMessages?.();
    setIsSending(false);
  };

  return (
    <div className="flex w-[520px] flex-col">
      {/* Resend confirmation overlay */}
      {showResendConfirm ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black/40">
          <div className="flex w-80 flex-col gap-4 rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Send again?</span>
            </div>
            <p className="text-text-secondary text-sm">
              {sentUsers.length} recipient{sentUsers.length !== 1 ? 's' : ''}{' '}
              have already received this template. Do you want to send it to
              them again?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowResendConfirm(false)}
                size="md"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowResendConfirm(false);
                  void handleSend(sentUsers);
                }}
                size="md"
                type="button"
              >
                Send again
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-row items-center gap-2">
          <div className="flex-1">
            <Picklist
              onSetValue={(val) => {
                setSelectedTemplateId(val);
                setActiveTab('not-sent');
              }}
              isDisabled={isSending || isFetchingTemplates}
              isLoading={isFetchingTemplates}
              options={templateOptions}
              placeholder="Select a template"
              value={selectedTemplateId}
            />
          </div>
          <Button
            disabled={isSending || isSyncing}
            onClick={() => void handleSync()}
            size="md"
            type="button"
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'not-sent'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('not-sent')}
            type="button"
          >
            Not sent ({notSentUsers.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'sent'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('sent')}
            type="button"
          >
            Sent ({sentUsers.length})
          </button>
        </div>

        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
          {tabUsers.length === 0 ? (
            <p className="text-text-secondary py-4 text-center text-sm">
              No recipients in this tab.
            </p>
          ) : (
            tabUsers.map((user) => {
              const key = user.id ?? '';
              const status = statusMap[key] ?? 'idle';
              const errorReason = errorMap[key];

              return (
                <div
                  className="flex flex-row items-center gap-3 rounded-xl border px-4 py-3"
                  key={key}
                >
                  <img
                    src={
                      user.role === RoleType.EXPERT
                        ? user.profilePicture || '/anonymous-avatar.png'
                        : '/anonymous-avatar.png'
                    }
                    alt="User Avatar"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <a
                      className="text-md font-semibold text-text-info"
                      href={`https://oa.zalo.me/chat?uid=${user.zaloUserId}&oaid=${configs.ZALO_OAID}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {user.fullName}
                    </a>
                    <span className="text-text-secondary text-sm">
                      {user.phone ? ` ${user.phone}` : ''}
                    </span>
                  </div>
                  <div className="ml-auto flex h-5 w-5 items-center justify-center">
                    {status === 'sending' && <Spinner scale="sm" />}
                    {status === 'success' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {status === 'error' && (
                      <div className="group relative flex items-center justify-center">
                        <XCircle className="h-5 w-5 cursor-pointer text-red-500" />
                        {!!errorReason && (
                          <div className="pointer-events-none absolute right-full top-1/2 z-50 mr-2 hidden w-max max-w-[200px] -translate-y-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                            {errorReason}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-3 border-t px-6 py-4">
        <Button
          disabled={isSending}
          onClick={onCloseModal}
          size="lg"
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (activeTab === 'sent') {
              setShowResendConfirm(true);
            } else {
              void handleSend(notSentUsers);
            }
          }}
          disabled={isSending || !selectedTemplateId || tabUsers.length === 0}
          size="lg"
          type="button"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

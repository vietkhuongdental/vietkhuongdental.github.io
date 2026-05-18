import { RoleType, RoleTypeMap } from '@/constants';
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
import { isEmpty } from 'lodash-es';
import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { useState } from 'react';

type ActiveTab = 'not-sent' | 'sent';

type SendStatus = 'error' | 'idle' | 'sending' | 'success';

interface Props {
  selectedUsers: UserResponse[];
}

// How long to wait for the axios interceptor to complete the /authRefresh call
// before retrying the failed request.
const TOKEN_REFRESH_WAIT_MS = 5_000;

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

export default function SendMessageModal({ selectedUsers }: Props) {
  const { onCloseModal } = useModalProvider();
  const { onSendZaloZns } = useSendZaloZns({
    onError: (error) => {
      console.log('error :>> ', error);
    }
  });
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
    try {
      await onSendZaloZns(payload);
    } catch (err) {
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

  const handleSend = async (usersToSend = notSentUsers) => {
    if (!selectedTemplateId) return;

    setIsSending(true);

    for (const user of usersToSend) {
      const userId = user.id ?? '';
      setStatusMap((prev) => ({ ...prev, [userId]: 'sending' }));

      const rawPhone = user.phone ?? '';
      let normalizedPhone: string;

      if (rawPhone.startsWith('+84')) {
        normalizedPhone = `84${rawPhone.slice(3, 12)}`;
      } else if (rawPhone.startsWith('84')) {
        normalizedPhone = `84${rawPhone.slice(2, 11)}`;
      } else if (rawPhone.startsWith('0')) {
        normalizedPhone = `84${rawPhone.slice(1, 10)}`;
      } else {
        normalizedPhone = `84${rawPhone.slice(0, 9)}`;
      }

      try {
        await sendWithTokenRefreshRetry({
          userId: user.zaloUserId,
          phone: normalizedPhone,
          templateId:
            templates?.find((t) => t.key === selectedTemplateId)?.templateId ??
            '', // uuid
          templateUuid: selectedTemplateId,
          customerId: user.id ?? '',
          templateData: { customerName: user.fullName }
        });
        setStatusMap((prev) => ({ ...prev, [userId]: 'success' }));
      } catch (err) {
        setStatusMap((prev) => ({ ...prev, [userId]: 'error' }));
        let reason = 'Unknown error';

        try {
          const parsed = JSON.parse((err as Error).message);
          reason = parsed?.error ?? parsed?.message ?? reason;
        } catch {
          reason = (err as Error).message ?? reason;
        }

        setErrorMap((prev) => ({ ...prev, [userId]: reason }));
      }
    }

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
                      {user.role
                        ? RoleTypeMap[user.role]
                        : RoleTypeMap[RoleType.PATIENT]}
                      {user.zaloName ? ` · ${user.zaloName}` : ''}
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

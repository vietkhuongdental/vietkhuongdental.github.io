import RequestDeleteSentModal from '@/features/account/components/request-delete-sent-modal';
import useDeleteAccount from '@/features/account/hooks/useDeleteAccount';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider, useToastProvider } from '@/shared/hooks';
import { useCallback } from 'react';

export default function DeleteAccountModal() {
  const { onShowModal, onCloseModal } = useModalProvider();
  const { showToast } = useToastProvider();

  const { onDeleteAccount } = useDeleteAccount({
    onSuccess: () => {
      onCloseModal();
      onShowModal({
        title: 'Request to delete account sent',
        children: <RequestDeleteSentModal />,
        hideButton: true,
        hideCloseIcon: true
      });
    },
    onError: () => {
      showToast({
        title: 'Cannot Request Delete Account',
        variant: 'error'
      });
    }
  });

  const handleClickCancel = useCallback(async () => {
    await onCloseModal();
  }, []);

  const handleClickConfirm = useCallback(async () => {
    onDeleteAccount();
  }, []);

  return (
    <div className="h-fit max-w-[800px] flex-1 overflow-auto xl:w-[800px]">
      <form className="flex h-fit flex-col">
        <div className="flex h-[calc(100%-81px)] flex-col gap-[10px] p-6 text-text-default">
          <span className="text-md font-semibold">
            The request will take 14 days to process. Within 14 days:
          </span>
          <span className="text-sm font-normal">
            • If you don't sign in to Genorare, all your data includes: your
            account information, health records and connections, will be removed
            permanently. You can't access your account once it is deleted.
          </span>
          <span className="text-sm font-normal">
            • If you sign back in to Genorare and choose “Cancel delete
            request”, the request will be cancelled.
          </span>
        </div>

        <div className="flex justify-between gap-3 border-t px-6 py-4">
          <Button onClick={handleClickCancel} size="lg" variant="outline">
            No, keep my account
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleClickConfirm();
            }}
            size="lg"
            variant="danger"
          >
            Yes, request delete
          </Button>
        </div>
      </form>
    </div>
  );
}

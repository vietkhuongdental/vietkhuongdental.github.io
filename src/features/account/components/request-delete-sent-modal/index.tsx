import { Button } from '@/shared/components/ui/Button';
import { useModalProvider } from '@/shared/hooks';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export default function RequestDeleteSentModal() {
  const { onCloseAllModals } = useModalProvider();
  const { authStore } = useAuthStore();
  return (
    <div className="h-fit max-w-[800px] flex-1 overflow-auto xl:w-[800px]">
      <form className="flex h-fit flex-col">
        <div className="flex h-[calc(100%-81px)] flex-col gap-[10px] p-6 text-text-default">
          <span className="text-md font-normal">
            Your request has been sent. You'll be signed out of Genorare.
          </span>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onCloseAllModals();
              authStore.logout();
            }}
            size="lg"
            variant="primary"
          >
            Got it
          </Button>
        </div>
      </form>
    </div>
  );
}

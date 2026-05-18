import { Button } from '@/shared/components/ui/Button';
import { useCallback } from 'react';

interface Props {
  onClickConfirm: () => Promise<void>;
  onClickCancel: () => Promise<void>;
}

export default function CloseMatchingModal({
  onClickConfirm,
  onClickCancel
}: Props) {
  const handleClickConfirm = useCallback(async () => {
    await onClickConfirm();
  }, []);
  const handleClickCancel = useCallback(async () => {
    await onClickCancel();
  }, []);

  return (
    <div className="h-fit w-screen max-w-[800px] flex-1 overflow-auto xl:w-[800px]">
      <form className="flex h-fit flex-col">
        <div className="flex h-[calc(100%-81px)] flex-col gap-5 overflow-auto p-6">
          <p className="text-md font-normal">
            This health record will be closed for matching. It will not be
            visible and searchable on Patient Directory.&nbsp;
            <strong>Only connected experts can view it.</strong>
          </p>
        </div>

        <div className="flex justify-between gap-3 border-t px-6 py-4">
          <Button onClick={handleClickCancel} size="lg" variant="outline">
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleClickConfirm();
            }}
            size="lg"
            variant="primary"
          >
            Close for matching
          </Button>
        </div>
      </form>
    </div>
  );
}

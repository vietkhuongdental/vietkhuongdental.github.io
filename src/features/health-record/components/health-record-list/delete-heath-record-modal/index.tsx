import useDeleteHealthRecord from '@/features/health-record/hooks/api/useDeleteHealthRecord';
import useGetHealthRecords from '@/features/health-record/hooks/api/useGetHealthRecords';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider, useToastProvider } from '@/shared/hooks';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: string;
  name: string;
}

export default function DeleteHealthRecordModal({ id, name }: Props) {
  const { onCloseAllModals } = useModalProvider();
  const { handleInvalidateHealthRecords } = useGetHealthRecords();
  const { showToast } = useToastProvider();
  const navigate = useNavigate();

  const { onDeleteHealthRecord, isPending } = useDeleteHealthRecord(
    { id },
    {
      onSuccess: async () => {
        await handleInvalidateHealthRecords();
        showToast({
          variant: 'success',
          title: 'Deleted health record!'
        });
        navigate('/health-record');
        onCloseAllModals();
      }
    }
  );
  return (
    <div className="w-screen xl:w-[700px]">
      <div className="flex flex-col gap-[10px] p-6 text-text-default">
        <span className="text-md">{`Deleting this health record will also delete all connections of this health record. If it's published to Patient Directory, it'll also be removed.`}</span>
        <span className="text-md">{`Are you sure you want to delete "${name}"?`}</span>
      </div>
      <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
        <Button
          className="hidden md:block"
          onClick={onCloseAllModals}
          size="lg"
          variant="outline"
        >
          No
        </Button>
        <Button
          isDisabled={isPending}
          onClick={() => onDeleteHealthRecord()}
          size="lg"
          type="submit"
          variant="primary"
        >
          Yes, Delete health record
        </Button>
      </div>
    </div>
  );
}

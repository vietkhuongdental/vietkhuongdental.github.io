import BasicInformation from '@/features/health-record/components/create-edit-health-record/basic-information';
import useCreateHealthRecord from '@/features/health-record/hooks/api/useCreateHealthRecord';
import useGetHealthRecordById from '@/features/health-record/hooks/api/useGetHealthRecordById';
import useGetHealthRecords from '@/features/health-record/hooks/api/useGetHealthRecords';
import useUpdateHealthRecord from '@/features/health-record/hooks/api/useUpdateHealthRecord';
import type { HealthRecord } from '@/features/health-record/interface';
import { useModalProvider, useToastProvider } from '@/shared/hooks';

interface Props {
  isEdit?: boolean;
  initData?: HealthRecord;
}

const CreateEditHealthRecord = ({ isEdit = false, initData }: Props) => {
  const { onCloseAllModals } = useModalProvider();
  const { showToast } = useToastProvider();

  const { handleInvalidateHealthRecords } = useGetHealthRecords();
  const { handleInvalidateHealthRecordById } = useGetHealthRecordById({
    id: initData?.id
  });

  const { onCreateHealthRecord, isPending: isCreatingHealthRecord } =
    useCreateHealthRecord({
      onSuccess: async () => {
        await handleInvalidateHealthRecords();
        await onCloseAllModals();
      },
      onError: async () => {
        showToast({
          variant: 'error',
          title: 'Create health record unsuccessfully!',
          description: 'Please check again your submit data.'
        });
      }
    });
  const { onUpdateHealthRecord, isPending: isUpdatingHealthRecord } =
    useUpdateHealthRecord({
      onSuccess: async () => {
        await handleInvalidateHealthRecords();

        if (initData?.id) {
          await handleInvalidateHealthRecordById({ id: initData?.id });
        }

        await onCloseAllModals();
      }
    });

  const handleCreateEditHealthRecord = async (data: HealthRecord) => {
    if (!isEdit) {
      onCreateHealthRecord(data);
    } else {
      if (!initData?.id) return;
      onUpdateHealthRecord({ ...data, id: initData.id });
    }
  };

  return (
    <div className="h-fit w-screen flex-1 overflow-auto xl:w-[1000px]">
      <BasicInformation
        initData={initData}
        isEdit={isEdit}
        isPending={isCreatingHealthRecord || isUpdatingHealthRecord}
        setPayloadBasic={handleCreateEditHealthRecord}
      />
    </div>
  );
};

export default CreateEditHealthRecord;

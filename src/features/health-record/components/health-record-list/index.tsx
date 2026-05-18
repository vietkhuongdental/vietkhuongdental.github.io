/* eslint-disable import/no-unresolved */
import { VerifyProfileStatus } from '@/constants';
import CreateEditVerifyAsPatientModal from '@/features/account/components/verify-as-patient-modal';
import useGetMyProfile from '@/features/account/hooks/useGetMyProfile';
import type { UserProfile } from '@/features/account/interface';
import CreateEditHealthRecord from '@/features/health-record/components/create-edit-health-record';
import EmptyRecord from '@/features/health-record/components/health-record-list/empty-record';
import HealthRecordCard from '@/features/health-record/components/health-record-list/health-record-card';
import LimitCreationModal from '@/features/health-record/components/limit-creation-modal';
import useGetHealthRecords from '@/features/health-record/hooks/api/useGetHealthRecords';
import type { HealthRecord } from '@/features/health-record/interface';
import { Button } from '@/shared/components/ui/Button';
import { useModalProvider } from '@/shared/hooks';
import { Check, Plus } from 'lucide-react';
import { useCallback } from 'react';

export default function HealthRecordList() {
  const { healthRecords, isFetching } = useGetHealthRecords();

  const { onShowModal, onCloseModal } = useModalProvider();
  const { myProfile } = useGetMyProfile();

  const handleClickCreate = useCallback(() => {
    if (
      myProfile?.profile?.status === VerifyProfileStatus.Verified ||
      healthRecords?.length === 0
    ) {
      return onShowModal({
        title: 'Create Health Record',
        children: <CreateEditHealthRecord />,
        hideButton: true
      });
    }

    onShowModal({
      title: 'Verify as a patient to create more health record',
      children: <LimitCreationModal type="health-record" />,
      hideButton: true
    });
  }, [healthRecords, myProfile]);

  const handleClickVerify = (isEdit?: boolean) => {
    onShowModal({
      title: 'Verify as patient',
      children: (
        <CreateEditVerifyAsPatientModal
          onClickCancel={async () => {
            onCloseModal();
          }}
          initData={isEdit ? (myProfile?.profile as UserProfile) : undefined}
        />
      ),
      hideButton: true
    });
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex w-full flex-col items-center justify-between gap-2 md:flex-row">
        <h5>Health Record</h5>
        {!isFetching && healthRecords?.length !== 0 && (
          <Button leadingIcon={<Plus />} onClick={handleClickCreate} size="lg">
            Create health record
          </Button>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        {myProfile?.profile?.status === VerifyProfileStatus.Unverified && (
          <div
            className="relative h-fit overflow-hidden rounded-lg border bg-cover bg-center bg-no-repeat px-5 py-3 text-white"
            style={{ backgroundImage: "url('/verify-expert-banner.png')" }}
          >
            {/* Close button */}
            <div className="flex flex-col items-start gap-2">
              {/* Left content */}
              <span className="text-md font-medium">
                Verify as a patient to get more out of Genorare
              </span>

              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 text-white" />
                <span className="text-sm">
                  Create up to 2 more health records for family members
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 text-white" />
                <span className="text-sm">
                  Have <span className="font-semibold">unlimited</span> use of
                  Genorare analysis for this health record
                </span>
              </div>

              <Button
                className="border border-white bg-transparent text-white hover:bg-white hover:text-indigo-900"
                onClick={() => handleClickVerify()}
                size="sm"
                variant="outline"
              >
                Verify as a patient
              </Button>
            </div>
          </div>
        )}
        {isFetching ||
          !healthRecords ||
          (healthRecords?.length === 0 && (
            <EmptyRecord onClickCreate={handleClickCreate} />
          ))}
        {healthRecords.map((record: HealthRecord) => (
          <HealthRecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}

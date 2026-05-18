import { LocationIcon } from '@/assets/icons/location-icon';
import MajorIndustryIcon from '@/assets/icons/major-industry-icon';
import {
  AccountStatus,
  VerifyProfileStatus,
  VerifyProfileStatusMap
} from '@/constants';
import AcceptModal from '@/features/user-detail/components/accept-modal';
import RejectModal from '@/features/user-detail/components/reject-modal';
import useGetAccountById from '@/features/user-detail/hooks/useGetAccountById';
import usePatchVerifyExpert from '@/features/user-detail/hooks/usePatchVerifyExpert';
import type { UserProfileExpert } from '@/features/user-detail/interface';
import { Button } from '@/shared/components/ui/Button';
import Col from '@/shared/components/ui/Col';
import Row from '@/shared/components/ui/Row';
import { Tag } from '@/shared/components/ui/Tag';
import { getStatusColor } from '@/shared/components/ui/Tag/helper';
import { useModalProvider } from '@/shared/hooks';
import { formattedDate } from '@/shared/libs/utils';
import { CalendarIcon, MessageSquareMoreIcon } from 'lucide-react';

interface Props {
  accountStatus?: AccountStatus;
  userProfile: UserProfileExpert;
}

export default function VerificationExpertCard({
  accountStatus,
  userProfile
}: Props) {
  const { onShowModal, onCloseModal } = useModalProvider();
  const { handleInvalidateUserAccount } = useGetAccountById({
    id: userProfile.accountID
  });

  const { onUpdateVerifyExpert } = usePatchVerifyExpert(
    { id: userProfile?.accountID },
    {
      onSuccess: async () => {
        await handleInvalidateUserAccount();
        onCloseModal();
      }
    }
  );

  const handleVerify = (payload: {
    comment?: string;
    status: VerifyProfileStatus;
  }) => {
    onUpdateVerifyExpert({ status: payload.status, comment: payload.comment });
  };

  const handleClickAcceptReject = (status: VerifyProfileStatus) => {
    if (status === VerifyProfileStatus.Reject) {
      return onShowModal({
        title: 'Reject',
        children: (
          <RejectModal onCancel={onCloseModal} onConfirm={handleVerify} />
        ),
        hideButton: true
      });
    }

    return onShowModal({
      title: 'Accept',
      children: <AcceptModal />,
      hideButton: false,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      onConfirm: () => handleVerify({ status: VerifyProfileStatus.Verified })
    });
  };

  return (
    <div className="relative w-full rounded-2xl bg-background-default">
      {accountStatus && accountStatus === AccountStatus.Deleted ? (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-white opacity-50" />
      ) : null}
      <div className="flex flex-col gap-1">
        <div className="flex w-full flex-row justify-between border-b px-6 py-4">
          <div className="flex w-fit flex-col justify-start gap-2">
            <span className="text-lg font-bold text-text-default">
              Verification
            </span>
          </div>
          {userProfile.status ? (
            <Tag
              color={getStatusColor(userProfile.status)}
              label={VerifyProfileStatusMap[userProfile.status]}
              size="sm"
              variant="filled"
            />
          ) : null}
        </div>
        {userProfile.status === VerifyProfileStatus.Reject ? (
          <div className="mx-5 mt-3 flex flex-col gap-1 rounded-lg border border-border-error px-5 py-3">
            <div className="flex flex-row gap-2">
              <MessageSquareMoreIcon className="h-6 w-6" />
              <span className="text-md font-semibold">Admin comment</span>
            </div>
            <p className="text-sm font-normal">
              {userProfile.verifyComment || ''}
            </p>{' '}
          </div>
        ) : null}
        {userProfile?.status === VerifyProfileStatus.Unverified ? (
          <div className="flex h-fit w-full flex-col items-center justify-center gap-3 p-6">
            <img
              alt="empty"
              className="w-[125px] object-cover"
              src="/empty-verification.png"
            />
            <div className="flex max-w-[447px] flex-col items-center justify-center gap-3">
              <p className="whitespace-wrap text-center text-md font-normal text-text-description">
                The user hasn't submitted the verification form
              </p>
            </div>
          </div>
        ) : (
          <Row classes="p-6">
            <Col span={4}>
              <div className="flex flex-row items-center gap-3">
                <div className="flex aspect-square w-8 items-center justify-center">
                  <MajorIndustryIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-normal text-text-subtle">
                    Medical license number
                  </span>
                  <span className="text-sm font-normal text-text-default">
                    {userProfile.medicalLicense || 'Not available'}
                  </span>
                </div>
              </div>
            </Col>

            <Col span={4}>
              <div className="flex flex-row items-center gap-3">
                <div className="flex aspect-square w-8 items-center justify-center">
                  <LocationIcon className="rounded-md bg-[#F8F8F7]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-normal text-text-subtle">
                    Country of Issue
                  </span>
                  <span className="text-sm font-normal text-text-default">
                    {userProfile.countryOfIssue || 'Not available'}
                  </span>
                </div>
              </div>
            </Col>

            <Col span={4}>
              <div className="flex flex-row items-center gap-3">
                <div className="flex aspect-square w-8 items-center justify-center">
                  <CalendarIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-normal text-text-subtle">
                    Date of Issue
                  </span>
                  <span className="text-sm font-normal text-text-default">
                    {userProfile.dateOfIssue
                      ? formattedDate(userProfile.dateOfIssue?.toString())
                      : 'Not available'}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        )}
        {userProfile.status === VerifyProfileStatus.WaitingForApproval && (
          <div className="flex flex-row justify-end gap-3 border-t px-6 py-4">
            <Button
              onClick={() =>
                handleClickAcceptReject(VerifyProfileStatus.Reject)
              }
              isDisabled={accountStatus === AccountStatus.Deleted}
              size="lg"
              variant="danger"
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                handleClickAcceptReject(VerifyProfileStatus.Verified);
              }}
              isDisabled={accountStatus === AccountStatus.Deleted}
              size="lg"
              variant="secondary"
            >
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { ImgIcon } from '@/assets/icons/img-icon';
import { PdfIcon } from '@/assets/icons/pdf-icon';
import {
  AccountStatus,
  VerifyProfileStatus,
  VerifyProfileStatusMap
} from '@/constants';
import AcceptModal from '@/features/user-detail/components/accept-modal';
import RejectModal from '@/features/user-detail/components/reject-modal';
import useGetAccountById from '@/features/user-detail/hooks/useGetAccountById';
import usePatchVerifyPatient from '@/features/user-detail/hooks/usePatchVerifyPatient';
import type { UserProfilePatient } from '@/features/user-detail/interface';
import { FilePreview } from '@/shared/components/blocks/FilePreview';
import { Button } from '@/shared/components/ui/Button';
import { Tag } from '@/shared/components/ui/Tag';
import { getStatusColor } from '@/shared/components/ui/Tag/helper';
import { useModalProvider } from '@/shared/hooks';
import { usePostRequestDownloadData } from '@/shared/hooks/usePostRequestDownloadData';
import { handleFetchingFile } from '@/shared/libs/utils';
import { isEmpty } from 'lodash-es';
import { MessageSquareMoreIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  accountStatus?: AccountStatus;
  userProfile: UserProfilePatient;
}

export default function VerificationPatientCard({
  accountStatus,
  userProfile
}: Props) {
  const { onShowModal, onCloseModal } = useModalProvider();
  const { handleInvalidateUserAccount } = useGetAccountById({
    id: userProfile.account_id
  });

  const { onRequestDownloadData } = usePostRequestDownloadData();

  const [openFileView, setOpenFileView] = useState<{
    fileType?: string;
    title: string;
    url: string;
  }>();

  const handleOpenFile = (fileName: string, fileType?: string, blob?: Blob) => {
    if (!blob) return;
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const { result } = e.target as FileReader;

      if (result) {
        setOpenFileView({
          url: result as string,
          title: fileName.slice(-20),
          fileType
        });
      }
    };

    fileReader.readAsDataURL(blob);
  };

  const handleClickFile = async (
    fileName: string,
    fileKey: string,
    fileType?: string
  ) => {
    if (
      !userProfile.metadata?.documents ||
      userProfile.metadata?.documents?.length === 0
    ) {
      return;
    }

    setOpenFileView({ fileType, url: '', title: fileName });

    const isMounted = true;
    onRequestDownloadData({
      fileKey
    }).then(async (response) => {
      if (isMounted) {
        const blob = await handleFetchingFile({
          presignedUrl: response.data.url
        });
        handleOpenFile(response.data.fileName, fileType, blob);
      }
    });
  };

  const { onUpdateVerifyPatient } = usePatchVerifyPatient(
    { id: userProfile?.account_id },
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
    onUpdateVerifyPatient({ status: payload.status, comment: payload.comment });
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
    <div className="relative h-fit rounded-lg bg-background-default shadow-sm">
      {accountStatus && accountStatus === AccountStatus.Deleted ? (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-white opacity-50" />
      ) : null}
      <div className="flex justify-between border-b px-6 py-2">
        <span className="flex items-center text-xl font-semibold text-text-default">
          Verification
        </span>
        <div className="flex flex-row items-center gap-2">
          {userProfile?.status ? (
            <Tag
              color={getStatusColor(userProfile?.status)}
              label={VerifyProfileStatusMap[userProfile?.status]}
              size="sm"
              variant="filled"
            />
          ) : null}
        </div>
      </div>
      {userProfile.status === VerifyProfileStatus.Reject ? (
        <div className="mx-5 mt-3 flex flex-col gap-1 rounded-lg border border-border-error px-5 py-3">
          <div className="flex flex-row gap-2">
            <MessageSquareMoreIcon className="h-6 w-6" />
            <span className="text-md font-semibold">Admin comment</span>
          </div>
          <p className="text-sm font-normal">
            {userProfile.metadata?.verifyComment || ''}
          </p>
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
        <div className="flex flex-col gap-3 px-6 py-3">
          <div className="flex flex-col">
            <span className="text-md font-semibold text-text-default">
              Diagnosed disease
            </span>
            <span className="text-sm font-normal text-text-description">
              {userProfile?.disease}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-md font-semibold text-text-default">
              Treatment hospitals/ clinics
            </span>
            <span className="text-sm font-normal text-text-description">
              {userProfile?.organization}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-md font-semibold text-text-default">
              Upload hospital documents (for verification reason only)
            </span>
            <span className="flex flex-col gap-2 text-sm font-normal text-text-description">
              {userProfile?.metadata?.documents?.map((document, index) => (
                <Button
                  leadingIcon={
                    document.fileType !== 'application/pdf' ? (
                      <ImgIcon />
                    ) : (
                      <PdfIcon />
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickFile(
                      document.fileName,
                      document.fileKey,
                      document.fileType
                    );
                  }}
                  className="flex h-fit w-full justify-start"
                  key={index}
                  type="button"
                  variant="outlineInverse"
                >
                  <div className="flex w-full flex-row gap-2">
                    <p className="flex w-fit justify-start truncate text-md text-text-default">
                      {document.fileName.slice(-20)}
                    </p>
                    <p className="flex w-fit items-center truncate text-sm text-text-disable">
                      |{' '}
                      {document.fileSize
                        ? (document.fileSize / 1000000).toFixed(2)
                        : 0}
                      &nbsp;MB
                    </p>
                  </div>
                </Button>
              ))}
            </span>
          </div>
        </div>
      )}
      {userProfile.status === VerifyProfileStatus.WaitingForApproval && (
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button
            isDisabled={accountStatus === AccountStatus.Deleted}
            onClick={() => handleClickAcceptReject(VerifyProfileStatus.Reject)}
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
      {openFileView ? (
        <FilePreview
          allowDownload={false}
          fileType={openFileView.fileType}
          isVisible={!isEmpty(openFileView)}
          onClose={() => setOpenFileView(undefined)}
          url={openFileView.url}
        />
      ) : null}
    </div>
  );
}

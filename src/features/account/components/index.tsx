import EditIcon from '@/assets/icons/edit-icon';
import { ImgIcon } from '@/assets/icons/img-icon';
import { PdfIcon } from '@/assets/icons/pdf-icon';
import { VerifyIcon } from '@/assets/icons/verify-icon';
import {
  RoleType,
  RoleTypeMap,
  VerifyProfileStatus,
  VerifyProfileStatusMap
} from '@/constants';
import ChangePasswordModal from '@/features/account/components/change-password-modal';
import DeleteAccountModal from '@/features/account/components/delete-account-modal';
import CreateEditVerifyAsPatientModal from '@/features/account/components/verify-as-patient-modal';
import useGetMyProfile from '@/features/account/hooks/useGetMyProfile';
import { FilePreview } from '@/shared/components/blocks/FilePreview';
import { Button } from '@/shared/components/ui/Button';
import Col from '@/shared/components/ui/Col';
import Row from '@/shared/components/ui/Row';
import { Tag } from '@/shared/components/ui/Tag';
import { getStatusColor } from '@/shared/components/ui/Tag/helper';
import { useModalProvider } from '@/shared/hooks';
import { usePostRequestDownloadData } from '@/shared/hooks/usePostRequestDownloadData';
import { handleFetchingFile } from '@/shared/libs/utils';
import { isEmpty } from 'lodash-es';
import { Check, MessageSquareMoreIcon, X } from 'lucide-react';
import { useState } from 'react';

export default function AccountInformation() {
  const { onShowModal, onCloseModal } = useModalProvider();

  const { myProfile, isLoading } = useGetMyProfile();
  const { onRequestDownloadData } = usePostRequestDownloadData();

  const [openFileView, setOpenFileView] = useState<{
    fileType?: string;
    title: string;
    url: string;
  }>();

  const handleOpenFile = (fileName: string, fileType: string, blob?: Blob) => {
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
    setOpenFileView({ fileType, url: '', title: fileName });

    const isMounted = true;
    onRequestDownloadData({
      fileKey
    }).then(async (response) => {
      if (isMounted) {
        const blob = await handleFetchingFile({
          presignedUrl: response.data.url
        });
        handleOpenFile(response.data.fileName, response.data.fileType, blob);
      }
    });
  };

  const handleClickVerify = (isEdit?: boolean) => {
    onShowModal({
      title: 'Verify as patient',
      children: (
        <CreateEditVerifyAsPatientModal
          onClickCancel={async () => {
            onCloseModal();
          }}
          initData={isEdit ? myProfile : undefined}
        />
      ),
      hideButton: true
    });
  };

  const handleClickEditPassword = () => {
    onShowModal({
      title: 'Change password',
      children: <ChangePasswordModal />,
      hideButton: true
    });
  };

  const handleClickDeleteAccount = () => {
    onShowModal({
      title: 'Do you want to request to delete your account permanently?',
      children: <DeleteAccountModal />,
      hideButton: true
    });
  };

  if (isLoading) return null;
  return (
    <div className="p-2">
      <div className="mb-6 items-center">
        <h5 className="mb-3">Account setting</h5>
        {myProfile?.profile?.status === VerifyProfileStatus.Unverified &&
          myProfile?.role === RoleType.PATIENT && (
            <div
              className="relative h-fit overflow-hidden rounded-lg border bg-cover bg-center bg-no-repeat px-5 py-3 text-white"
              style={{ backgroundImage: "url('/verify-expert-banner.png')" }}
            >
              {/* Close button */}
              <button
                aria-label="Close banner"
                className="absolute right-3 top-3 rounded-full transition-colors hover:bg-white/10"
                onClick={() => {}}
              >
                <X className="h-5 w-5" />
              </button>

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
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-6">
          {/* Information section */}
          <div className="h-fit rounded-lg bg-background-default shadow-sm">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <span className="text-xl font-semibold text-text-default">
                Information
              </span>
              {/* <button className="h-fit p-1 hover:bg-background-overlay-dark">
                <EditIcon />
              </button> */}
            </div>
            <Row classes="p-6">
              <Col span={4}>
                <div className="flex flex-row items-center gap-3">
                  <div className="aspect-square w-12">
                    <img
                      src={
                        myProfile?.role === RoleType.EXPERT &&
                        myProfile.profileExpert?.profilePicture
                          ? myProfile.profileExpert?.profilePicture
                          : '/anonymous-avatar.png'
                      }
                      alt="User Avatar"
                      className="h-12 w-12 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-md font-semibold text-text-default">
                      Full name
                    </span>
                    <span className="text-md font-normal text-text-description">
                      {myProfile?.role === RoleType.EXPERT
                        ? myProfile.profileExpert?.name
                        : myProfile?.profile?.name}
                    </span>
                  </div>
                </div>
              </Col>

              <Col span={4}>
                <div className="flex flex-row items-center gap-3">
                  <div className="aspect-square w-12 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="text-md font-semibold text-text-default">
                      Email
                    </span>
                    <span className="break-all text-md font-normal text-text-description">
                      {myProfile?.email}
                    </span>
                  </div>
                </div>
              </Col>

              <Col span={4}>
                <div className="flex flex-row items-center gap-3">
                  <div className="aspect-square w-12" />
                  <div className="flex flex-col gap-1">
                    <span className="text-md font-semibold text-text-default">
                      Role
                    </span>
                    <span className="flex flex-row text-md font-normal text-text-description">
                      {/* Role */}
                      {myProfile?.profile?.status !==
                      VerifyProfileStatus.Verified
                        ? RoleTypeMap[myProfile?.role]
                        : 'General user'}
                      &nbsp;
                      {/* Icon */}
                      {myProfile?.profile?.status ===
                        VerifyProfileStatus.Verified ||
                      myProfile?.profileExpert?.status ===
                        VerifyProfileStatus.Verified ? (
                        <VerifyIcon height="20" />
                      ) : null}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/* Patient Verified information section*/}
          {myProfile?.profile?.status &&
          myProfile?.profile?.status !== VerifyProfileStatus.Unverified &&
          myProfile?.role === RoleType.PATIENT ? (
            <div className="h-fit rounded-lg bg-background-default shadow-sm">
              <div className="flex justify-between border-b px-6 py-4">
                <span className="flex items-center text-xl font-semibold text-text-default">
                  Verify as a patient
                </span>
                <div className="flex flex-row items-center gap-2">
                  {myProfile?.profile?.status ? (
                    <Tag
                      color={getStatusColor(myProfile?.profile?.status)}
                      label={VerifyProfileStatusMap[myProfile?.profile?.status]}
                      size="md"
                      variant="filled"
                    />
                  ) : null}
                  {myProfile?.profile?.status === VerifyProfileStatus.Reject ? (
                    <Button
                      leadingIcon={<EditIcon />}
                      onClick={() => handleClickVerify(true)}
                      variant="outline"
                    />
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-3 p-6">
                {myProfile.profile.status === VerifyProfileStatus.Reject ? (
                  <div className="flex flex-col gap-1 rounded-lg border border-border-error px-5 py-3">
                    <div className="flex flex-row gap-2">
                      <MessageSquareMoreIcon className="h-6 w-6" />
                      <span className="text-md font-semibold">
                        Admin comment
                      </span>
                    </div>
                    <p className="text-sm font-normal">
                      {myProfile.profile.metadata?.verifyComment || ''}
                    </p>
                  </div>
                ) : null}
                <div className="flex flex-col gap-1">
                  <span className="text-md font-semibold text-text-default">
                    Diagnosed disease
                  </span>
                  <span className="text-sm font-normal text-text-description">
                    {myProfile.profile?.disease}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-md font-semibold text-text-default">
                    Treatment hospitals/ clinics
                  </span>
                  <span className="text-sm font-normal text-text-description">
                    {myProfile.profile?.organization}
                  </span>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <span className="text-md font-semibold text-text-default">
                    Upload hospital documents (for verification reason only)
                  </span>
                  <span className="flex flex-col gap-2 text-sm font-normal text-text-description">
                    {myProfile?.profile?.metadata?.documents?.map(
                      (document, index) => (
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
                              document.fileName || '',
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
                              {document.fileName?.slice(-20)}
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
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-row gap-10">
            {/* Password section */}

            <div className="h-fit w-1/2 rounded-lg bg-background-default shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <span className="text-xl font-semibold text-text-default">
                  Password
                </span>
                <Button
                  leadingIcon={<EditIcon />}
                  onClick={() => handleClickEditPassword()}
                  variant="outline"
                />
              </div>
              <div className="flex flex-row gap-3 p-6">
                <div className="flex flex-col">
                  <span className="text-xs font-normal text-text-subtle">
                    Password
                  </span>
                  <span className="text-sm font-normal text-text-default">
                    ****************
                  </span>
                </div>
              </div>
            </div>

            {/* Delete account section */}
            <div className="h-fit w-1/2 rounded-lg bg-background-default shadow-sm">
              <div className="border-b px-6 py-4">
                <span className="text-xl font-semibold text-text-default">
                  Delete account
                </span>
                <p className="font-normal text-text-description">
                  You can request to have your account and all data permanently
                  deleted.
                </p>
              </div>
              <div className="flex justify-end gap-3 p-6">
                <Button
                  onClick={handleClickDeleteAccount}
                  size="sm"
                  variant="danger"
                >
                  Request delete account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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

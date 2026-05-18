import { DiseaseIcon } from '@/assets/icons/disease-icon';
import { HealthRecordIcon } from '@/assets/icons/health-record-icon';
import { HospitalIcon } from '@/assets/icons/hospital-icon';
import useGetMyProfile from '@/features/account/hooks/useGetMyProfile';
import useUpdatePatientProfile from '@/features/account/hooks/useUpdatePatientProfile';
import type {
  UserProfile,
  VerifyPatientRequest
} from '@/features/account/interface';
import { VerifyPatientSchema } from '@/features/account/interface';
import FileUpload from '@/shared/components/blocks/FileUpload';
import { FormField } from '@/shared/components/blocks/FormField';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useModalProvider, useToastProvider } from '@/shared/hooks';
import { type FileProps, UploadStatus } from '@/shared/interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  initData?: UserProfile;
  onClickCancel: () => Promise<void>;
}

export default function CreateEditVerifyAsPatientModal({
  initData,
  onClickCancel
}: Props) {
  const { onCloseModal } = useModalProvider();
  const { showToast } = useToastProvider();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<VerifyPatientRequest>({
    mode: 'onBlur',
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    resolver: zodResolver(VerifyPatientSchema),
    defaultValues: initData
      ? {
          disease: initData?.profile?.disease,
          organization: initData?.profile?.organization,
          documents: initData?.profile?.metadata?.documents.map((document) => ({
            ...document,
            fileKey: document.fileKey
          }))
        }
      : {}
  });

  const [documentFiles, setDocumentFiles] = useState<FileProps[]>(
    initData?.profile?.metadata?.documents?.map(
      (document) =>
        ({
          fileKey: document.fileKey,
          fileName: document.fileName,
          status: UploadStatus.Success
        }) as FileProps
    ) ?? []
  );

  const { handleInvalidateMyProfile } = useGetMyProfile();
  const { onUpdatePatientProfile, isPending } = useUpdatePatientProfile({
    onSuccess: () => {
      showToast({
        variant: 'info',
        title: 'Waiting for review',
        description:
          'Verification process will take up to 48 hours.\nYou will be informed via email for result'
      });
      handleInvalidateMyProfile();
      onCloseModal();
    }
  });

  const handleSetDocumentFiles = useCallback(
    async (documentFiles: FileProps[]) => {
      setDocumentFiles(documentFiles);
    },
    []
  );

  const handleClickCancel = useCallback(async () => {
    await onClickCancel();
  }, []);

  const onSubmitForm = async (data: VerifyPatientRequest): Promise<void> => {
    onUpdatePatientProfile(data);
  };

  useEffect(() => {
    setValue(
      'documents',
      documentFiles.map((document) => ({
        fileKey: document.fileKey,
        fileType: document.fileType,
        checksum: document.checksum
      }))
    );
  }, [documentFiles]);

  return (
    <div className="h-fit w-screen max-w-[1000px] flex-1 overflow-auto xl:w-[1000px]">
      <form
        className="flex h-[calc(80vh-65px)] flex-col"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className="flex h-[calc(100%-81px)] flex-col gap-5 overflow-auto p-6">
          <FormField
            direction={errors.disease?.message}
            id="disease"
            isError={!!errors.disease}
            label="Diagnosed disease"
            required
          >
            <Input
              id="disease"
              leadingIcon={<DiseaseIcon />}
              placeholder="Diagnosed disease"
              {...register('disease')}
            />
          </FormField>
          <FormField
            direction={errors.organization?.message}
            id="organization"
            isError={!!errors.organization}
            label="Treatment hospitals/ clinics"
            required
          >
            <Input
              id="clinic"
              leadingIcon={<HospitalIcon />}
              placeholder="Treatment hospitals/ clinics"
              {...register('organization')}
            />
          </FormField>
          <FormField
            direction={errors.documents?.message}
            id="file"
            isError={!!errors.documents}
            label="Upload hospital documents (for verification reason only)"
            required
          >
            <FileUpload
              acceptFormats=".pdf, .jpeg, .jpg, .png"
              initFiles={documentFiles}
              label="Up to 3 documents (.png, .jpeg, .jpg, .pdf)"
              maxCountFiles={3}
              resultIcon={<HealthRecordIcon isFilled={true} />}
              setInitFiles={handleSetDocumentFiles}
              variant="drag-drop"
            />
          </FormField>
        </div>

        <div className="flex justify-between gap-3 border-t px-6 py-4">
          <Button onClick={handleClickCancel} size="lg" variant="outline">
            Cancel
          </Button>
          <Button
            isDisabled={
              isPending ||
              !documentFiles.every(
                (file) => file.status === UploadStatus.Success
              )
            }
            size="lg"
            type="submit"
            variant="primary"
          >
            Submit for review
          </Button>
        </div>
      </form>
    </div>
  );
}

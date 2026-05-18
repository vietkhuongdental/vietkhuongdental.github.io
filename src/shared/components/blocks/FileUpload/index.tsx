/* eslint-disable no-nested-ternary */
import { DragDropUpload } from '@/shared/components/blocks/FileUpload/DragDropUpload';
import SingleAttachmentUpload from '@/shared/components/blocks/FileUpload/SingleAttachmentUpload';
import { useToastProvider } from '@/shared/hooks';
import { useUploadFile } from '@/shared/hooks/useUploadFiles';
import type { FileProps } from '@/shared/interface';
import type { ChangeEvent } from 'react';
import { useEffect } from 'react';

interface FileUploadProps {
  fieldName?: string;
  variant: 'button-based' | 'drag-drop' | 'grid-attach' | 'single-attach';
  setInitFiles: (files: FileProps[]) => void;
  initFiles?: FileProps[];
  maxSizeMB?: number;
  maxCountFiles?: number;
  label?: string;
  isDisabled?: boolean;
  acceptFormats?: string;
  resultIcon?: React.ReactNode;
  destination?: string;
  isNeedEncrypt?: boolean;
  onSetError?: (error: string) => void;
}

const FileUpload = ({
  fieldName,
  initFiles = [],
  setInitFiles,
  maxSizeMB,
  maxCountFiles = 6,
  label = 'Attach Files',
  variant = 'button-based',
  isDisabled = false,
  // acceptFormats = '.png, .jpeg, .jpg, .gif, .csv, .pdf, .vcf, .gz, .vcf.gz',
  acceptFormats = '.png, .jpeg, .jpg, .gif, .csv, .pdf, .vcf',
  resultIcon,
  destination = 'common',
  isNeedEncrypt = false,
  onSetError
}: FileUploadProps) => {
  const { showToast } = useToastProvider();
  const { files, onSetFiles, onUploadFiles, isUploading } = useUploadFile({
    maxCountFiles,
    maxSizeMB,
    acceptFormats,
    fieldName,
    isNeedEncrypt,
    destination
  });

  useEffect(() => {
    onSetFiles(initFiles);
  }, []);

  useEffect(() => {
    setInitFiles(files);
  }, [files]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      await onUploadFiles(event);
    } catch (error) {
      // Convert error to readable string
      const message =
        error instanceof Error ? error.message : 'Something went wrong';

      if (onSetError) {
        onSetError(message);
      } else {
        showToast({
          variant: 'error',
          title: message
        });
      }
    }
  };

  return (
    <div className="w-full">
      {variant === 'drag-drop' && (
        <DragDropUpload
          acceptFormats={acceptFormats}
          files={files}
          isDisabled={isDisabled}
          isUploading={isUploading}
          label={label}
          maxSizeMB={maxSizeMB}
          onUploadFiles={handleUpload}
          resultIcon={resultIcon}
          setFiles={onSetFiles}
        />
      )}
      {/* {variant === 'grid-attach' && (
        <GridAttachmentUpload
          acceptFormats={acceptFormats}
          files={files}
          isDisabled={isDisabled}
          isUploading={isUploading}
          label={label}
          onUploadFiles={onUploadFiles}
          setFiles={setFiles}
        />
      )} */}
      {variant === 'single-attach' && (
        <SingleAttachmentUpload
          acceptFormats={acceptFormats}
          files={files}
          isDisabled={isDisabled}
          isUploading={isUploading}
          maxSizeMB={maxSizeMB}
          onUploadFiles={handleUpload}
          setFiles={onSetFiles}
        />
      )}
    </div>
  );
};

export default FileUpload;

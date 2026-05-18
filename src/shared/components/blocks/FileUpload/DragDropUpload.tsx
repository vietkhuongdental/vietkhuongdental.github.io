/* eslint-disable @typescript-eslint/no-misused-promises */
import { UploadIcon } from '@/assets/icons/upload-icon';
// Assets Imports
import TrashIcon from '@/shared/assets/icons/trash-icon/trash-icon.svg?react';
import { ProgressBar } from '@/shared/components/blocks/ProgressBar';
import { Button } from '@/shared/components/ui/Button';
import { type FileProps, UploadStatus } from '@/shared/interface';
// Shared Imports
// React Imports
import { useCallback, useRef } from 'react';

interface DragDropUploadProps {
  files: FileProps[];
  setFiles: (files: FileProps[]) => void;
  label: string;
  isDisabled: boolean;
  onUploadFiles: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  acceptFormats?: string;
  resultIcon?: React.ReactNode;
  isUploading?: boolean;
  maxSizeMB?: number;
}

export const DragDropUpload = ({
  files,
  label,
  setFiles,
  isDisabled,
  acceptFormats,
  onUploadFiles,
  resultIcon,
  isUploading = false,
  maxSizeMB
}: DragDropUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = useCallback(
    (deletedFile: FileProps) => {
      requestAnimationFrame(() => {
        const updatedFiles = files.filter(
          (currentFile) => currentFile.fileKey !== deletedFile.fileKey
        );
        setFiles(updatedFiles);
        localStorage.removeItem('uploadingSessionUrl');
      });
    },
    [files]
  );

  return (
    <div className="flex flex-col gap-3">
      <input
        onChange={(e) => {
          onUploadFiles(e);
          e.target.value = ''; // Reset so the same file can be chosen again
        }}
        accept={acceptFormats}
        className="hidden"
        id="file-upload"
        ref={fileInputRef}
        type="file"
        multiple
      />

      <Button
        className="flex h-fit w-full justify-start"
        isDisabled={isDisabled}
        leadingIcon={<UploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        type="button"
        variant="dashed"
      >
        <div className="flex w-full flex-col justify-start gap-1">
          <span className="flex w-full justify-start">{label}</span>
          {maxSizeMB ? (
            <span className="flex w-full justify-start text-sm text-text-subtle">
              Maximum file size {maxSizeMB} MB
            </span>
          ) : null}
        </div>
      </Button>
      {files.length !== 0 && (
        <div className="flex flex-col gap-1">
          {files.map((file) => (
            <Button
              leadingIcon={
                <div className="flex h-8 w-8 items-center justify-center">
                  {resultIcon}
                </div>
              }
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex h-fit w-full justify-start"
              isDisabled={isDisabled}
              key={file.fileKey}
              type="button"
              variant="outlineInverse"
            >
              <div className="flex w-full justify-between text-text-default">
                <div className="flex w-full flex-col justify-center gap-1">
                  <div className="flex flex-row gap-1">
                    <p className="truncate text-md">
                      {file.fileName?.slice(-20)}
                    </p>
                    {file.totalSize ? (
                      <p className="text-sm text-text-disable">
                        &nbsp; | &nbsp;
                        {file.currentUpload
                          ? (file.currentUpload / 1000000).toFixed(2)
                          : 0}
                        MB/
                        {(file.totalSize / 1000000).toFixed(2)}MB
                      </p>
                    ) : null}
                  </div>
                  {file.status === UploadStatus.Uploading ? (
                    <ProgressBar
                      current={file.currentUpload || 0}
                      goal={file.totalSize || 0}
                    />
                  ) : null}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file);
                  }}
                  className="p-2"
                  disabled={isUploading}
                  type="button"
                >
                  <TrashIcon />
                </button>
              </div>
            </Button>
          ))}
        </div>
      )}
      {isUploading ? (
        <span className="text-sm font-normal text-text-description">
          Please keep your browser open during the uploading process
        </span>
      ) : null}
    </div>
  );
};

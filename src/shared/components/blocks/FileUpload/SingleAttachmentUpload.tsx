/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { FileProps } from '@/shared/interface';
import { cn } from '@/shared/libs/utils';
import { UploadIcon } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

interface SingleAttachmentUploadProps {
  files: FileProps[];
  isDisabled: boolean;
  onUploadFiles: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  acceptFormats?: string;
  className?: string;
  setFiles: (files: FileProps[]) => void;
  isUploading?: boolean;
  maxSizeMB?: number;
}

const SingleAttachmentUpload = ({
  files,
  isDisabled,
  acceptFormats,
  onUploadFiles,
  className,
  setFiles,
  isUploading = false,
  maxSizeMB
}: SingleAttachmentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pendingUploadEvent = useRef<React.ChangeEvent<HTMLInputElement> | null>(
    null
  );

  const hasLocalUrl = !!files[0]?.localUrl;
  const hasUrl = !!files[0]?.url;
  const hasImage = hasLocalUrl || hasUrl;

  const handleUploadFiles = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files?.length) return;

      // Save event for later
      pendingUploadEvent.current = event;

      // Clear files first
      setFiles([]);
    },
    [setFiles]
  );

  // Watch when files are cleared, then call upload
  useEffect(() => {
    if (files.length === 0 && pendingUploadEvent.current) {
      void onUploadFiles(pendingUploadEvent.current);
      // Clear ref to prevent duplicate uploads
      pendingUploadEvent.current = null;
    }
  }, [files, onUploadFiles]);

  return (
    <div className="flex h-fit w-fit flex-row gap-[10px] whitespace-nowrap">
      <input
        accept={acceptFormats}
        className="hidden"
        id="file-upload"
        onChange={(e) => handleUploadFiles(e)}
        ref={fileInputRef}
        type="file"
        multiple
      />

      <Button
        className={cn(
          'relative flex aspect-square h-fit rounded-full p-0',
          className
        )}
        isDisabled={isDisabled}
        onClick={() => fileInputRef.current?.click()}
        type="button"
        variant="ghost"
      >
        {isUploading ? (
          <div className="flex aspect-square h-[144px] items-center justify-center rounded-lg border">
            <Spinner scale="lg" />
          </div>
        ) : (
          <div className="relative flex aspect-square h-[144px] items-center justify-center rounded-full bg-border-default">
            {hasImage ? (
              <img
                src={
                  hasLocalUrl
                    ? files[0]?.localUrl
                    : `${files[0]?.url}?cacheBust=${Date.now()}`
                }
                alt="user image"
                className="h-[144px] w-[144px] rounded-full object-cover"
                height={144}
                width={144}
              />
            ) : (
              <div className="flex h-[144px] w-[144px] flex-col items-center justify-center gap-2 text-text-default">
                <UploadIcon />
                <span className="text-center">
                  Upload file <br /> (max {maxSizeMB} MB)
                </span>
              </div>
            )}
          </div>
        )}
      </Button>
    </div>
  );
};

export default SingleAttachmentUpload;

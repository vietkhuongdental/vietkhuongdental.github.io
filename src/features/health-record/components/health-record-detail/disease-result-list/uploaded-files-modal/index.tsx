import { GeneFileUploadIcon } from '@/assets/icons/gene-file-upload-icon';
import { HealthRecordIcon } from '@/assets/icons/health-record-icon';
import { useDecryptAndDownloadFile } from '@/features/health-record/hooks/api/useDecryptAndDownloadFile';
import { usePostRequestDownloadEHRData } from '@/features/health-record/hooks/api/usePostRequestDownloadEHRData';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { DownloadDataResponse, FileKey } from '@/shared/interface';
import type { ApiResponseType } from '@/shared/services/http';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { DownloadIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  healthRecordId: string;
  geneFile?: FileKey;
  ehrFile?: FileKey;
}

export default function UploadedFilesModal({
  healthRecordId,
  geneFile,
  ehrFile
}: Props) {
  const { authStore } = useAuthStore();
  const { onRequestDownloadData, fetchingFile } =
    usePostRequestDownloadEHRData();

  const { onDecryptAndDownloadFile, isHandling: isDownloading } =
    useDecryptAndDownloadFile();

  const [geneResponse, setGeneResponse] =
    useState<ApiResponseType<DownloadDataResponse> | null>(null);

  const [ehrResponse, setEhrResponse] =
    useState<ApiResponseType<DownloadDataResponse> | null>(null);

  const handleClickFile = (response: ApiResponseType<DownloadDataResponse>) => {
    if (!authStore.user?.signature) return;

    onDecryptAndDownloadFile({
      presignedUrl: response.data.url,
      encryptedKey: response.data.encryptedDEK,
      fileKey: response.data.fileKey,
      signature: authStore.user?.signature,
      fileName: response.data.fileName
    });
  };

  // Prefetch when keys change
  useEffect(() => {
    if (!geneFile) return;

    let isMounted = true;
    onRequestDownloadData({
      healthRecordId,
      fileKey: geneFile.fileKey
    }).then((res) => {
      if (isMounted) {
        setGeneResponse(res);
      }
    });

    if (!ehrFile) return;
    onRequestDownloadData({
      healthRecordId,
      fileKey: ehrFile.fileKey
    }).then((res) => {
      if (isMounted) {
        setEhrResponse(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [geneFile, ehrFile, healthRecordId]);

  return (
    <div className="flex w-screen max-w-[600px] flex-col gap-5 px-8 py-5 xl:w-[600px]">
      {/* GENRE FILE */}
      <span className="text-sm font-normal text-text-description">
        The encrypted file requires downloading to view
      </span>
      {geneFile ? (
        <Button
          leadingIcon={
            <div className="flex h-8 w-8 items-center justify-center">
              <GeneFileUploadIcon />
            </div>
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
          trailingIcon={
            <button
              disabled={
                isDownloading === geneResponse?.data.fileKey ||
                fetchingFile === geneResponse?.data.fileKey
              }
              onClick={() => {
                if (!geneResponse) return;
                handleClickFile(geneResponse);
              }}
              className="p-2"
              type="button"
            >
              {isDownloading === geneResponse?.data.fileKey ||
              !geneResponse ||
              fetchingFile === geneResponse?.data.fileKey ? (
                <Spinner />
              ) : (
                <DownloadIcon color="black" />
              )}
            </button>
          }
          className="flex h-fit w-full justify-start"
          type="button"
          variant="outlineInverse"
        >
          <div className="flex w-full flex-row gap-2">
            <p className="w-fit truncate text-md text-text-default">
              {geneFile.fileName.slice(-20)}
            </p>
            <p className="flex w-fit items-center truncate text-sm text-text-disable">
              |{' '}
              {geneResponse?.data.fileSize
                ? (geneResponse?.data.fileSize / 1000000).toFixed(2)
                : 0}
              &nbsp;MB
            </p>
          </div>
        </Button>
      ) : null}

      {/* EHR-FILE */}
      {ehrFile ? (
        <Button
          leadingIcon={
            <div className="flex h-8 w-8 items-center justify-center">
              <HealthRecordIcon />
            </div>
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
          trailingIcon={
            <button
              disabled={
                isDownloading === ehrResponse?.data.fileKey ||
                fetchingFile === geneResponse?.data.fileKey
              }
              onClick={() => {
                if (!ehrResponse) return;
                handleClickFile(ehrResponse);
              }}
              className="p-2"
              type="button"
            >
              {isDownloading === ehrResponse?.data.fileKey ||
              !ehrResponse ||
              fetchingFile === geneResponse?.data.fileKey ? (
                <Spinner />
              ) : (
                <DownloadIcon color="black" />
              )}
            </button>
          }
          className="flex h-fit w-full justify-start"
          type="button"
          variant="outlineInverse"
        >
          <div className="flex w-full flex-row gap-2">
            <p className="w-fit truncate text-md text-text-default">
              {ehrFile.fileName.slice(-20)}
            </p>
            <p className="flex w-fit items-center truncate text-sm text-text-disable">
              |{' '}
              {ehrResponse?.data.fileSize
                ? (ehrResponse?.data.fileSize / 1000000).toFixed(2)
                : 0}
              &nbsp;MB
            </p>
          </div>
        </Button>
      ) : null}
    </div>
  );
}

/* eslint-disable max-params */
/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  useGetResumableSession,
  useIsDirty,
  useToastProvider
} from '@/shared/hooks';
import { useCheckUploadStatus } from '@/shared/hooks/useCheckUploadStatus';
import { useFileFieldStore } from '@/shared/hooks/useFileUploadStore';
import { useGetFilePresignedUrl } from '@/shared/hooks/useGetPresignedUrl';
import {
  normalizeExtension,
  parseAcceptFormats,
  toBase64
} from '@/shared/libs/utils';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { type FileProps, UploadStatus } from '../interface';
import { AesCtrStream } from './AesStream';
import { GcsStream } from './GcsStream';
import { HashStream } from './HashStream';
import { FileReader } from './stream';

export const CHUNK_SIZE = 70 * 1024 * 1024; // 70MB

interface UploadFilesProps {
  maxCountFiles: number;
  acceptFormats: string;
  maxSizeMB?: number;
  destination: string;
  fieldName?: string;
  isNeedEncrypt?: boolean;
}

export function useUploadFile({
  maxCountFiles,
  maxSizeMB = 16000, // ~ 16GB
  acceptFormats,
  fieldName,
  destination,
  isNeedEncrypt = false
}: UploadFilesProps) {
  const { showToast } = useToastProvider();
  const { authStore } = useAuthStore();

  const { chosenUploadingFileFields, setChosenUploadingFileFields } =
    useFileFieldStore();

  const allowedTypes = useMemo(
    () => parseAcceptFormats(acceptFormats),
    [acceptFormats]
  );
  const { isDirty: isUploading, setIsDirty: setIsUploading } = useIsDirty();

  const [files, setFiles] = useState<FileProps[]>([]);

  const onSetFiles = (files: FileProps[]) => {
    setFiles(files);
  };

  useEffect(() => {
    const checkUploadStatus = async ({
      sessionUrl,
      uploadingFileKey
    }: {
      sessionUrl: string;
      uploadingFileKey: string;
    }) => {
      const response = await onCheckUploadStatus({ sessionUrl });

      const chosenUploadingFileField = chosenUploadingFileFields.find(
        (fileField) => fileField.field === fieldName
      );

      if (response.status === 308 && !!chosenUploadingFileField?.file) {
        const range = response.headers.get('Range');
        console.log('range :>> ', range);
        const nextOffset = Number(range?.split('-')[1]) + 1;
        console.log('nextOffset :>> ', nextOffset);

        const checksum = await onUploadFileByStream({
          chosenFile: chosenUploadingFileField.file,
          sessionUrl,
          key: uploadingFileKey,
          uploadingFile: files[0],
          initOffset: nextOffset
        });

        const updatedFiles = files.map((currentFile) =>
          currentFile.fileKey === uploadingFileKey
            ? {
                ...currentFile,
                status: UploadStatus.Success,
                currentUpload: currentFile.totalSize,
                checksum
              }
            : currentFile
        );
        setFiles(updatedFiles);
        localStorage.removeItem('uploadingSessionUrl');
        localStorage.removeItem('uploadingFileKey');

        const updatedFileFields = [
          ...chosenUploadingFileFields.filter(
            (fileField) => fileField.field !== fieldName
          ),
          { field: fieldName, file: null }
        ];
        setChosenUploadingFileFields(updatedFileFields);

        showToast({
          variant: 'success',
          title: 'File uploaded successfully'
        });
        setIsUploading(false);
      }
    };

    const handleOnline = async () => {
      console.log('[Reconnected] Checking upload status...');
      const sessionUrl = localStorage.getItem('uploadingSessionUrl') || '';
      const uploadingFileKey = localStorage.getItem('uploadingFileKey') || '';

      if (!sessionUrl || !uploadingFileKey) return;

      await checkUploadStatus({ sessionUrl, uploadingFileKey });
    };

    // On every files dependency updated, need to remove listener 'online' from previous chunks updates --> avoid cumulative many handleOnline
    window.removeEventListener('online', handleOnline);

    window.addEventListener('online', handleOnline, { once: true });

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [chosenUploadingFileFields, files]); // dependency has [files] so that handleOnline will be reListened again after every chunks successfully uploaded

  useEffect(() => {
    const handleOffline = () => {
      showToast({
        variant: 'error',
        title: 'Uploading paused. Check your network connection'
      });
    };

    window.addEventListener('offline', handleOffline, { once: true });

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const onUploadFailed = (key: string) => {
    const updatedFiles = files.map((currentFile) =>
      currentFile.fileKey === key
        ? { ...currentFile, status: UploadStatus.Failed }
        : currentFile
    );
    setFiles(updatedFiles);
  };

  const { onGetFilePresignedUrl } = useGetFilePresignedUrl({
    destination
  });
  const { onGetResumableSession } = useGetResumableSession();
  const { onCheckUploadStatus } = useCheckUploadStatus();

  const onUploadFileByStream = async ({
    uploadingFile,
    initOffset,
    key,
    sessionUrl,
    chosenFile
  }: {
    chosenFile: File;
    initOffset?: number;
    key: string;
    sessionUrl: string;
    uploadingFile: FileProps;
  }): Promise<string> => {
    const fileSize = chosenFile.size;
    const fileStream = new FileReader(chosenFile, CHUNK_SIZE, initOffset);
    const hashStream = await HashStream.createHashStream();

    let stream = fileStream.pipeThrough(hashStream);

    if (isNeedEncrypt) {
      const plainTextDEK = crypto.getRandomValues(new Uint8Array(16 + 32)); //  128 + 64-bit IV
      localStorage.setItem('plainTextDEK', toBase64(plainTextDEK.buffer));
      stream = stream.pipeThrough(new AesCtrStream(plainTextDEK));
    }

    const gcsStream = new GcsStream(
      {
        sessionUrl,
        totalSize: fileSize,
        fileKey: key,
        initialOffset: initOffset
      },
      (numOfBytesUploaded: number) => {
        setFiles((prev) =>
          prev.map((file) =>
            file.fileKey === key
              ? { ...uploadingFile, currentUpload: numOfBytesUploaded }
              : file
          )
        );
      }
    );

    await stream.pipeTo(gcsStream);
    const checksum = toBase64(hashStream.getChecksum());
    setFiles((prev) =>
      prev.map((file) =>
        file.fileKey === key ? { ...uploadingFile, checksum } : file
      )
    );
    return checksum;
  };

  const onUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = event.target.files;

    if (chosenFiles === null) {
      showToast({
        variant: 'error',
        title: 'File is empty. Please try again'
      });

      throw new Error('File is empty');
    }

    if (chosenFiles.length + files.length > maxCountFiles) {
      showToast({
        variant: 'error',
        title: 'Exceed maximum number of files. Please try again'
      });
      throw new Error('Exceed maximum number of files');
    }

    const uploadPromises = Array.from(chosenFiles).map(async (chosenFile) => {
      const key = uuidv4();
      let uploadingFile: FileProps = {
        fileKey: key,
        fileName: chosenFile.name,
        id: null,
        status: UploadStatus.Uploading,
        url: URL.createObjectURL(chosenFile), // Read Url from device
        localUrl: URL.createObjectURL(chosenFile),
        pathFile: '',
        currentUpload: 0,
        totalSize: chosenFile.size,
        checksum: '',
        fileType: chosenFile.type
      };
      const fileExtension = chosenFile.type.split('/').pop();

      if (chosenFile.size > 1024 * 1024 * maxSizeMB) {
        onUploadFailed(key);
        throw new Error('File size must be within acceptable size');
      }

      if (
        fileExtension &&
        !allowedTypes.has(normalizeExtension(fileExtension))
      ) {
        onUploadFailed(key);
        throw new Error('File type must be acceptable.');
      }

      try {
        setIsUploading(true);

        // 1. GET PRESIGNED_URL
        const presignedUrlData = await onGetFilePresignedUrl({
          orgName: chosenFile.name,
          fileType: !isNeedEncrypt
            ? chosenFile.type
            : 'application/octet-stream',
          resumable: true
        });

        if (!presignedUrlData.uploadUrl || !presignedUrlData.fileKey) {
          onUploadFailed(key);
          showToast({
            variant: 'error',
            title: 'Error uploading failed. Please try again'
          });
          return;
        }

        uploadingFile = {
          ...uploadingFile,
          fileKey: presignedUrlData.fileKey,
          pathFile: presignedUrlData.pathFile
        };

        localStorage.setItem('uploadingFileKey', presignedUrlData.fileKey);

        // 2. GET RESUMBALE SESSION_URL BASED ON PRESIGNED_URL:
        if (!authStore.user?.id) return;

        const sessionUrl = await onGetResumableSession({
          accountId: authStore.user?.id,
          host: 'storage.googleapis.com',
          uploadUrl: presignedUrlData.uploadUrl,
          fileType: !isNeedEncrypt
            ? chosenFile.type
            : 'application/octet-stream',
          fileName: chosenFile.name
        });

        if (!sessionUrl) {
          onUploadFailed(presignedUrlData.fileKey);
          showToast({
            variant: 'error',
            title: 'File was not uploaded succesfully'
          });
          return;
        }

        localStorage.setItem('uploadingSessionUrl', sessionUrl);

        // 4. UPLOAD FILE TO GCS:
        let updatedFileFields = [
          ...chosenUploadingFileFields.filter(
            (fileField) => fileField.field !== fieldName
          ),
          { file: chosenFile, field: fieldName }
        ];
        setChosenUploadingFileFields(updatedFileFields);

        setFiles((prev) => [...prev, uploadingFile]);

        let checksum = '';

        try {
          checksum = await onUploadFileByStream({
            chosenFile,
            sessionUrl: sessionUrl.toString(),
            key: presignedUrlData.fileKey,
            uploadingFile
          });

          uploadingFile = {
            ...uploadingFile,
            status: UploadStatus.Success,
            currentUpload: uploadingFile.totalSize,
            checksum
          };

          setFiles((prev) =>
            prev.map((file) =>
              file.fileKey === presignedUrlData.fileKey ? uploadingFile : file
            )
          );

          localStorage.removeItem('uploadingSessionUrl');
          localStorage.removeItem('uploadingFileKey');

          updatedFileFields = [
            ...chosenUploadingFileFields?.filter(
              (fileField) => fileField.field !== fieldName
            ),
            { file: null, field: fieldName }
          ];
          setChosenUploadingFileFields(updatedFileFields);

          showToast({
            variant: 'success',
            title: 'File uploaded successfully'
          });
          setIsUploading(false);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
        showToast({
          variant: 'error',
          title: 'File was removed or uploaded unsuccesfully'
        });

        if (error instanceof TypeError) {
          console.error('Network-level error:', error.message);
          return;
        }

        onUploadFailed(uploadingFile.fileKey);
        setIsUploading(false);
      }
    });

    await Promise.all(uploadPromises);
  };

  return { files, onSetFiles, onUploadFiles, isUploading };
}

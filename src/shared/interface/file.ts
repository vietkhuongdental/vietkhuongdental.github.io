export enum UploadStatus {
  Failed = 'failed',
  Success = 'success',
  Uploading = 'uploading'
}

export interface FileProps {
  fileName?: string;
  fileKey: string;
  id?: null | number | string;
  status?: UploadStatus;
  url?: string; // CloudfrontUrl
  localUrl?: string;
  pathFile?: string; // pathFile in S3 for BE to 1st time created CloudfrontUrl
  fileType?: string;
  currentUpload?: number;
  totalSize?: number;
  checksum?: string;
  encryptedDEK?: string;
}

export interface FilePresignedUrlPayload {
  orgName: string;
  fileType: string;
  resumable?: boolean;
  // fileContentLength: number;
}

export interface FilePresignedUrlResponse {
  fileKey: string;
  pathFile: string;
  uploadUrl: string;
}

export interface ResumableSessionUrlPayload {
  accountId: string;
  host: string;
  uploadUrl: string;
  fileType: string;
  fileName: string;
}

export interface ResumableSessionUrlResponse {
  [key: string]: string;
}

export interface UploadChunkPayload {
  fileKey: string;
  sessionUrl: string;
  offset: number;
  totalSize: number;
  chunk: Uint8Array;
}

export interface UploadChunkResponse {
  [key: string]: string;
}

export interface FileKey {
  fileKey: string;
  fileName: string;
  checksum?: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
}

export interface DownloadRequest {
  fileKey: string;
}

export interface DownloadDataResponse {
  id: string;
  fileKey: string;
  fileSize: number;
  fileName: string;
  checksum: string;
  fileType: string;
  url: string;
  encryptedDEK: string;
}

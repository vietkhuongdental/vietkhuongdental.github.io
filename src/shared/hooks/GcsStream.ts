/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { UploadChunkPayload } from '../interface';

type GcsStreamProps = {
  initialOffset?: number;
} & Omit<UploadChunkPayload, 'chunk' | 'offset'>;

export class GcsStream extends WritableStream<Uint8Array> {
  private offset: number;
  private uploadedBytes: number;

  constructor(
    props: GcsStreamProps,
    onProgress?: (numOfBytesUploaded: number) => void
  ) {
    super({
      write: async (chunk) => {
        const chunkStartOffset = this.offset;
        const chunkSize = chunk.length;
        const xhr = new XMLHttpRequest();
        const promise: Promise<void> = new Promise((resolve, reject) => {
          // Track upload progress
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              // Update uploaded bytes based on current chunk progress
              this.uploadedBytes =
                this.offset +
                Math.round((event.loaded / event.total) * chunkSize);
              onProgress && onProgress(this.uploadedBytes);
            }
          });

          xhr.addEventListener('load', () => {
            // Handle GCS resumable upload responses
            // 200: Upload complete, 308: Upload in progress (more data expected)
            if (xhr.status === 200 || xhr.status === 308) {
              this.offset += chunkSize;
              this.uploadedBytes = this.offset; // Ensure consistency
              onProgress && onProgress(this.uploadedBytes);
              resolve(undefined);
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          });

          xhr.addEventListener('error', (err) => {
            reject(err);
          });

          xhr.open('PUT', props.sessionUrl);
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.setRequestHeader(
            'Content-Range',
            `bytes ${chunkStartOffset}-${chunkStartOffset + chunkSize - 1}/${props.totalSize}`
          );
          xhr.send(chunk);
        });
        promise.finally(() => {
          xhr.removeEventListener('progress', () => {});
          xhr.removeEventListener('load', () => {});
          xhr.removeEventListener('error', () => {});
        });
        return promise;
      }
    });
    // Initialize offset dynamically
    this.offset = props.initialOffset ?? 0;
    this.uploadedBytes = this.offset;
  }
}

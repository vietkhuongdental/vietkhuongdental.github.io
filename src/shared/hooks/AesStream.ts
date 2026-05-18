/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable max-params */
import type { ModeOfOperation } from 'aes-js';
import aesjs from 'aes-js';

export class AesCtrStream extends TransformStream<Uint8Array> {
  private aesCtr: ModeOfOperation.ModeOfOperationCTR;
  private offset: number;

  constructor(sign: Uint8Array) {
    super({
      transform: (chunk, controller) => {
        const decryptedBytes = this.aesCtr.decrypt(chunk);
        controller.enqueue(decryptedBytes);
        this.offset += chunk.length;
      }
    });
    const iv = sign.slice(0, 16);
    const key = sign.slice(16);
    this.aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(iv));
    this.offset = 0;
  }
}

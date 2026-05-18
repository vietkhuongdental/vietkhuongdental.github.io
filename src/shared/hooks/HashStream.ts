import type { IHasher } from 'hash-wasm';
import { createSHA256 } from 'hash-wasm';

export class HashStream extends TransformStream<Uint8Array, Uint8Array> {
  private checksum: Uint8Array;
  private hasher?: IHasher | undefined;

  private constructor() {
    super({
      transform: (chunk, controller) => {
        this.hasher?.update(chunk);
        controller.enqueue(chunk);
      },
      flush: (controller) => {
        this.checksum = this.hasher?.digest('binary') || new Uint8Array();
        controller.terminate();
      }
    });
    this.checksum = new Uint8Array();
  }

  static async createHashStream() {
    const hashStream = new HashStream();
    hashStream.hasher = await createSHA256();
    hashStream.hasher.init();
    return hashStream;
  }

  getChecksum(): Uint8Array {
    return this.checksum;
  }
}

export class FileReader extends ReadableStream<Uint8Array> {
  private offset: number;

  constructor(file: File, chunkSize: number, initOffset?: number) {
    super(
      {
        pull: async (controller) => {
          if (this.offset > file.size) {
            controller.close();
            return;
          }

          const chunk = file.slice(this.offset, this.offset + chunkSize);
          const buffer = await chunk.arrayBuffer();
          controller.enqueue(new Uint8Array(buffer));
          this.offset += chunkSize;
        }
      },
      new ByteLengthQueuingStrategy({ highWaterMark: chunkSize })
    );
    this.offset = initOffset || 0;
  }
}

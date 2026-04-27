
export class Disk {
    private blocks: Uint8Array[];

    constructor(blockCount: number, blockSize: number) {
        this.blocks = Array.from(
            { length: blockCount },
            () => new Uint8Array(blockSize)
        );
    }

    readBlock(index: number): Uint8Array {
        this.assertBlock(index);
        return this.blocks[index].slice();
    }

    writeBlock(index: number, bytes: Uint8Array): void {
        this.assertBlock(index);

        const block = this.blocks[index];
        block.fill(0);
        block.set(bytes.slice(0, block.length));
    }

    private assertBlock(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.blocks.length) {
            throw new RangeError(`Invalid disk block: ${index}`);
        }
    }
}
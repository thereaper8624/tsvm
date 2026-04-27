export class Memory {
    private bytes: Uint8Array;

    constructor(size = 65_536) {
        this.bytes = new Uint8Array(size);
    }

    get size(): number {
        return this.bytes.length;
    }

    read8(address: number): number {
        this.assertAddress(address);
        return this.bytes[address];
    }

    write8(address: number, value: number): void {
        this.assertAddress(address);
        this.bytes[address] = value & 0xff;
    }

    read16(address: number): number {
        this.assertAddress(address);
        this.assertAddress(address + 1);

        const low = this.bytes[address];
        const high = this.bytes[address + 1];

        return low | (high << 8);
    }

    write16(address: number, value: number): void {
        this.assertAddress(address);
        this.assertAddress(address + 1);

        this.bytes[address] = value & 0xff;
        this.bytes[address + 1] = (value >> 8) & 0xff;
    }

    private assertAddress(address: number): void {
        if (!Number.isInteger(address) || address < 0 || address >= this.bytes.length) {
            throw new RangeError(`Invalid memory address: ${address}`);
        }
    }
}
export const GENERAL_REGISTER_COUNT = 6;

export type GeneralRegister = "R0" | "R1" | "R2" | "R3" | "R4" | "R5";

export const GENERAL_REGISTERS: GeneralRegister[] = [
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
];

export class Registers {
    private general = new Uint16Array(GENERAL_REGISTER_COUNT);

    public sp = 0;
    public ip = 0;

    get(register: GeneralRegister): number {
        return this.general[this.indexOf(register)];
    }

    set(register: GeneralRegister, value: number): void {
        this.general[this.indexOf(register)] = value & 0xffff;
    }

    dump(): Record<GeneralRegister | "SP" | "IP", number> {
        return {
            R0: this.get("R0"),
            R1: this.get("R1"),
            R2: this.get("R2"),
            R3: this.get("R3"),
            R4: this.get("R4"),
            R5: this.get("R5"),
            SP: this.sp,
            IP: this.ip,
        };
    }

    private indexOf(register: GeneralRegister): number {
        return Number(register.slice(1));
    }
}
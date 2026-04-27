
import { Memory } from "./memory.js";
import { Disk } from "./disk.js";
import { Registers } from "./registers.js";
import { Instruction, Operand } from "./instruction.js";

export class VM {
    public readonly memory: Memory;
    public readonly registers: Registers;

    private halted = false;

    constructor(memorySize = 65_536) {
        this.memory = new Memory(memorySize);
        this.registers = new Registers();

        this.registers.sp = memorySize - 1;
        this.registers.ip = 0;
    }

    run(program: Instruction[]): void {
        while (!this.halted) {
            if (this.registers.ip < 0 || this.registers.ip >= program.length) {
                throw new RangeError(`Instruction pointer out of bounds: ${this.registers.ip}`);
            }

            const instruction = program[this.registers.ip];

            this.registers.ip++;

            this.execute(instruction);
        }
    }

    execute(instruction: Instruction): void {
        switch (instruction.op) {
            case "MOV": {
                const value = this.readOperand(instruction.source);
                this.registers.set(instruction.dest, value);
                break;
            }

            case "LOAD": {
                const value = this.memory.read16(instruction.address);
                this.registers.set(instruction.dest, value);
                break;
            }

            case "STORE": {
                const value = this.registers.get(instruction.source);
                this.memory.write16(instruction.address, value);
                break;
            }

            case "ADD": {
                const left = this.registers.get(instruction.dest);
                const right = this.readOperand(instruction.source);
                this.registers.set(instruction.dest, left + right);
                break;
            }

            case "SUB": {
                const left = this.registers.get(instruction.dest);
                const right = this.readOperand(instruction.source);
                this.registers.set(instruction.dest, left - right);
                break;
            }

            case "PUSH": {
                const value = this.readOperand(instruction.source);
                this.push16(value);
                break;
            }

            case "POP": {
                const value = this.pop16();
                this.registers.set(instruction.dest, value);
                break;
            }

            case "JMP": {
                this.registers.ip = instruction.address;
                break;
            }

            case "JZ": {
                if (this.registers.get(instruction.register) === 0) {
                    this.registers.ip = instruction.address;
                }

                break;
            }

            case "JNZ": {
                if (this.registers.get(instruction.register) !== 0) {
                    this.registers.ip = instruction.address;
                }

                break;
            }

            case "HALT": {
                this.halted = true;
                break;
            }
        }
    }

    private readOperand(operand: Operand): number {
        switch (operand.type) {
            case "register":
                return this.registers.get(operand.register);

            case "immediate":
                return operand.value & 0xffff;

            case "memory":
                return this.memory.read16(operand.address);
        }
    }

    private push16(value: number): void {
        // Stack grows downward by 2 bytes
        this.registers.sp -= 2;

        if (this.registers.sp < 0) {
            throw new RangeError("Stack overflow");
        }

        this.memory.write16(this.registers.sp, value);
    }

    private pop16(): number {
        if (this.registers.sp >= this.memory.size - 1) {
            throw new RangeError("Stack underflow");
        }

        const value = this.memory.read16(this.registers.sp);
        // Stack shrinks upward by 2 bytes
        this.registers.sp += 2;

        return value;
    }

    dumpState(): void {
        console.table(this.registers.dump());
    }
}
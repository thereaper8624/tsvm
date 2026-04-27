import type { GeneralRegister } from "./registers.js";

export type Operand =
    | { type: "register"; register: GeneralRegister }
    | { type: "immediate"; value: number }
    | { type: "memory"; address: number }

export type Instruction =
    | { op: "MOV"; dest: GeneralRegister; source: Operand }
    | { op: "LOAD"; dest: GeneralRegister; address: number }
    | { op: "STORE"; source: GeneralRegister; address: number }
    | { op: "ADD"; dest: GeneralRegister; source: Operand }
    | { op: "SUB"; dest: GeneralRegister; source: Operand }
    | { op: "PUSH"; source: Operand }
    | { op: "POP"; dest: GeneralRegister }
    | { op: "JMP"; address: number }
    | { op: "JZ"; register: GeneralRegister; address: number }
    | { op: "JNZ"; register: GeneralRegister; address: number }
    | { op: "HALT" };

export function reg(register: GeneralRegister): Operand {
    return {
        type: "register",
        register,
    };
}

export function imm(value: number): Operand {
    return {
        type: "immediate",
        value,
    };
}

export function mem(address: number): Operand {
    return {
        type: "memory",
        address,
    };
}

import { VM } from "./core/vm.js";
import type { Instruction } from "./core/instruction.js";
import { imm, reg } from "./core/instruction.js";

const vm = new VM();

const program: Instruction[] = [
    { op: "MOV", dest: "R0", source: imm(10) },
    { op: "MOV", dest: "R1", source: imm(20) },
    { op: "ADD", dest: "R0", source: reg("R1") },
    { op: "STORE", source: "R0", address: 1000 },
    { op: "PUSH", source: reg("R0") },
    { op: "MOV", dest: "R2", source: imm(0) },
    { op: "POP", dest: "R2" },
    { op: "LOAD", dest: "R3", address: 1000 },
    { op: "HALT" },
];

vm.run(program);

vm.dumpState();

console.log("Memory[1000]:", vm.memory.read16(1000));
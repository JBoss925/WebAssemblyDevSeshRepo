let wasm: any = require('./../wasm');
let memHeap = new Uint8Array(wasm.memory.buffer);

console.log(wasm.test(4, 5));
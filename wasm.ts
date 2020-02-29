const fs = require("fs");
// TODO: Just some default memory space! Feel free to change!
const memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/optimized.wasm"));
const imports = {
  env: {
    abort(_msg, _file, line, column) {
      console.error("abort called at index.ts:" + line + ":" + column);
    },
    memory: memory
  }
};
Object.defineProperty(module, "exports", {
  get: () => new WebAssembly.Instance(compiled, imports).exports
});
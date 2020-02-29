const assert = require("assert");
const myModule = require("./../wasm");
assert.equal(myModule.test(1, 2), 3);
console.log("ok");

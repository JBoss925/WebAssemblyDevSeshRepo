import * as Long from 'long';

type Test = {
  testName: string,
  tsFunc: Function,
  asFunc: Function,
  inputs: any[],
  thisArg?: any
};

type TestResult = {
  test: Test,
  testInd: number,
  inputInd: number,
  tsTime: number,
  asTime: number
}

let wasmProf: any = require('./../wasm');

let tests: Test[] = [];

let testResults: TestResult[][] = [];

function main() {

  tests = [{
    testName: "Fibonacci",
    tsFunc: require('./example1/fibonacci').fib,
    asFunc: wasmProf.fibAssembly,
    inputs: [[10], [20], [25], [30], [33], [36], [40], [42]]
  },
  {
    testName: "MemHeavy",
    tsFunc: require('./example2/memheavy').mem,
    asFunc: wasmProf.memHeavyTest,
    inputs: [[[1, 2, 3, 4, 5], 0, 5000], [[1, 2, 3, 4, 7], 0, 5000]]
  },
  {
    testName: "StrHeavy",
    tsFunc: require('./example3/strheavy').strHeavy,
    asFunc: wasmProf.strHeavyTest,
    inputs: [["hi", 0, 8000], ["test", 0, 8000]]
  }];

  for (let i = 0; i < tests.length; i++) {
    let test: Test = tests[i];
    let results: TestResult[] = [];
    for (let n = 0; n < test.inputs.length; n++) {
      let input: any = test.inputs[n];
      let tF: Function = test.tsFunc;
      let t1s = Date.now();
      tF.apply(test.thisArg ? test.thisArg : this, [...input]);
      let t2s = Date.now();
      let aF: Function = test.asFunc;
      let a1s = Date.now();
      aF.apply(test.thisArg ? test.thisArg : this, [...input]);
      let a2s = Date.now();
      let res: TestResult = {
        test: test,
        testInd: i,
        inputInd: n,
        tsTime: t2s - t1s,
        asTime: a2s - a1s
      };
      results.push(res);
      logTestResult(res);
    }
    testResults.push(results);
  }
  logOverallResult();
}

function logOverallResult() {
  let allWATimes: Long = Long.fromNumber(0);
  let allTSTimes: Long = Long.fromNumber(0);
  for (let t1 = 0; t1 < testResults.length; t1++) {
    let results = testResults[t1];
    for (let t2 = 0; t2 < results.length; t2++) {
      allWATimes = allWATimes.add(results[t2].asTime);
      allTSTimes = allTSTimes.add(results[t2].tsTime);
    }
  };

  let l = 100 - (allWATimes.toNumber() / allTSTimes.toNumber() * 100);
  console.log("--------------------------------------------------");
  console.log(capAt50("| Overall Performance Increase: "));
  console.log(capAt50("| TS Time: " + allTSTimes + "    WA Time: " + allWATimes));
  console.log(capAt50("| Percent Increase: " + l + "%"));
  console.log("--------------------------------------------------");

}

function logTestResult(tr: TestResult) {
  console.log("--------------------------------------------------");
  console.log(capAt50("| " + tr.test.testName));
  console.log(capAt50("| Input: " + tr.test.inputs[tr.inputInd]));
  console.log(capAt50("| Times: "));
  console.log(capAt50("|     TypeScript: " + tr.tsTime + "    WebAssembly: " + tr.asTime));
  console.log(capAt50("| Performance Increase: " + ((1 - (tr.asTime / tr.tsTime)) * 100) + "%"));
  console.log("--------------------------------------------------");
}

function capAt50(inStr: string) {
  if (inStr.length >= 50) {
    return inStr.substr(0, 49) + "|";
  } else {
    let dif = 50 - inStr.length - 1;
    let s = "";
    for (let i = 0; i < dif; i++) {
      s += " ";
    }
    s += "|";
    return inStr + s;
  }
}

main();
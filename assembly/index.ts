// The entry file of your WebAssembly module.


export function test(a: i32, b: i32): i32 {
  return a + b;
}

export function fibAssembly(n: i32): i32 {
  return n < 2 ? 1 : fibAssembly(n - 1) + fibAssembly(n - 2);
}

let didStore1 = false;

export function strHeavyTest(str: string, depth: i32, maxDepth: i32): string {
  const strPtr = 800;
  if (didStore1) {
    str = load<string>(strPtr);
  } else {
    // Grow memory by a page
    memory.grow(1);
    store<string>(strPtr, str);
    didStore1 = true;
  }
  if (depth >= maxDepth)
    return str;
  return strHeavyTest(str, depth + 1, maxDepth);
}

let didStore = false;

export function memHeavyTest(nums: i32[], depth: i32, maxDepth: i32): i32[] {
  // Define pointer for number in memory
  const numsInd = 0;
  // If we previously stored, load and sum
  if (didStore) {
    let nums = load<i32[]>(numsInd);
    let sum = 0;
    for (let n = 0; n < nums.length; n++) {
      sum += nums[n];
    }
    nums = nums.fill(sum);
  } else {
    // Grow memory by a page
    memory.grow(1);
  }
  if (depth >= maxDepth)
    return nums;
  // Load
  store<i32[]>(numsInd, nums);
  didStore = true;
  return memHeavyTest(nums, depth + 1, maxDepth);
}
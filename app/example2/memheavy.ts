let numsC: number[] = [];
let hasImported = false;

export function mem(nums: number[], depth: number, maxDepth: number): number[] {
  if (!hasImported) {
    numsC = nums;
  }
  let sum = 0;
  for (let n = 0; n < numsC.length; n++) {
    sum += nums[n];
  }
  numsC = numsC.map(() => sum);
  if (depth >= maxDepth)
    return numsC;
  return mem(numsC, depth + 1, maxDepth);
}
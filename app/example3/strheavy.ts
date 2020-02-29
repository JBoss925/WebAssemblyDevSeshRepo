export function strHeavy(str: string, depth: number, maxDepth: number): string {
  if (depth >= maxDepth)
    return str;
  return strHeavy(str + " ", depth + 1, maxDepth);
}
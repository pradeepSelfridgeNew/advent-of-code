import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });
let count = 0;

enum ListType {
  SAFE = "safe",
  UNSAFE = "unsafe",
}

interface ListItem {
  type: ListType;
  values: number[];
}

const parseFileContent = (content: string): number[][] => {
  return content
    .trim()
    .split("\n")
    .map((row: string) => row.split(" ").map(Number));
};

const levels: number[][] = parseFileContent(fileContents);

const isPairHaveOrder = (pairs: number[]): boolean => {
  let isIncreasing = true;
  let isDecreasing = true;
  for (let i = 0; i < pairs.length - 1; i++) {
    if (pairs[i] < pairs[i + 1]) {
      isDecreasing = false;
    }
    if (pairs[i] > pairs[i + 1]) {
      isIncreasing = false;
    }
    if (pairs[i] === pairs[i + 1]) {
      isDecreasing = false;
      isIncreasing = false;
    }
  }
  return isDecreasing || isIncreasing;
};

const checkDifference = (arr: number[]): ListType => {
  const diff = arr
    .slice(1)
    .map((num, i) => Math.abs(arr[i] - num));
  
  if (diff.some((d) => d > 3)) return ListType.UNSAFE;

  return isPairHaveOrder(arr) ? ListType.SAFE : ListType.UNSAFE;
};

// First part
const firstlevels: ListItem[] = levels.map((row) => ({
  type: checkDifference(row),
  values: row,
}));

const result = firstlevels.filter((val) => val.type === ListType.SAFE).length;
console.log(result);

// Second part
const safe = (level: number[]): boolean => checkDifference(level) === ListType.SAFE;

for (const level of levels) {
  if (level.length > 1 && level.some((_, index) => {
    const modifiedLevels = level.filter((_, i) => i !== index);
    return safe(modifiedLevels);
  })) {
    count++;
  }
}

console.log(count);

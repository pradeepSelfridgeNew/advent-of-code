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

const firstlevels: ListItem[] = fileContents
  .trim()
  .split("\n")
  .map((row: string) => ({
    type: ListType.SAFE,  // Initial type can be set as SAFE.
    values: row
      .split(" ")
      .filter((c) => c !== "")
      .map(Number),
  }));

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
  const pairs = arr.flatMap((num, i) => {
    let diff = 0;
    if (i + 1 < arr.length) {
      diff = Math.abs(num - arr[i + 1]);
    }
    return diff;
  });
  return pairs.some((diff) => diff > 3)
    ? ListType.UNSAFE
    : isPairHaveOrder(arr)
    ? ListType.SAFE
    : ListType.UNSAFE;
};

const result = firstlevels.map((val) => {
  return {
    ...val,
    type: checkDifference(val.values),
  };
}).filter(value => value.type === ListType.SAFE).length;

console.log(result)



/**Second */

const levels: number[][] = fileContents
  .trim()
  .split("\n")
  .map((row: string) => row
      .split(" ")
      .filter((c) => c !== "")
      .map(Number),
  );
function safe(levels: number[]): boolean {
  return checkDifference(levels) === ListType.SAFE;
}
for(const level of levels) {
  if (level.length > 1 && level.some((_, index) => {
    const modifiedLevels = [...level.slice(0, index), ...level.slice(index + 1)];
    return safe(modifiedLevels);
  })) {
    count++;
  }
}


console.log(count);

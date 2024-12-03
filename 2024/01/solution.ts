import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const leftList: number[] = [];
const rightList: number[] = [];

fileContents
  .trim()
  .split("\n")
  .forEach((row: string) => {
    const values = row.split(" ").filter((c) => c !== "");

    leftList.push(Number(values[0]));
    rightList.push(Number(values[1]));
  });

const compareAsc = (a: number, b: number) => a - b;
const leftListSorted = leftList.toSorted(compareAsc);
const rightListSorted = rightList.toSorted(compareAsc);

//console.log('leftListSorted', leftListSorted);
//console.log('rightListSorted', rightListSorted);

const result = leftListSorted
  .map((value, index) => Math.abs(value - rightListSorted[index]))
  .reduce((acc, prev) => acc + prev, 0);

console.log(`Total distance between lists: ${result}`);

const rightListOccurences: Record<number, number> = {};

rightList.forEach((number) => {
 // console.log('rightList', number);
  if (rightListOccurences[number] === undefined) {
    rightListOccurences[number] = 0;
  }

  rightListOccurences[number] += 1;
});

const similarityScore = leftList
  .map((number) => {
   // console.log('similarityScore', number);
    if (rightListOccurences[number] !== undefined) {
      return number * rightListOccurences[number];
    }

    return 0;
  })
  .reduce((acc, prev) => acc + prev, 0);

console.log(`Similarity score: ${similarityScore}`);

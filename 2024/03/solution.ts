import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

function calculateSumOfMultiplications(input: string): number {
  // Regular expression to match valid mul expressions (mul(X, Y) where X and Y are integers)
  const regex = /mul\((\d+),(\d+)\)/g;
  let match;
  let sum = 0;

  // Iterate over all matches
  while ((match = regex.exec(input)) !== null) {
    // Extract the numbers X and Y from the match
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);

    // Multiply and add the result to the sum
    sum += x * y;
  }

  return sum;
}
function calculateSumOfMultiplicationsWithConditions(input: string): number {
  let sum = 0;
  let isMulEnabled = true; // Initially, multiplication is enabled

  // Regular expression to match valid mul expressions (mul(X, Y) where X and Y are integers)
  const mulRegex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;
  let match;
  while ((match = mulRegex.exec(input)) !== null) {
    if (match[0] === "do()") {
      isMulEnabled = true;
    } else if (match[0] === "don't()") {
      isMulEnabled = false;
    } else {
      // Extract the numbers X and Y from the match
      const x = parseInt(match[1], 10);
      const y = parseInt(match[2], 10);

      //console.log("isMulEnabled", isMulEnabled, x, y);
      // Multiply and add the result to the sum
      if (isMulEnabled) {
        sum += x * y;
      }
    }
  }

  return sum;
}

console.log(calculateSumOfMultiplications(fileContents));
console.log(calculateSumOfMultiplicationsWithConditions(fileContents)); // Output: 48

import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./example.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

// Function to evaluate an expression given numbers and their corresponding operators
// const evaluateExpression = (numbers: number[], operators: string[]): number => 
//   numbers.reduce((acc, num, index) => 
//     index === 0 ? num : operators[index - 1] === "+" ? acc + num : acc * num, 0);

const evaluateExpression = (numbers: number[], operators: string[]): number => {
  return numbers.reduce((acc, num, index) => {
    if (index === 0) return num;
    switch (operators[index - 1]) {
      case "+":
        return acc + num;
      case "*":
        return acc * num;
      case "||":
        return parseInt(acc.toString() + num.toString());  // Concatenation of numbers
      default:
        return acc;
    }
  }, 0);
};


// Helper function to generate all combinations of operators
const product = (options: string[], length: number): string[][] => {
  const result: string[] = new Array(length);
  const indices: number[] = new Array(length).fill(0);
  const combinations: string[][] = [];

  while (true) {
    for (let i = 0; i < length; i++) {
      result[i] = options[indices[i]];
    }
    combinations.push([...result]);

    let i = length - 1;
    while (i >= 0 && indices[i] === options.length - 1) {
      indices[i] = 0;
      i--;
    }

    if (i < 0) break;
    indices[i]++;
  }

  return combinations;
};

// Main function to process the input and calculate the total of valid test values
const findValidEquations = (input: string[]): number => {
  return input.reduce((total, line) => {
    const [testValueStr, numbersStr] = line.split(": ");
    const testValue = parseInt(testValueStr);
    const numbers = numbersStr.split(" ").map(Number);

    // Generate all combinations of operators (+ and *)
    const operatorCombinations = product(["+", "*", "||"], numbers.length - 1);

    // Check if any combination matches the test value
    if (operatorCombinations.some(operators => evaluateExpression(numbers, operators) === testValue)) {
      total += testValue;
    }

    return total;
  }, 0);
};

// Example input
const input = fileContents
.trim()
.split("\n")
.map(String);

// Call the function and print the result
console.log(findValidEquations(input));  // Output should be 3749


import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./example.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

function countXmas(grid: string[]): number {
    
  const rows = grid.length;
  const cols = grid[0].length;
  const word = "XMAS";
  const wordLen = word.length;
  let count = 0;
  // Function to check if the word can be found in a specific direction
  function checkDirection(r: number, c: number, dr: number, dc: number): boolean {
      // Check if the word can fit in the given direction without going out of bounds
      if (r + (wordLen - 1) * dr >= 0 && r + (wordLen - 1) * dr < rows &&
          c + (wordLen - 1) * dc >= 0 && c + (wordLen - 1) * dc < cols) {
          for (let i = 0; i < wordLen; i++) {
              if (grid[r + i * dr][c + i * dc] !== word[i]) {
                  return false;
              }
          }
          return true;
      }
      return false;
  }

  // Loop through all cells in the grid
  for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
          // Check all 8 possible directions
          if (checkDirection(r, c, 0, 1)) count++;  // Horizontal right
          if (checkDirection(r, c, 1, 0)) count++;  // Vertical down
          if (checkDirection(r, c, 1, 1)) count++;  // Diagonal down-right
          if (checkDirection(r, c, -1, 1)) count++; // Diagonal up-right
          if (checkDirection(r, c, 0, -1)) count++; // Horizontal left
          if (checkDirection(r, c, -1, 0)) count++; // Vertical up
          if (checkDirection(r, c, -1, -1)) count++; // Diagonal up-left
          if (checkDirection(r, c, 1, -1)) count++; // Diagonal down-left
      }
  }

  return count;
}

// Example grid from the problem statement
const grid: string[] = fileContents
.trim()
.split("\n").map(String);

// Call the function and print the result
console.log(countXmas(grid)); // Expected output: 18


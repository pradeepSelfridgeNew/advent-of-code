import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });
function countXMas(grid: string[]): number {
    const rows = grid.length;
    const cols = grid[0].length;
    const word = "MAS";
    const reverseWord = "SAM";
    let count = 0;

    // Function to check if an X-MAS shape is formed starting at (r, c)
    function checkXMas(r: number, c: number): boolean {
        // Check bounds (ensuring we can form the full X-MAS shape)
        if (r + 2 < rows && c + 2 < cols) {
            // Extract positions forming the X-MAS
            const topLeft = grid[r][c];
            const topRight = grid[r][c + 2];
            const middle = grid[r + 1][c + 1];
            const bottomLeft = grid[r + 2][c];
            const bottomRight = grid[r + 2][c + 2];

            // Check if the positions form "MAS" (forward or backward)
            return (
                (topLeft === 'M' && middle === 'A' && topRight === 'S' && bottomLeft === 'M' && bottomRight === 'S') ||
                (topLeft === 'S' && middle === 'A' && topRight === 'M' && bottomLeft === 'S' && bottomRight === 'M') ||
                (topLeft === 'S' && middle === 'A' && topRight === 'S' && bottomLeft === 'M' && bottomRight === 'M') ||
                (topLeft === 'M' && middle === 'A' && topRight === 'M' && bottomLeft === 'S' && bottomRight === 'S')
            );
        }
        return false;
    }

    // Loop through all potential starting points in the grid
    for (let r = 0; r < rows - 2; r++) {
        for (let c = 0; c < cols - 2; c++) {
            if (checkXMas(r, c)) {
                count++;
            }
        }
    }

    return count;
}


// Example grid from the problem statement
const grid: string[] = fileContents
.trim()
.split("\n").map(String);

// Call the function and print the result
console.log(countXMas(grid)); // Expected output: 18


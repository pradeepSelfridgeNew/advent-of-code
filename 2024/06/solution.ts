import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./example.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

type Direction = 'up' | 'right' | 'down' | 'left';

const directions: Direction[] = ['up', 'right', 'down', 'left'];
const directionOffsets: { [key in Direction]: [number, number] } = {
  up: [-1, 0],
  right: [0, 1],
  down: [1, 0],
  left: [0, -1]
};

const turnRight = (currentDirection: Direction): Direction => {
  const currentIndex = directions.indexOf(currentDirection);
  return directions[(currentIndex + 1) % 4]; // Right turn = move one step clockwise
};

const simulateGuardPath = (map: string[]): number => {
  let rows = map.length;
  let cols = map[0].length;
  
  // Find the guard's initial position and direction
  let startX = -1;
  let startY = -1;
  let direction: Direction = 'up';

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = map[i][j];
      if (cell === '^') {
        startX = i;
        startY = j;
        direction = 'up';
        break;
      } else if (cell === '>') {
        startX = i;
        startY = j;
        direction = 'right';
        break;
      } else if (cell === 'v') {
        startX = i;
        startY = j;
        direction = 'down';
        break;
      } else if (cell === '<') {
        startX = i;
        startY = j;
        direction = 'left';
        break;
      }
    }
    if (startX !== -1) break;
  }

  let visitedPositions = new Set<string>();
  let x = startX;
  let y = startY;
  
  visitedPositions.add(`${x},${y}`); // Mark starting position

  while (true) {
    const [dx, dy] = directionOffsets[direction];
    const nextX = x + dx;
    const nextY = y + dy;

    // Check if next position is within bounds
    if (nextX < 0 || nextX >= rows || nextY < 0 || nextY >= cols) {
      break; // Guard leaves the area
    }

    // If the next position is an obstacle, turn right
    if (map[nextX][nextY] === '#') {
      direction = turnRight(direction);
    } else {
      // Otherwise, move forward
      x = nextX;
      y = nextY;
      visitedPositions.add(`${x},${y}`);
    }
  }

  return visitedPositions.size;
};

// Example input
const map = fileContents
.trim()
.split("\n");

console.log(simulateGuardPath(map)); // Output: 41

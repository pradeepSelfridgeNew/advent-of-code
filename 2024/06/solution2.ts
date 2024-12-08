import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
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

const simulateGuardPathWithObstacle = (map: string[], startX: number, startY: number, startDirection: Direction, obstacleX: number, obstacleY: number): boolean => {
  let rows = map.length;
  let cols = map[0].length;

  // Copy the map and place the new obstacle
  let modifiedMap = map.map(row => row.split(''));

  // Place the new obstacle
  modifiedMap[obstacleX][obstacleY] = '#';

  let x = startX;
  let y = startY;
  let direction = startDirection;

  let visitedPositions = new Set<string>();
  visitedPositions.add(`${x},${y},${direction}`); // Add initial position with direction to prevent loop

  while (true) {
    const [dx, dy] = directionOffsets[direction];
    const nextX = x + dx;
    const nextY = y + dy;

    // Check if next position is within bounds
    if (nextX < 0 || nextX >= rows || nextY < 0 || nextY >= cols) {
      return false; // Guard leaves the area, no loop
    }

    // If the next position is an obstacle, turn right
    if (modifiedMap[nextX][nextY] === '#') {
      direction = turnRight(direction);
    } else {
      // Otherwise, move forward
      x = nextX;
      y = nextY;

      // If the guard visits the same position with the same direction, we have a loop
      const positionKey = `${x},${y},${direction}`;
      if (visitedPositions.has(positionKey)) {
        return true; // Loop detected
      }

      visitedPositions.add(positionKey);
    }
  }
};

// Main function to determine the number of valid obstruction positions
const countValidObstructionPositions = (map: string[]): number => {
  let rows = map.length;
  let cols = map[0].length;
  
  let startX = -1;
  let startY = -1;
  let direction: Direction = 'up';

  // Find the guard's initial position and direction
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

  let validObstructionCount = 0;

  // Try placing a new obstacle at each position
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Skip the guard's starting position and existing obstacles
      if ((i === startX && j === startY) || map[i][j] === '#') {
        continue;
      }

      // Check if placing the obstacle causes the guard to get stuck in a loop
      if (simulateGuardPathWithObstacle(map, startX, startY, direction, i, j)) {
        validObstructionCount++;
      }
    }
  }

  return validObstructionCount;
};

// Example input
const map = fileContents
.trim()
.split("\n");

console.log(countValidObstructionPositions(map)); // Output: 6

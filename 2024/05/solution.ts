import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

// Example grid from the problem statement
const grid: string[] = fileContents
  .trim()
  .split("\n")
  .map(String)
  .filter((value: string) => value !== "");

type OrderingRule = string; // Represent the rule as a string like "47|53"
type Update = number[]; // List of page numbers in an update

const orderingRules: OrderingRule[] = grid.filter((value) =>
  value.includes("|")
);

const updates: Update[] = grid
  .filter((update) => update.includes(","))
  .map((val) => val.split(",").map(Number));

let invalidUpdates: Update[] = [];
// Validate if a given update is in the correct order based on the ordering rules
const validateUpdate = (
  orderingRules: OrderingRule[],
  update: Update
): boolean => {
  const graph: Map<number, number[]> = new Map();
  const inDegree: Map<number, number> = new Map();

  // Parse the ordering rules into a directed graph
  orderingRules.forEach((rule) => {
    const [x, y] = rule.split("|").map(Number);
    if (!graph.has(x)) graph.set(x, []);
    graph.get(x)!.push(y);
    inDegree.set(y, (inDegree.get(y) || 0) + 1);
    if (!inDegree.has(x)) inDegree.set(x, 0);
  });

  // Perform topological sorting based on the current update
  const updateSet = new Set(update);
  const filteredGraph: Map<number, number[]> = new Map();
  const filteredInDegree: Map<number, number> = new Map();

  // Filter the graph and in-degree for only the pages in the current update
  updateSet.forEach((page) => {
    filteredGraph.set(page, []);
    filteredInDegree.set(page, 0);
  });

  updateSet.forEach((page) => {
    graph.get(page)?.forEach((neighbor) => {
      if (updateSet.has(neighbor)) {
        filteredGraph.get(page)!.push(neighbor);
        filteredInDegree.set(
          neighbor,
          (filteredInDegree.get(neighbor) || 0) + 1
        );
      }
    });
  });

  // Topological sorting using Kahn's algorithm
  const queue: number[] = [];
  filteredInDegree.forEach((deg, page) => {
    if (deg === 0) queue.push(page);
  });

  const sortedPages: number[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sortedPages.push(current);
    filteredGraph.get(current)?.forEach((neighbor) => {
      filteredInDegree.set(neighbor, filteredInDegree.get(neighbor)! - 1);
      if (filteredInDegree.get(neighbor) === 0) queue.push(neighbor);
    });
  }
  if (JSON.stringify(sortedPages) !== JSON.stringify(update)) {
    invalidUpdates.push(sortedPages);
  }

  // If the sorted pages match the update order, it's valid
  return JSON.stringify(sortedPages) === JSON.stringify(update);
};

// Find the middle page in an update
const middlePage = (update: Update): number => {
  return update[Math.floor(update.length / 2)];
};

// Solve the puzzle
const calcMiddleNumber = (
  orderingRules: OrderingRule[],
  updates: Update[]
): number => {
  let validUpdates: Update[] = [];

  updates.forEach((update) => {
    if (validateUpdate(orderingRules, update)) {
      validUpdates.push(update);
    }
  });

  // Sum the middle page numbers of all valid updates
  return validUpdates.reduce((sum, update) => sum + middlePage(update), 0);
};
const calcMiddleNumberforIncorrectUpdate = (
  orderingRules: OrderingRule[],
  updates: Update[]
): number => {
  updates.forEach((update) => {
    validateUpdate(orderingRules, update);
  });

  // Sum the middle page numbers of all valid updates
  return invalidUpdates.reduce((sum, update) => sum + middlePage(update), 0);
};
const result = calcMiddleNumber(orderingRules, updates);
console.log(result); // Output should be the sum of the middle page numbers of valid updates.

const result2 = calcMiddleNumberforIncorrectUpdate(orderingRules, updates);
console.log(result2);

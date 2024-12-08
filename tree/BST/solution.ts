class TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
  
    constructor(value: number) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  
  class BinarySearchTree {
    root: TreeNode | null;
  
    constructor() {
      this.root = null;
    }
  
    // Insert a new value into the BST
    insert(value: number): void {
      const newNode = new TreeNode(value);
      if (this.root === null) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
    }
  
    private insertNode(node: TreeNode, newNode: TreeNode): void {
      if (newNode.value < node.value) {
        // Insert into left subtree
        if (node.left === null) {
          node.left = newNode;
        } else {
          this.insertNode(node.left, newNode);
        }
      } else {
        // Insert into right subtree
        if (node.right === null) {
          node.right = newNode;
        } else {
          this.insertNode(node.right, newNode);
        }
      }
    }
  
    // Search for a value in the BST
    search(value: number): boolean {
      return this.searchNode(this.root, value);
    }
  
    private searchNode(node: TreeNode | null, value: number): boolean {
      // Base case: node is null (value not found) or value matches node's value
      if (node === null) {
        return false; // Not found
      }
      if (value === node.value) {
        return true; // Found the value
      }
  
      // Recursively search the left or right subtree
      if (value < node.value) {
        return this.searchNode(node.left, value); // Search left
      } else {
        return this.searchNode(node.right, value); // Search right
      }
    }
  }
  
  // Example usage:
  
  const bst = new BinarySearchTree();
  
  // Insert values into the BST
  bst.insert(50);
  bst.insert(30);
  bst.insert(70);
  bst.insert(20);
  bst.insert(40);
  bst.insert(60);
  bst.insert(80);
  
  // Search for values
  console.log("Search 60:", bst.search(60)); // Output: true
  console.log("Search 25:", bst.search(25)); // Output: true
  console.log("Search 100:", bst.search(100)); // Output: false
  
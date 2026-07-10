export function isValidSudoku(board) {
  const rows = new Array(9).fill(null).map(() => new Set());
  const columns = new Array(9).fill(null).map(() => new Set());
  const boxes = new Array(9).fill(null).map(() => new Set());

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellValue = board[row][col];
      if (cellValue !== 0) {
        if (
          rows[row].has(cellValue) ||
          columns[col].has(cellValue) ||
          boxes[3 * Math.floor(row / 3) + Math.floor(col / 3)].has(cellValue)
        ) {
          return false;
        }
        rows[row].add(cellValue);
        columns[col].add(cellValue);
        boxes[3 * Math.floor(row / 3) + Math.floor(col / 3)].add(cellValue);
      }
    }
  }

  return true;
}
  

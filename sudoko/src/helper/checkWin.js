export function checkWin(grid){
    const isValid = (arr) => {
      const set = new Set();
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0 && set.has(arr[i])) {
          return false;
        }
        set.add(arr[i]);
      }
      return true;
    };
  
    // Check rows
    for (let i = 0; i < 9; i++) {
      if (!isValid(grid[i])) {
        return false;
      }
    }
  
    // Check columns
    for (let j = 0; j < 9; j++) {
      const column = [];
      for (let i = 0; i < 9; i++) {
        column.push(grid[i][j]);
      }
      if (!isValid(column)) {
        return false;
      }
    }
  
    // Check subgrids
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const subgrid = [];
        for (let k = i; k < i + 3; k++) {
          for (let l = j; l < j + 3; l++) {
            subgrid.push(grid[k][l]);
          }
        }
        if (!isValid(subgrid)) {
          return false;
        }
      }
    }
  
    return true;
  };
  
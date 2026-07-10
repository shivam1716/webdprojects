function generateSudokuGrid(emptyCells) {
  let grid = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = new Array(9).fill(0);
  }

  solve(grid)
  removeCells(grid, emptyCells);
  return grid;
}

function isSafe(row, col, board, val){
    for(let i=0; i<9; i++){
        if(board[i][col] === val)
            return false;
        if(board[row][i] === val)
            return false;
        
        if(board[3*Math.floor(row/3) + Math.floor(i/3)][3*Math.floor(col/3) + i%3] === val)
            return false;
    }
    return true;
}

function solve(board){
    for(let row=0; row<9; row++){
        for (let col = 0; col < 9; col++){
            if(board[row][col] === 0){
                let order = getRandomOrder();
                for(let i=0; i<order.length; i++){
                    let val = order[i];
                    if(isSafe(row, col, board, val)){
                        board[row][col] = val;
                        if(solve(board))
                            return true;
                        else{
                            board[row][col] = 0;
                        }    
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function getRandomOrder() {
  let order = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = order.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function removeCells(grid, emptyCells) {
  while (emptyCells > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      emptyCells--;
    }
  }
}

function newGame(numEmptyCells) {
    const sudokuGrid = generateSudokuGrid(numEmptyCells);
    const difficulty = {
      40: 'Easy',
      50: 'Medium',
      60: 'Hard',
    };

    return {actualBoard:sudokuGrid, currentBoard:sudokuGrid, difficulty:difficulty[numEmptyCells] ,gameWon:false, selectedCell:null, isCustomBoard:false}
}



export {solve, newGame};


import React, { useContext, useEffect, useRef } from 'react'
import { BoardContext } from '../context/boardContext';
import Cell from './Cell'
import {checkWin} from '../helper/checkWin'

const Board = () => {
  let { state, setSelectedCell, setCellValue, setCustomBoard, setGameWon } = useContext(BoardContext);
  const cellRef = useRef(null)
  const {actualBoard, currentBoard, gameWon, selectedCell, isCustomBoard} = state;

  
  useEffect(() => {
    const isFilled = currentBoard.every((row) => row.every((cell) => cell !== 0));
    if(isFilled && checkWin(currentBoard)){
      setGameWon()
    }
  }, [currentBoard, setGameWon])

  const handleCellClick = (row, col) => {
    if(!gameWon) setSelectedCell( {row, col} );
  };

  const handleKeyPress = (event) => {
    if (selectedCell === undefined || gameWon) {
      return;
    }

    let { key } = event;
    let { row, col } = selectedCell;
    let n = currentBoard.length - 1; 

    // change selected cell
    if(event.keyCode>=37 && event.keyCode<=40){
      let direction = event.keyCode - 37;
      
      if(direction === 0) (col===0)?col=n:col--;
      else if(direction === 1) (row===0)?row=n:row--;
      else if(direction === 2) (col===n)?col=0:col++;
      else if(direction === 3) (row===n)?row=0:row++;
      setSelectedCell({row, col})
    }

    // prevent changing the original board
    if (!isCustomBoard  && actualBoard[row][col] !== 0) {
      return;
    }
    
    if (event.keyCode === 8 || (key >= '1' && key <= '9')) {
      if(currentBoard[row][col] === parseInt(key)) key='-'; //remove the value if same key is pressed
      if(isCustomBoard) setCustomBoard(key);
      else setCellValue(row, col, key);
    }
  };

  const cells = currentBoard.map((row,rowIndex) => {
      const rowCells = row.map((value, colIndex) => {
        const isSelected= selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
        const isSelectedRow = rowIndex === selectedCell?.row;
        const isSelectedColumn = colIndex === selectedCell?.col;
        const disabled= (isCustomBoard && value !== 0) || actualBoard[rowIndex][colIndex] !== 0
        let classArray = ['cell']
      
        if(isSelected) classArray.push('selected-cell')
        if(disabled) classArray.push('disabled')
        if(isSelectedRow || isSelectedColumn ) classArray.push('selected')
        {
          const row = selectedCell?.row
          const col = selectedCell?.col
          if( !!value && selectedCell !== null && value === currentBoard[row][col]) classArray.push('same-value')
        }
      
        const cell = (
          <Cell 
            key={rowIndex + '' + colIndex} 
            row={rowIndex}
            col={colIndex}
            value={value}
            className={classArray.join(' ')}
            onClick = {() => handleCellClick(rowIndex, colIndex)}
            ref = {cellRef}
          />
        );

        return cell;
      })

      return (
        <div key={rowIndex} className='row'>
          {rowCells}
        </div>
      )
  })

  return(
    <div className="board" onKeyDown={handleKeyPress} tabIndex={0}>
        {cells}
    </div>
  )
}

export default Board
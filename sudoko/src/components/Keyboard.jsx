import React, { useContext} from 'react'
import { BoardContext } from '../context/boardContext';
import { BsFillEraserFill } from 'react-icons/bs' 

const Keyboard = () => {

  const {state, setCellValue, setCustomBoard} = useContext(BoardContext)
  const {actualBoard, currentBoard, gameWon, selectedCell, isCustomBoard} = state;

  const handleKeyClick = (value) => {
    let {row, col} = selectedCell || {};
    if(currentBoard[row][col] === value) value='-'; // Remove the value if its already same
    if(row !== undefined && isCustomBoard) setCustomBoard(value);
    else if (actualBoard[row][col] === 0) setCellValue(row, col, value); // prevent from modifying the actual board
  };

  return (
    <div className={`keyboard ${gameWon?'gameWon':''}`}>
        {[1,2,3,4,5,6,7,8,9,<BsFillEraserFill />].map(value => (
            <div key={value} className='keys flex-box' onClick={() => handleKeyClick(value)}>{value}</div>
        )) }
    </div>
  )
}

export default Keyboard
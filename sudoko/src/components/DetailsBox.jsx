import React, { useContext, useState } from 'react'
import NewGameModal from './NewGameModal';
import { BoardContext } from '../context/boardContext';
import Timer from './Timer';
import { solve } from '../helper/solver';
import { isValidSudoku } from '../helper/checkValid';

const DetailsBox = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false)
  const {state, setSolvedBoard, handleFinishEntering} = useContext(BoardContext)

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function solveSudoku(){
      let newBoard = state.actualBoard.map((row) => [...row]);
      solve(newBoard);
      setSolvedBoard(newBoard);
  };

  function handleSubmit(){
    if(isValidSudoku(state.actualBoard)) handleFinishEntering();
    else{
      setShowError(true);
      setTimeout(() => {
        setShowError(false)
      }, 3000);
    } 
  }
    

  return (
    <div className="detail-box flex-box">
        <div className='button' onClick={() => setIsModalOpen(true)}>New Game</div>
        
        {isModalOpen && (
          <div className="overlay">
            <NewGameModal
              onClose={handleCloseModal}
              showModal={isModalOpen}
            />
          </div>
        )}  
        {!state.isCustomBoard && !state.gameWon && <div className='button' onClick={solveSudoku}>Solve</div>}
        {state.isCustomBoard && <div className='button' onClick={handleSubmit}>Submit</div>}
        {!state.isCustomBoard && <Timer /> }
        {showError && <div className='valid-error-modal flex-box'>Not a valid sudoku</div>}
        <span className='dificulty-level'>{state.difficulty}</span>
    </div>
  )
}

export default DetailsBox
import React, { useContext } from 'react';
import { BoardContext } from '../context/boardContext';

const NewGameModal = ({ onClose, showModal }) => {

  let {setNewGame, newCustomGame} = useContext(BoardContext)

  const handleNewGame = (numEmptyCells) => {
      setNewGame(numEmptyCells);
      onClose();
  }; 

  return (
    <div className={`modal ${showModal ? 'modal-show' : ''}`}>
      <div className="modal-content">
        <h2 className='text'>New Game Options</h2>
        <div className="dificulty-buttons">
          <button className='button' onClick={() => handleNewGame(40)}>Easy</button>
          <button className='button' onClick={() => handleNewGame(50)}>Medium</button>
          <button className='button' onClick={() => handleNewGame(60)}>Hard</button>
        </div>
        <button className='button' onClick={() => {newCustomGame(); onClose()}}>Set Custom Board</button>
        <button className='cancel-button' onClick={onClose}>x</button>
      </div>
    </div>
  );
};

export default NewGameModal;

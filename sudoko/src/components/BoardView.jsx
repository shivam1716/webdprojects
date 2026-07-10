import React from 'react'
import DetailsBox from './DetailsBox';
import Keyboard from './Keyboard';
import Board from './Board';

const BoardView = () => {

  return (
    <div className='game'>
      <DetailsBox />
      <Board />
      <Keyboard />
    </div>
    )
}

export default BoardView
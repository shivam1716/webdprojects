import React from 'react';
import DetailsBox from './DetailsBox';
import Keyboard from './Keyboard';
import Board from './Board';

const BoardView = () => (
  <main className="game-shell">
    <div className="game-heading"><span>Game in progress</span><h1>Stay sharp. Keep solving.</h1></div>
    <div className="game">
      <div className="board-area"><Board /></div>
      <div className="control-area"><Keyboard /><DetailsBox /></div>
    </div>
  </main>
);

export default BoardView;

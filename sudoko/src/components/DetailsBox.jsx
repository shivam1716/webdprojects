import React, { useContext, useMemo, useState } from 'react';
import { FiFlag, FiPause, FiPlay, FiPlus, FiRotateCcw, FiZap } from 'react-icons/fi';
import NewGameModal from './NewGameModal';
import { BoardContext } from '../context/boardContext';
import Timer from './Timer';
import { solve } from '../helper/solver';
import { isValidSudoku } from '../helper/checkValid';

const DetailsBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const { state, setSolvedBoard, handleFinishEntering, togglePause } = useContext(BoardContext);

  const progress = useMemo(() => {
    const filled = state.currentBoard.flat().filter(Boolean).length;
    return Math.round((filled / 81) * 100);
  }, [state.currentBoard]);

  function solveSudoku() {
    const newBoard = state.actualBoard.map((row) => [...row]);
    solve(newBoard);
    setSolvedBoard(newBoard);
  }

  function handleSubmit() {
    if (isValidSudoku(state.actualBoard)) handleFinishEntering();
    else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }

  return (
    <aside className="detail-box">
      <div className="panel-heading">
        <span className="eyebrow">Today’s puzzle</span>
        <h2>{state.difficulty} mode</h2>
        <p>Stay focused. Every square gets you closer.</p>
      </div>

      <div className="live-stats">
        {!state.isCustomBoard && !state.gameWon && <Timer />}
        <div className="stat-card">
          <div className="stat-label">Progress</div>
          <div className="stat-value">{progress}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mistakes</div>
          <div className="stat-value">{state.mistakes}<span>/ ∞</span></div>
        </div>
      </div>

      <div className="progress-track" aria-label={`${progress}% complete`}><span style={{ width: `${progress}%` }} /></div>

      <div className="action-list">
        <button className="button button-primary" onClick={() => setIsModalOpen(true)}><FiPlus /> New puzzle</button>
        {!state.isCustomBoard && !state.gameWon && <button className="button button-quiet" onClick={togglePause}>{state.isPaused ? <FiPlay /> : <FiPause />}{state.isPaused ? 'Resume game' : 'Pause game'}</button>}
        {!state.isCustomBoard && !state.gameWon && <button className="button button-quiet" onClick={solveSudoku}><FiZap /> Reveal solution</button>}
        {state.isCustomBoard && <button className="button button-primary" onClick={handleSubmit}><FiFlag /> Check board</button>}
        {state.gameWon && <button className="button button-primary" onClick={() => setIsModalOpen(true)}><FiRotateCcw /> Play again</button>}
      </div>

      {isModalOpen && <div className="overlay"><NewGameModal onClose={() => setIsModalOpen(false)} showModal={isModalOpen} /></div>}
      {showError && <div className="valid-error-modal">That board has a conflict. Check the duplicates and try again.</div>}
    </aside>
  );
};

export default DetailsBox;

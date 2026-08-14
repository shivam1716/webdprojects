import React, { useContext, useState } from 'react';
import { FiAward, FiPlay, FiStar, FiTarget } from 'react-icons/fi';
import { BoardContext } from '../context/boardContext';

const levels = [{ label: 'Easy', cells: 40 }, { label: 'Medium', cells: 50 }, { label: 'Hard', cells: 60 }, { label: 'Expert', cells: 64 }];

const Landing = ({ onStart }) => {
  const [level, setLevel] = useState(levels[0]);
  const { setNewGame } = useContext(BoardContext);
  const start = () => { setNewGame(level.cells); onStart(); };

  return <main className="landing-page">
    <section className="hero-copy">
      <p className="hero-kicker">Classic puzzle. Modern focus.</p>
      <h1>Sharpen your mind with <em>Sudoku</em></h1>
      <p className="hero-description">A calm, distraction-free Sudoku experience. Pick a challenge and start solving at your own pace.</p>
      <div className="difficulty-switcher">
        {levels.map((item) => <button key={item.label} className={level.label === item.label ? 'selected' : ''} onClick={() => setLevel(item)}>{item.label}</button>)}
      </div>
      <button className="start-button" onClick={start}><FiPlay /> New Game</button>
    </section>
    <section className="landing-stats">
      <div><FiStar /><span>Games Played</span><strong>12</strong></div>
      <div><FiAward /><span>Games Won</span><strong>8</strong></div>
      <div><FiTarget /><span>Win Rate</span><strong>66.7%</strong></div>
    </section>
    <footer>Made with <b>♥</b> by Shivam Singh</footer>
  </main>;
};
export default Landing;

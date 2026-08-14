import { useState } from 'react';
import BoardView from './components/BoardView';
import Navbar from './components/Navbar';
import BoardState from './context/BoardState';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';

function App() {
  const [screen, setScreen] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={`app-shell ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <BoardState>
        <Navbar screen={screen} setScreen={setScreen} darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className='App'>
          {screen === 'home' && <Landing onStart={() => setScreen('game')} />}
          {screen === 'game' && <BoardView />}
          {screen === 'stats' && <Dashboard />}
        </div>
      </BoardState>
    </div>
  );
}

export default App;

import BoardView from './components/BoardView';
import Navbar from './components/Navbar';
import BoardState from './context/BoardState';

function App() {
  return (
    <>
    <Navbar />
    <div className='App'>
      <BoardState>
        <BoardView />
      </BoardState>
    </div>
    </>
  );
}

export default App;

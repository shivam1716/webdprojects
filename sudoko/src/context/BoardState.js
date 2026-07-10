import { useReducer } from 'react';
import { BoardContext } from './boardContext'
import produce from 'immer'
import { newGame } from '../helper/solver';

const BoardState = (props) => {

    const initialState = newGame(40);

    // Define the Sudoku reducer
    const SudokuReducer = (state, action) => {
      switch (action.type) {

        case 'SET_NEW_GAME':
          return produce(state, (draft) => {
            const newBoard = newGame(action.payload);
            draft.actualBoard = newBoard.actualBoard;
            draft.currentBoard = newBoard.currentBoard;
            draft.gameWon = newBoard.gameWon;
            draft.selectedCell = newBoard.selectedCell;
            draft.isCustomBoard = newBoard.isCustomBoard;
            draft.difficulty = newBoard.difficulty;
          });

        case 'SET_SELECTED_CELL':
          return produce(state, (draft) => {
            draft.selectedCell = action.payload;
          });
          
        case 'SET_CELL_VALUE':
          return produce(state, (draft) => {
            const { row, col, value } = action.payload;
            draft.currentBoard[row][col] = parseInt(value) || 0;
          });

        case 'NEW_CUSTOM_GAME':
          return produce(state, (draft) => {
            draft.gameWon = false;
            draft.isCustomBoard = true;
            draft.actualBoard = action.payload;
            draft.currentBoard = action.payload;
            draft.difficulty = 'Custom';
          });

        case 'SET_CUSTOM_BOARD':
          return produce(state, (draft) => {
            draft.actualBoard[state.selectedCell.row][state.selectedCell.col] = parseInt(action.payload) || 0;
            draft.currentBoard[state.selectedCell.row][state.selectedCell.col] = parseInt(action.payload) || 0;
          });  
                  
        case 'FINISH_ENTERING':
          return produce(state, (draft) => {
            draft.isCustomBoard = false;
          });

        case 'SET_SOLVED_BOARD':
          return produce(state, (draft) => {
            draft.selectedCell = null;
            draft.currentBoard = action.payload;
            draft.gameWon = true;
          });  
        
        case 'SET_GAME_WON':
          return produce(state, (draft) => {
            draft.gameWon = true;
          });  

        default:
          return state;
      }
    };

    const setNewGame = (emptyCell) => {
      dispatch({ type: 'SET_NEW_GAME', payload: emptyCell});
    };

    const setSelectedCell = (cell) => {
      dispatch({ type: 'SET_SELECTED_CELL', payload: cell });
    };    

    const setCellValue = (row, col, value) => {
      dispatch({ type: 'SET_CELL_VALUE', payload: { row, col, value } });
    };

    const newCustomGame = () => {
      let clearBoard = Array(9).fill(Array(9).fill(0));
      dispatch({ type: 'NEW_CUSTOM_GAME', payload: clearBoard });
    };

    const setCustomBoard = (key) => {
      dispatch({ type: 'SET_CUSTOM_BOARD', payload: key});
    };
    
    const handleFinishEntering = () => {
        dispatch({ type: 'FINISH_ENTERING' });
    };

    const setSolvedBoard = (board) => {
      dispatch({ type: 'SET_SOLVED_BOARD', payload: board});
    };

    const setGameWon = () => {
      dispatch({ type: 'SET_GAME_WON'});
    };

    const [state, dispatch] = useReducer(SudokuReducer, initialState)

  return (
    <BoardContext.Provider value={{state, setNewGame, setSelectedCell, setCellValue, newCustomGame, setCustomBoard, handleFinishEntering, setSolvedBoard, setGameWon}}>
        {props.children}
    </BoardContext.Provider>
  )
}

export default BoardState
import React, { useContext, useEffect, useState } from 'react'
import { BoardContext } from '../context/boardContext'

const Timer = () => {
  let {state} = useContext(BoardContext)
  const [currentTime, setCurrentTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)

  useEffect(() => {
    let timer 
    if (isTimerRunning) {
        timer = setInterval(() => {
          setCurrentTime(prevTime => prevTime + 1);
        }, 1000);
      }
    return () => { clearInterval(timer); };
  }, [setCurrentTime, isTimerRunning]);

  useEffect(() => {
    if (state.gameWon) {
      setIsTimerRunning(false);
    } else {
      setCurrentTime(0);
      setIsTimerRunning(true);
    }
  }, [state.gameWon, state.actualBoard])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='time-box'>
      <div className='time-header'>Time</div>
      <div>
      {formatTime(currentTime)}
      </div>
    </div>
  );

}

export default Timer
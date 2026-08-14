import React from 'react';
import { FiArrowLeft, FiBarChart2, FiGrid, FiSettings, FiSun } from 'react-icons/fi';

const Navbar = ({ screen, setScreen, darkMode, setDarkMode }) => (
  <header className="navbar">
    <button className="brand" onClick={() => setScreen('home')}><FiGrid /><span>Sudoku</span></button>
    <nav className="navLinks">
      {screen !== 'home' && <button className="icon-button back-button" aria-label="Back to home" onClick={() => setScreen('home')}><FiArrowLeft /></button>}
      <button className={`icon-button ${!darkMode ? 'active' : ''}`} aria-label="Toggle colour theme" onClick={() => setDarkMode(!darkMode)}><FiSun /></button>
      <button className={`icon-button ${screen === 'stats' ? 'active' : ''}`} aria-label="View statistics" onClick={() => setScreen('stats')}><FiBarChart2 /></button>
      <button className="icon-button" aria-label="Settings"><FiSettings /></button>
    </nav>
  </header>
);

export default Navbar;

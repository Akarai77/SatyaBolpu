import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50
        cursor-pointer hover:scale-105 shadow-lg"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-all duration-300 shadow-md
          ${theme === 'dark' 
            ? 'left-1 bg-primary translate-x-0' 
            : 'left-8 bg-yellow-400 translate-x-0'
          }`}
      />
      <span className="absolute inset-0 flex items-center justify-between px-2">
        <FaMoon className={`w-3 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-40'}`} />
        <FaSun className={`w-3.5 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-40' : 'opacity-100'}`} />
      </span>
    </button>
  );
};

export default ThemeToggle;

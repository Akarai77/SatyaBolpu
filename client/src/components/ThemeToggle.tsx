import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa6';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-800 dark:bg-gray-200 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary
        cursor-pointer"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-0' : 'translate-x-6'
        } shadow-md bg-white dark:bg-black`}
      />
      <span className="absolute inset-0 flex items-center justify-between px-1.5">
        <FaMoon className="w-2.5 fill-primary" />
        <FaSun className="w-3 fill-primary" />
      </span>
    </button>
  );
};

export default ThemeToggle;

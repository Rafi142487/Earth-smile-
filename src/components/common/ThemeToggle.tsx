import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('earthsmile_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      try {
        localStorage.setItem('earthsmile_theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('earthsmile_theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? 'Switch to light mode (Shortcut: D)' : 'Switch to dark mode (Shortcut: D)'}
      title={isDark ? 'Switch to light mode (Shortcut: D)' : 'Switch to dark mode (Shortcut: D)'}
      className={`p-2 rounded-lg text-[#556059] dark:text-[#A7D3B5] hover:text-[#192E22] dark:hover:text-white bg-[#F3F2EB] dark:bg-[#1E3326] hover:bg-[#EBE9E0] dark:hover:bg-[#274432] border border-[#DDD9CE] dark:border-[#2C4A37] transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#DE9B5E] animate-in rotate-90 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-[#192E22] animate-in -rotate-90 duration-200" />
      )}
    </button>
  );
};

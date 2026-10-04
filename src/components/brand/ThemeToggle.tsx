import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  className?: string;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggleTheme,
  className = '',
  compact = true
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggleTheme}
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-lg border transition-all text-xs font-mono select-none ${
        isDark
          ? 'bg-[#181715] text-[#E8D89A] border-[#38352F] hover:bg-[#24221E]'
          : 'bg-[#FAF7F0] text-[#5C5549] border-[#DDD4C0] hover:bg-[#EAE2D0]'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode (Warm Ivory)' : 'Switch to Dark Mode (Deep Charcoal)'}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={15} className="text-[#E8D89A] transition-transform hover:rotate-45" />
      ) : (
        <Moon size={15} className="text-[#5C5549] transition-transform hover:-rotate-12" />
      )}
      {!compact && (
        <span className="text-[11px] font-medium hidden sm:inline">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

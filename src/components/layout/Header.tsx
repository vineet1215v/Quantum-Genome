import React from 'react';
import { CURRENT_EXPERIMENT } from '../../data/mockData';
import { Eye, Bell } from 'lucide-react';
import { ThemeToggle } from '../brand/ThemeToggle';
import { ThemeMode } from '../../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onSelectExperimentModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  reducedMotion,
  onToggleReducedMotion,
  onSelectExperimentModal
}) => {
  return (
    <header className="h-14 px-6 border-b border-[#DDD4C0] bg-[#FAF7F0] flex items-center justify-between z-20 shrink-0 select-none transition-colors">
      {/* Left: Clean, minimal brand breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="font-serif-sc text-base font-semibold text-[#181715] tracking-wide">
          QuantumGen
        </span>
        <span className="text-xs text-[#DDD4C0] font-mono">/</span>
        <span className="text-xs font-mono text-[#8C734B]">
          Workspace
        </span>
      </div>

      {/* Center: Minimal Active Experiment Indicator */}
      <button
        onClick={onSelectExperimentModal}
        className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DC]/70 hover:bg-[#EAE2D0] border border-[#DDD4C0] transition-colors text-xs font-mono group"
        title="Active Experiment — Click to switch"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B48] animate-pulse" />
        <span className="font-semibold text-[#181715]">{CURRENT_EXPERIMENT.id}</span>
      </button>

      {/* Right: Subtle Status Dots & Controls */}
      <div className="flex items-center gap-3.5 text-xs font-mono">
        {/* Subtle Engine Status Dots */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#5C5549]">
          <span className="flex items-center gap-1.5" title="Classical Engine Online">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B48]" />
            <span>Classical</span>
          </span>
          <span className="flex items-center gap-1.5" title="Quantum Simulator Ready">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A4A]" />
            <span>Simulator</span>
          </span>
        </div>

        {/* Dark / Light Theme Mode Toggle */}
        <ThemeToggle 
          theme={theme} 
          onToggleTheme={onToggleTheme} 
          compact={true} 
        />

        {/* Minimal Motion Toggle */}
        <button
          onClick={onToggleReducedMotion}
          title={reducedMotion ? 'Reduced Motion: ON' : 'Motion: Full (Click to reduce motion)'}
          className={`p-1.5 rounded-lg border text-xs transition-colors ${
            reducedMotion 
              ? 'bg-[#B46927]/15 text-[#B46927] border-[#B46927]/40' 
              : 'text-[#8C734B] hover:text-[#181715] border-transparent hover:border-[#DDD4C0]'
          }`}
        >
          <Eye size={14} />
        </button>

        {/* Notifications & Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#DDD4C0]">
          <button 
            className="p-1 rounded-md hover:bg-[#EAE2D0] text-[#8C734B] hover:text-[#181715] transition-colors relative"
            title="Notifications"
          >
            <Bell size={14} />
          </button>
          
          <div 
            className="w-7 h-7 rounded-full bg-[#181715] text-[#E8D89A] flex items-center justify-center font-mono text-[10px] font-bold border border-[#B89A4A]/30 shadow-xs"
            title="Researcher Account"
          >
            QG
          </div>
        </div>
      </div>
    </header>
  );
};

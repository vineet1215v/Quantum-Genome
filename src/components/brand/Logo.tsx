import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  theme?: 'dark' | 'light' | 'auto';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  theme = 'auto'
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 60
  };

  const titleSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
    xl: 'text-3xl font-bold tracking-tight'
  };

  const dim = iconSizes[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Scientific Mark: Intertwined DNA strands forming quantum circuit junctions */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-lg p-1.5 transition-all duration-300"
        style={{
          width: dim + 12,
          height: dim + 12,
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #181715 0%, #11110F 100%)' 
            : 'linear-gradient(135deg, #F0E8D5 0%, #E2D7BE 100%)',
          border: theme === 'dark' ? '1px solid #38352F' : '1px solid #C9BA9B',
          boxShadow: theme === 'dark' 
            ? '0 2px 8px rgba(0,0,0,0.6)' 
            : '0 2px 6px rgba(184, 154, 74, 0.15)'
        }}
      >
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle quantum state grid lines */}
          <line x1="8" y1="14" x2="40" y2="14" stroke="#B89A4A" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="8" y1="24" x2="40" y2="24" stroke="#B89A4A" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="8" y1="34" x2="40" y2="34" stroke="#B89A4A" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />

          {/* DNA-Quantum Helix Strand 1 (Gold/Champagne) */}
          <path
            d="M 10 14 C 18 14, 22 34, 30 34 C 34 34, 38 24, 40 24"
            stroke="#B89A4A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* DNA-Quantum Helix Strand 2 (Bronze/Charcoal) */}
          <path
            d="M 10 34 C 18 34, 22 14, 30 14 C 34 14, 38 24, 40 24"
            stroke={theme === 'dark' ? '#E8D89A' : '#38352F'}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Entangled Quantum Circuit Coupling (controlled gate line) */}
          <line x1="20" y1="21" x2="20" y2="27" stroke="#B89A4A" strokeWidth="2" />
          <line x1="30" y1="14" x2="30" y2="34" stroke="#B89A4A" strokeWidth="1.5" />

          {/* Qubit Nodes */}
          <circle cx="10" cy="14" r="3" fill="#B89A4A" />
          <circle cx="10" cy="34" r="3" fill={theme === 'dark' ? '#E8D89A' : '#181715'} />
          
          <circle cx="20" cy="24" r="2.5" fill="#E8D89A" />
          
          <circle cx="30" cy="14" r="3.5" fill="#B89A4A" stroke={theme === 'dark' ? '#11110F' : '#FAF7F0'} strokeWidth="1.5" />
          <circle cx="30" cy="34" r="3.5" fill={theme === 'dark' ? '#E8D89A' : '#24221E'} stroke={theme === 'dark' ? '#11110F' : '#FAF7F0'} strokeWidth="1.5" />
          
          <circle cx="40" cy="24" r="4" fill="#B89A4A" />
          <circle cx="40" cy="24" r="1.5" fill="#FAF7F0" />
        </svg>
      </div>

      <div>
        <div className={`font-serif-sc tracking-wide flex items-center gap-1.5 ${titleSizes[size]} ${
          theme === 'dark' ? 'text-[#FAF7F0]' : 'text-[#181715]'
        }`}>
          <span>QuantumGen</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-widest bg-[#E8D89A]/30 text-[#8C734B] border border-[#B89A4A]/40 font-normal">
            QG-Bio
          </span>
        </div>
        {showSubtitle && (
          <div className="text-[11px] font-mono tracking-wider text-[#8C734B] uppercase">
            Accelerated Genomic Analysis
          </div>
        )}
      </div>
    </div>
  );
};

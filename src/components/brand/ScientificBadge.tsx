import React from 'react';
import { ScientificStatus } from '../../types';

interface ScientificBadgeProps {
  status: ScientificStatus;
  detail?: string;
  className?: string;
}

export const ScientificBadge: React.FC<ScientificBadgeProps> = ({
  status,
  detail,
  className = ''
}) => {
  const configs: Record<ScientificStatus, { label: string; desc: string; bg: string; text: string; border: string }> = {
    EXPERIMENTAL: {
      label: 'EXPERIMENTAL',
      desc: 'Empirically measured benchmark data collected on computational runs',
      bg: 'bg-[#2E6B48]/10',
      text: 'text-[#2E6B48]',
      border: 'border-[#2E6B48]/30'
    },
    SIMULATED: {
      label: 'SIMULATED',
      desc: 'Executed via statevector/density matrix quantum simulator',
      bg: 'bg-[#B89A4A]/15',
      text: 'text-[#8C734B]',
      border: 'border-[#B89A4A]/40'
    },
    THEORETICAL: {
      label: 'THEORETICAL',
      desc: 'Algorithmic complexity derivation and bounds projection',
      bg: 'bg-[#4A6482]/10',
      text: 'text-[#4A6482]',
      border: 'border-[#4A6482]/30'
    },
    ILLUSTRATIVE: {
      label: 'ILLUSTRATIVE / DEMO',
      desc: 'Synthetic HG002 read pileup dataset for interface demonstration',
      bg: 'bg-[#B46927]/10',
      text: 'text-[#B46927]',
      border: 'border-[#B46927]/30'
    }
  };

  const c = configs[status];

  return (
    <span 
      title={detail || c.desc}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider font-medium border cursor-help transition-colors ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{c.label}</span>
      {detail && <span className="opacity-70 font-normal">({detail})</span>}
    </span>
  );
};

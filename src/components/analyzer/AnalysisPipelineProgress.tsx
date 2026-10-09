import React from 'react';
import { 
  CheckCircle2, 
  Dna, 
  Cpu, 
  Atom, 
  Sparkles, 
  Terminal, 
  Play, 
  ArrowDown, 
  Activity, 
  Layers, 
  Clock, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { ExtractedVariant } from '../../data/ednaHaplotypeData';

interface AnalysisPipelineProgressProps {
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  progress: number;
  stage: number;
  logs: string[];
  executionMs: number;
  variants: ExtractedVariant[];
  totalCombinationsCount: number;
  isDark: boolean;
  onReRun: () => void;
  onScrollToOutputs: (targetId?: string) => void;
}

const STAGES = [
  { id: 1, label: 'FASTA Homology & K-mer Alignment', icon: Dna, short: 'Alignment' },
  { id: 2, label: 'Candidate Variant Calling & Depth Pileups', icon: Activity, short: 'Variant Calling' },
  { id: 3, label: 'Diploid Haplotype Combinations (k=2)', icon: Layers, short: 'Haplotypes' },
  { id: 4, label: '16×16 QUBO Matrix & QAOA Ground State', icon: Atom, short: 'Quantum QUBO' },
];

export const AnalysisPipelineProgress: React.FC<AnalysisPipelineProgressProps> = ({
  isAnalyzing,
  hasAnalyzed,
  progress,
  stage,
  logs,
  executionMs,
  variants,
  totalCombinationsCount,
  isDark,
  onReRun,
  onScrollToOutputs
}) => {
  // If not analyzing and not analyzed yet, show subtle ready status
  if (!isAnalyzing && !hasAnalyzed) {
    return null;
  }

  return (
    <div className="w-full my-6 transition-all duration-300">
      {/* 1. ACTIVE PIPELINE ANIMATION CARD */}
      {isAnalyzing && (
        <div className={`rounded-2xl border p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all ${
          isDark 
            ? 'bg-[#12110F] border-[#B89A4A]/50 shadow-black/60' 
            : 'bg-[#FAF7F0] border-[#B89A4A]/60 shadow-amber-900/10'
        }`}>
          {/* Glowing Top Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#DDD4C0] dark:bg-[#2E2C27] overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-[#B89A4A] via-[#E8D89A] to-emerald-500 transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header with Title and Live Percentage Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DDD4C0]/70 dark:border-[#2E2C27]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B89A4A]/20 border border-[#B89A4A]/40 flex items-center justify-center text-[#B89A4A] animate-dna-pulse">
                <Dna size={22} className="animate-spin text-[#B89A4A]" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300 animate-pulse">
                    Live Execution Pipeline
                  </span>
                  <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                    Genomics &amp; Quantum QAOA Engine
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif-sc tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-0.5">
                  Running Multi-Stage eDNA FASTA Analysis...
                </h3>
              </div>
            </div>

            {/* Percentage Badge */}
            <div className="flex items-center gap-3 self-end sm:self-auto font-mono">
              <div className="text-right">
                <div className="text-2xl font-extrabold text-[#B89A4A] dark:text-[#E8D89A]">
                  {progress}%
                </div>
                <div className="text-[10px] text-[#5C5549] dark:text-[#A8A092] uppercase">
                  Stage {stage} of 4
                </div>
              </div>
            </div>
          </div>

          {/* Animated Multi-Stage Timeline Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4">
            {STAGES.map((s) => {
              const isPast = stage > s.id;
              const isCurrent = stage === s.id;
              const Icon = s.icon;

              return (
                <div
                  key={s.id}
                  className={`p-3 rounded-xl border font-mono text-xs transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#B89A4A]/15 border-[#B89A4A] text-[#181715] dark:text-[#FAF7F0] shadow-sm ring-1 ring-[#B89A4A]/50 scale-[1.01]'
                      : isPast
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-[#5C5549] dark:text-[#A8A092] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Step {s.id}
                    </span>
                    {isPast ? (
                      <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="w-3.5 h-3.5 border-2 border-[#B89A4A] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-[10px] opacity-40">Queued</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[11px] truncate">
                    <Icon size={13} className={isCurrent ? 'text-[#B89A4A] animate-pulse' : ''} />
                    <span className="truncate">{s.short}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Progress Bar with Pulse Animation */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Executing: {STAGES.find(s => s.id === stage)?.label || 'Finalizing Outputs...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#EFE9DC] dark:bg-[#201E1A] overflow-hidden p-0.5 border border-[#DDD4C0]/70 dark:border-[#2E2C27]">
              <div 
                className="h-full rounded-full bg-linear-to-r from-[#B89A4A] via-[#E8D89A] to-emerald-500 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Real-Time Live Terminal Ticker Stream */}
          <div className="rounded-xl border bg-black/90 border-[#38352F] text-emerald-400 font-mono text-[11px] p-3.5 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
              <span className="flex items-center gap-1.5">
                <Terminal size={12} className="text-[#B89A4A]" />
                <span>Computational Execution Telemetry</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-400">Active</span>
              </span>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto dark-scroll select-none">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-gray-500 select-none">&gt;</span>
                  <span className={`${idx === logs.length - 1 ? 'text-white font-bold' : 'text-emerald-400/90'}`}>
                    {log}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-1 text-[#B89A4A] animate-pulse">
                <span>▋</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CELEBRATION / SUCCESS BANNER (WHEN OUTPUTS ARRIVE) */}
      {!isAnalyzing && hasAnalyzed && (
        <div 
          id="analysis-success-banner"
          className={`rounded-2xl border p-4 sm:p-5 shadow-lg transition-all animate-output-slide-in relative overflow-hidden ${
            isDark 
              ? 'bg-linear-to-r from-[#141A14] via-[#12110F] to-[#1A1813] border-emerald-500/40 text-[#FAF7F0]' 
              : 'bg-linear-to-r from-emerald-500/10 via-[#FAF7F0] to-[#B89A4A]/10 border-emerald-600/40 text-[#181715]'
          }`}
        >
          {/* Subtle Golden Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-[#B89A4A] to-emerald-500" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Info: Outputs Generated */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    ✓ Analysis Completed Successfully
                  </span>
                  <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092] flex items-center gap-1">
                    <Clock size={11} className="text-[#B89A4A]" />
                    <span>Solved in {executionMs} ms</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-serif-sc tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-0.5">
                  All 4 Scientific Outputs Generated &amp; Phased
                </h3>

                <p className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                  Identified <strong>{variants.length} candidate variants</strong> • Phased into <strong>{totalCombinationsCount} diplotype combinations</strong> • Quantum Ground State: <strong className="text-emerald-700 dark:text-emerald-300">H5 + H10 (Energy: 133.0)</strong>
                </p>
              </div>
            </div>

            {/* Right Action Anchors */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs self-start lg:self-center">
              <button
                onClick={() => onScrollToOutputs('section-output-vcf')}
                className="px-3 py-1.5 rounded-lg border text-[11px] font-bold bg-[#FAF7F0] dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F] text-[#181715] dark:text-[#FAF7F0] hover:border-[#B89A4A] transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>1. VCF Table</span>
                <ArrowDown size={11} className="text-[#B89A4A]" />
              </button>

              <button
                onClick={() => onScrollToOutputs('section-output-haplotypes')}
                className="px-3 py-1.5 rounded-lg border text-[11px] font-bold bg-[#FAF7F0] dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F] text-[#181715] dark:text-[#FAF7F0] hover:border-[#B89A4A] transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>2. Haplotypes</span>
                <ArrowDown size={11} className="text-[#B89A4A]" />
              </button>

              <button
                onClick={() => onScrollToOutputs('section-output-qubo')}
                className="px-3 py-1.5 rounded-lg border text-[11px] font-bold bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] border-[#B89A4A]/50 hover:bg-[#B89A4A]/30 transition-colors flex items-center gap-1 shadow-xs font-extrabold"
              >
                <Atom size={12} />
                <span>QUBO &amp; QAOA</span>
                <ArrowDown size={11} />
              </button>

              <button
                onClick={() => onScrollToOutputs('section-output-genotypes')}
                className="px-3 py-1.5 rounded-lg border text-[11px] font-bold bg-[#FAF7F0] dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F] text-[#181715] dark:text-[#FAF7F0] hover:border-[#B89A4A] transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>3. Genotypes</span>
                <ArrowDown size={11} />
              </button>

              <button
                onClick={onReRun}
                className="px-3 py-1.5 rounded-lg border text-[11px] font-bold bg-[#B89A4A] hover:bg-[#C9A952] text-black transition-colors flex items-center gap-1 shadow-xs"
                title="Re-run pipeline analysis animation"
              >
                <RotateCcw size={11} />
                <span>Re-run</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


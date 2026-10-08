import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Target } from 'lucide-react';
import { ThemeMode, AnalyzedVariant } from '../../types';

interface SequenceDiffCanvasProps {
  theme: ThemeMode;
  refSeq: string;
  querySeq: string;
  variants: AnalyzedVariant[];
  selectedVariantId?: string | null;
  onSelectVariant?: (v: AnalyzedVariant) => void;
  isAnalyzing?: boolean;
  activeStep?: number;
}

export const SequenceDiffCanvas: React.FC<SequenceDiffCanvasProps> = ({
  theme,
  refSeq,
  querySeq,
  variants,
  selectedVariantId,
  isAnalyzing = false,
  activeStep = 0,
}) => {
  const isDark = theme === 'dark';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const rSeq = refSeq.replace(/[^A-Za-z]/g, '').toUpperCase();
  const qSeq = querySeq.replace(/[^A-Za-z]/g, '').toUpperCase();
  const maxLen = Math.max(rSeq.length, qSeq.length);

  const [startIndex, setStartIndex] = useState(0);
  const windowSize = 48;

  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'C': return 'text-sky-700 dark:text-sky-400 bg-sky-500/15 border-sky-500/30';
      case 'G': return 'text-amber-700 dark:text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'T': return 'text-rose-700 dark:text-rose-400 bg-rose-500/15 border-rose-500/30';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  useEffect(() => {
    if (selectedVariantId) {
      const v = variants.find(item => item.id === selectedVariantId);
      if (v) {
        const mismatchIdx = variants.indexOf(v) * 20;
        setStartIndex(Math.max(0, Math.min(maxLen - windowSize, mismatchIdx)));
      }
    }
  }, [selectedVariantId, variants, maxLen]);

  const handleNext = () => {
    setStartIndex(prev => Math.min(maxLen - windowSize, prev + 24));
  };

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - 24));
  };

  const mismatches: number[] = [];
  for (let i = 0; i < Math.min(rSeq.length, qSeq.length); i++) {
    if (rSeq[i] !== qSeq[i]) {
      mismatches.push(i);
    }
  }

  const handleJumpToNextMismatch = () => {
    const nextMis = mismatches.find(m => m > startIndex);
    if (nextMis !== undefined) {
      setStartIndex(Math.max(0, Math.min(maxLen - windowSize, nextMis - 12)));
    } else if (mismatches.length > 0) {
      setStartIndex(Math.max(0, Math.min(maxLen - windowSize, mismatches[0] - 12)));
    }
  };

  const currentSliceRef = rSeq.slice(startIndex, startIndex + windowSize);
  const currentSliceQuery = qSeq.slice(startIndex, startIndex + windowSize);

  return (
    <div className={`rounded-xl border p-4 transition-all relative overflow-hidden ${
      isDark ? 'bg-[#141311] border-[#38352F]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
    } ${isAnalyzing ? 'ring-2 ring-[#B89A4A]/60 shadow-lg' : ''}`}>
      {/* High-tech Laser Beam Scanner during Analysis */}
      {isAnalyzing && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="absolute top-0 bottom-0 w-36 bg-gradient-to-r from-transparent via-[#B89A4A]/25 to-transparent blur-md animate-laser-sweep" />
          <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#E8D89A] via-[#B89A4A] to-[#E8D89A] shadow-[0_0_16px_#B89A4A] animate-laser-sweep" />
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#181715]/90 dark:bg-[#FAF7F0]/90 text-[#FAF7F0] dark:text-[#181715] px-3 py-1 rounded-full text-[11px] font-mono shadow-md backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Scanning Alignment Matrix...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD4C0] dark:border-[#38352F] gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Zap size={14} className={`text-[#B89A4A] dark:text-[#E8D89A] ${isAnalyzing ? 'animate-bounce' : ''}`} />
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#181715] dark:text-[#FAF7F0]">
            Dual-Track Nucleotide Alignment & Mismatch Visualizer
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] font-semibold">
            {mismatches.length} Mismatches / InDels Highlighted
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all ${
            activeStep === 4 || activeStep === 7
              ? 'bg-[#B89A4A] text-black border-[#B89A4A] font-bold animate-pulse'
              : 'bg-[#B89A4A]/10 text-[#B89A4A] dark:text-[#E8D89A] border-[#B89A4A]/30'
          }`}>
            ⚡ Simulated by Step 4 (Mapping) &amp; Step 7 (Variant Calling)
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleJumpToNextMismatch}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
              isDark 
                ? 'bg-[#1F1D1A] border-[#38352F] text-[#E8D89A] hover:bg-[#282621]' 
                : 'bg-[#F2EBDB] border-[#DDD4C0] text-[#B89A4A] hover:bg-[#EAE2D0]'
            }`}
            title="Jump to Next Mismatch Site"
          >
            <Target size={12} />
            <span>Next Variant Site</span>
          </button>

          <div className="flex items-center border rounded border-[#DDD4C0] dark:border-[#38352F] overflow-hidden">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="p-1 px-2 hover:bg-[#EAE2D0] dark:hover:bg-[#282621] disabled:opacity-30 text-[#181715] dark:text-[#FAF7F0]"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 text-[11px] text-[#5C5549] dark:text-[#A8A092]">
              {startIndex + 1}–{Math.min(maxLen, startIndex + windowSize)} bp
            </span>
            <button
              onClick={handleNext}
              disabled={startIndex + windowSize >= maxLen}
              className="p-1 px-2 hover:bg-[#EAE2D0] dark:hover:bg-[#282621] disabled:opacity-30 text-[#181715] dark:text-[#FAF7F0]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="pt-4 overflow-x-auto select-none relative"
      >
        <div className="inline-block min-w-full">
          <div className="flex gap-1 mb-1 font-mono text-[9px] text-[#7A7265] dark:text-[#8C8578]">
            <span className="w-24 shrink-0 font-medium text-right pr-3">POS</span>
            <div className="flex gap-1">
              {Array.from({ length: windowSize }).map((_, i) => {
                const pos = startIndex + i + 1;
                const isTen = pos % 10 === 0;
                return (
                  <div key={i} className="w-5 text-center">
                    {isTen ? pos : '·'}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 mb-1.5 font-mono">
            <div className="w-24 shrink-0 text-right pr-3 text-[11px] font-semibold text-[#5C5549] dark:text-[#A8A092] flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B89A4A]" />
              <span>1. REF</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: windowSize }).map((_, i) => {
                const base = currentSliceRef[i] || ' ';
                const qBase = currentSliceQuery[i] || ' ';
                const isMismatch = base !== qBase && base !== ' ' && qBase !== ' ';

                return (
                  <div
                    key={i}
                    className={`w-5 h-7 rounded flex items-center justify-center text-xs font-bold border transition-all ${
                      getBaseColor(base)
                    } ${
                      isMismatch ? 'ring-2 ring-rose-500 scale-105 shadow-sm' : ''
                    }`}
                  >
                    {base}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 mb-1.5 font-mono">
            <div className="w-24 shrink-0 text-right pr-3 text-[10px] text-[#7A7265] dark:text-[#8C8578]">
              MATCH
            </div>
            <div className="flex gap-1">
              {Array.from({ length: windowSize }).map((_, i) => {
                const base = currentSliceRef[i] || ' ';
                const qBase = currentSliceQuery[i] || ' ';
                const isMismatch = base !== qBase && base !== ' ' && qBase !== ' ';

                return (
                  <div key={i} className="w-5 text-center text-[10px] font-bold">
                    {isMismatch ? (
                      <span className="text-rose-600 dark:text-rose-400 animate-pulse">✖</span>
                    ) : (
                      <span className="text-emerald-600/50 dark:text-emerald-400/50">|</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 mb-2 font-mono">
            <div className="w-24 shrink-0 text-right pr-3 text-[11px] font-semibold text-[#5C5549] dark:text-[#A8A092] flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>2. QUERY</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: windowSize }).map((_, i) => {
                const base = currentSliceQuery[i] || ' ';
                const rBase = currentSliceRef[i] || ' ';
                const isMismatch = base !== rBase && base !== ' ' && rBase !== ' ';

                return (
                  <div
                    key={i}
                    className={`w-5 h-7 rounded flex items-center justify-center text-xs font-bold border transition-all ${
                      getBaseColor(base)
                    } ${
                      isMismatch 
                        ? 'ring-2 ring-amber-500 scale-105 shadow-md bg-amber-500/30' 
                        : ''
                    }`}
                  >
                    {base}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#DDD4C0]/60 dark:border-[#38352F]/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Adenine (A)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-sky-500" /> Cytosine (C)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Guanine (G)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Thymine (T)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Highlighted Mismatch
          </span>
        </div>
      </div>
    </div>
  );
};

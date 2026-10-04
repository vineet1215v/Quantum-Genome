import React, { useState, useEffect } from 'react';
import { Landing3DScene } from '../3d/Landing3DScene';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../brand/ThemeToggle';
import { 
  ArrowRight, 
  BookOpen, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Info,
  X
} from 'lucide-react';
import { NavigationTab, ThemeMode } from '../../types';

interface LandingPageProps {
  onEnterWorkspace: (tab?: NavigationTab) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

interface NarrativeScene {
  index: number;
  phase: string;
  headline: string;
  sub: string;
  badge?: string;
  technicalDetails?: {
    formula?: string;
    metrics: { label: string; value: string }[];
  };
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterWorkspace,
  reducedMotion,
  onToggleReducedMotion,
  theme,
  onToggleTheme
}) => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showTechnicalDrawer, setShowTechnicalDrawer] = useState<boolean>(false);
  const [selectedQubit, setSelectedQubit] = useState<number | null>(null);

  const isDark = theme === 'dark';

  // Minimal, cinematic scene narrative matching master prompt
  const scenes: NarrativeScene[] = [
    {
      index: 0,
      phase: 'Scene 1 — DNA',
      headline: 'Every genome contains billions of bases.',
      sub: '3.2 billion base pairs of genetic information encoded across 23 chromosome pairs.',
      badge: 'MOLECULAR FOUNDATION',
      technicalDetails: {
        metrics: [
          { label: 'Genome Scale', value: '3.2 × 10⁹ bp' },
          { label: 'Alphabet', value: 'Σ = {A, C, G, T}' },
          { label: 'Ploidy', value: 'Diploid (2n = 46)' }
        ]
      }
    },
    {
      index: 1,
      phase: 'Scene 2 — Sequencing',
      headline: 'Sequencing transforms genomes into millions of computational fragments.',
      sub: 'Physical chromatin fragmented into unindexed short reads with Phred quality scores.',
      badge: 'HIGH-THROUGHPUT NGS',
      technicalDetails: {
        formula: 'Q = -10 · log₁₀(P_error)',
        metrics: [
          { label: 'Mean Phred', value: 'Q38.6 (>99.98%)' },
          { label: 'Fragment Length', value: '150 bp paired' },
          { label: 'Dataset', value: 'HG002 Benchmark' }
        ]
      }
    },
    {
      index: 2,
      phase: 'Scene 3 — Alignment',
      headline: 'Alignment reconstructs where each read belongs.',
      sub: 'Burrows-Wheeler Transform maps reads back to the GRCh38 canonical reference contig.',
      badge: 'BWA-MEM MAPPING',
      technicalDetails: {
        metrics: [
          { label: 'Reference Build', value: 'GRCh38.p14' },
          { label: 'Mapping Rate', value: '99.4% concordant' },
          { label: 'Aligner', value: 'BWA-MEM2 FM-Index' }
        ]
      }
    },
    {
      index: 3,
      phase: 'Scene 4 — Candidate Discovery',
      headline: 'Evidence reveals regions that may contain variation.',
      sub: 'Pileup entropy isolates ambiguous genomic windows requiring targeted local resolution.',
      badge: 'FOCAL WINDOWING',
      technicalDetails: {
        formula: 'H_{pileup} > τ_{threshold}',
        metrics: [
          { label: 'Candidate Windows', value: '1,842 regions' },
          { label: 'Coverage Depth', value: '30× – 65×' },
          { label: 'Allele Freq Range', value: '15% – 85%' }
        ]
      }
    },
    {
      index: 4,
      phase: 'Scene 5 — Quantum Transition',
      headline: 'Selected computational subproblems enter the quantum layer.',
      sub: 'Biological decisions become binary variables mapped into Quadratic Unconstrained Binary Optimization.',
      badge: 'QUBO FORMULATION',
      technicalDetails: {
        formula: 'H_{QUBO} = ∑ h_i x_i + ∑ J_{ij} x_i x_j + λ(1 - ∑ x_k)²',
        metrics: [
          { label: 'Binary Variables', value: '12 spins x_i ∈ {0,1}' },
          { label: 'Coupling Terms', value: '12×12 J_{ij} matrix' },
          { label: 'Constraint Weight', value: 'λ = 2.50' }
        ]
      }
    },
    {
      index: 5,
      phase: 'Scene 6 — QAOA',
      headline: 'Quantum optimization explores candidate solutions.',
      sub: 'Parameterized multi-qubit circuits explore superpositions to reach the minimum-energy ground state.',
      badge: 'VARIATIONAL ANSATZ',
      technicalDetails: {
        formula: '|ψ(γ, β)⟩ = ∏ e^{-i β H_M} e^{-i γ H_C} |+⟩^{⊗ n}',
        metrics: [
          { label: 'Qubits', value: '12 simulated' },
          { label: 'Circuit Depth', value: 'p = 3 layers' },
          { label: 'Projective Shots', value: '2,048 samples' }
        ]
      }
    },
    {
      index: 6,
      phase: 'Scene 7 — Validation',
      headline: 'Classical verification closes the loop.',
      sub: 'Sampled quantum ground-state bitstrings return to classical Bayesian likelihood verification.',
      badge: 'HYBRID VERIFICATION',
      technicalDetails: {
        metrics: [
          { label: 'Ground State', value: '|101101⟩ (94.2%)' },
          { label: 'Concordance Test', value: 'Likelihood Ratio PASSED' },
          { label: 'Ground Energy', value: 'E* = -38.64' }
        ]
      }
    },
    {
      index: 7,
      phase: 'Scene 8 — Final Variant',
      headline: 'From sequence to variant.',
      sub: 'Resolved heterozygous single nucleotide transition with calibrated high-confidence QUAL.',
      badge: 'chr1:10521 A → G',
      technicalDetails: {
        metrics: [
          { label: 'Locus', value: 'chr1:10521' },
          { label: 'Genotype', value: '0/1 (Heterozygous)' },
          { label: 'Phred Quality', value: 'QUAL 98.2' }
        ]
      }
    }
  ];

  // Auto-play narrative progression
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentScene((prev) => (prev + 1) % scenes.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  const active = scenes[currentScene];

  return (
    <div className={`relative min-h-screen w-full overflow-hidden select-none font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#11110F] text-[#FAF7F0]' : 'bg-[#F5F0E6] text-[#181715]'
    }`}>
      
      {/* 3D WebGL Canvas Layer (Full Screen with responsive lighting) */}
      <div className="absolute inset-0 z-0">
        <Landing3DScene 
          currentScene={currentScene} 
          reducedMotion={reducedMotion}
          theme={theme}
          onSelectQubit={(idx) => setSelectedQubit(idx)}
        />
      </div>

      {/* Subtle Atmospheric Vignette — Adaptive to Bright/Dark theme */}
      <div className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-t from-[#11110F]/90 via-transparent to-[#11110F]/60' 
          : 'bg-gradient-to-t from-[#F5F0E6]/95 via-transparent to-[#F5F0E6]/50'
      }`} />

      {/* Minimal Floating Top Header */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5">
        <Logo size="md" showSubtitle={false} theme={theme} />

        {/* Minimal Central Status Pill */}
        <div className={`hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full backdrop-blur-md text-[11px] font-mono transition-colors ${
          isDark 
            ? 'bg-[#181715]/70 border border-[#38352F]/70 text-[#DDD4C0]' 
            : 'bg-[#FAF7F0]/80 border border-[#DDD4C0] text-[#5C5549] shadow-xs'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B89A4A] animate-pulse" />
          <span className="tracking-widest uppercase">QUANTUM + CLASSICAL GENOMIC RESEARCH</span>
        </div>

        {/* Action CTAs & Dark/Bright Mode Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle 
            theme={theme} 
            onToggleTheme={onToggleTheme} 
            compact={true} 
          />

          <button
            onClick={() => onEnterWorkspace('methodology')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              isDark 
                ? 'text-[#DDD4C0] hover:text-[#FAF7F0] hover:bg-[#181715]/60' 
                : 'text-[#5C5549] hover:text-[#181715] hover:bg-[#EAE2D0]'
            }`}
          >
            <BookOpen size={13} className="text-[#B89A4A]" />
            <span>Methodology</span>
          </button>

          <button
            onClick={() => onEnterWorkspace('dashboard')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold active:scale-98 transition-all shadow-md ${
              isDark 
                ? 'bg-[#E8D89A] text-[#11110F] hover:bg-[#FAF7F0]' 
                : 'bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E]'
            }`}
          >
            <span>Enter Research Lab</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Main Visual-First Content Layer: Clean, spacious, and non-intrusive */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 lg:px-12 flex flex-col justify-between min-h-[calc(100vh-140px)] pointer-events-none">
        
        {/* Top Floating Telemetry Tag */}
        <div className="pt-2 flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8C734B]">
            <span className={`px-2 py-0.5 rounded border ${
              isDark 
                ? 'bg-[#181715]/80 border-[#24221E] text-[#E8D89A]' 
                : 'bg-[#FAF7F0]/90 border-[#DDD4C0] text-[#181715] shadow-xs'
            }`}>
              0{currentScene + 1} / 08
            </span>
            <span>{active.phase}</span>
          </div>

          <div className="flex items-center gap-2">
            {active.badge && (
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                isDark 
                  ? 'bg-[#181715]/80 border-[#B89A4A]/40 text-[#E8D89A]' 
                  : 'bg-[#FAF7F0]/90 border-[#B89A4A]/50 text-[#8C734B] shadow-xs font-bold'
              }`}>
                {active.badge}
              </span>
            )}
            <button
              onClick={() => setShowTechnicalDrawer(!showTechnicalDrawer)}
              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono transition-colors flex items-center gap-1 ${
                isDark 
                  ? 'bg-[#181715]/80 border-[#38352F] text-[#DDD4C0] hover:text-[#FAF7F0]' 
                  : 'bg-[#FAF7F0]/90 border-[#DDD4C0] text-[#5C5549] hover:text-[#181715] shadow-xs'
              }`}
              title="Toggle Technical Telemetry"
            >
              <Info size={11} className="text-[#B89A4A]" />
              <span>{showTechnicalDrawer ? 'Hide Details' : 'Details'}</span>
            </button>
          </div>
        </div>

        {/* Center Editorial Focus: Crisp typography with high contrast */}
        <div className="my-auto py-12 max-w-2xl space-y-4 pointer-events-auto">
          <h1 className={`font-serif-sc text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] tracking-tight drop-shadow-xs ${
            isDark ? 'text-[#FAF7F0]' : 'text-[#181715]'
          }`}>
            {active.headline}
          </h1>

          <p className={`text-sm sm:text-base font-sans leading-relaxed max-w-xl ${
            isDark ? 'text-[#DDD4C0]/85' : 'text-[#5C5549]'
          }`}>
            {active.sub}
          </p>

          {/* Clean Primary Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onEnterWorkspace('dashboard')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
                isDark 
                  ? 'bg-[#E8D89A] text-[#11110F] hover:bg-[#FAF7F0]' 
                  : 'bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E]'
              }`}
            >
              <span>Enter Workspace</span>
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => onEnterWorkspace('quantum-lab')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all ${
                isDark 
                  ? 'text-[#E8D89A] bg-[#181715]/80 hover:bg-[#24221E] border border-[#38352F]' 
                  : 'text-[#181715] bg-[#FAF7F0] hover:bg-[#EAE2D0] border border-[#DDD4C0] shadow-xs'
              }`}
            >
              <span>Hybrid Lab &rarr;</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Interactive Timeline Scrubber */}
        <div className={`border-t pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto transition-colors ${
          isDark ? 'border-[#24221E]/80' : 'border-[#DDD4C0]/80'
        }`}>
          
          {/* Previous / Next / Auto-Play Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setCurrentScene((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-[#181715]/80 hover:bg-[#24221E] border-[#38352F] text-[#FAF7F0]' 
                  : 'bg-[#FAF7F0] hover:bg-[#EAE2D0] border-[#DDD4C0] text-[#181715] shadow-xs'
              }`}
              title="Previous Chapter"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] transition-colors ${
                isDark 
                  ? 'bg-[#181715]/80 hover:bg-[#24221E] border-[#38352F] text-[#DDD4C0]' 
                  : 'bg-[#FAF7F0] hover:bg-[#EAE2D0] border-[#DDD4C0] text-[#5C5549] shadow-xs'
              }`}
              title={isPlaying ? 'Pause Auto-Play' : 'Auto-Play Narrative'}
            >
              {isPlaying ? <Pause size={12} className="text-[#B89A4A]" /> : <Play size={12} className="text-[#B89A4A]" />}
              <span>{isPlaying ? 'Pause' : 'Auto'}</span>
            </button>

            <button
              onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-[#181715]/80 hover:bg-[#24221E] border-[#38352F] text-[#FAF7F0]' 
                  : 'bg-[#FAF7F0] hover:bg-[#EAE2D0] border-[#DDD4C0] text-[#181715] shadow-xs'
              }`}
              title="Next Chapter"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Stepper Dots Track */}
          <div className="flex items-center gap-1.5">
            {scenes.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentScene(idx)}
                className={`transition-all rounded-full ${
                  currentScene === idx
                    ? isDark ? 'w-8 h-2 bg-[#E8D89A]' : 'w-8 h-2 bg-[#181715]'
                    : isDark ? 'w-2 h-2 bg-[#38352F] hover:bg-[#8C734B]' : 'w-2 h-2 bg-[#DDD4C0] hover:bg-[#8C734B]'
                }`}
                title={s.phase}
              />
            ))}
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              onClick={onToggleReducedMotion}
              className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                reducedMotion
                  ? 'border-[#B46927] text-[#B46927] bg-[#B46927]/10'
                  : isDark 
                    ? 'border-[#38352F] text-[#8C734B] hover:text-[#FAF7F0]' 
                    : 'border-[#DDD4C0] text-[#5C5549] hover:text-[#181715]'
              }`}
            >
              {reducedMotion ? 'Motion: Off' : 'Motion: On'}
            </button>
          </div>
        </div>

      </div>

      {/* Slide-Out Technical Context (Only shown if user explicitly clicks "Details") */}
      {showTechnicalDrawer && active.technicalDetails && (
        <div className={`absolute right-6 top-20 z-30 w-80 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl font-mono text-xs space-y-3 animate-fadeIn ${
          isDark 
            ? 'bg-[#181715]/95 border-[#38352F] text-[#FAF7F0]' 
            : 'bg-[#FAF7F0]/95 border-[#DDD4C0] text-[#181715]'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-[#24221E]' : 'border-[#EBE5D8]'}`}>
            <span className="text-[#B89A4A] font-bold text-[11px] uppercase tracking-wider">
              {active.phase} Telemetry
            </span>
            <button
              onClick={() => setShowTechnicalDrawer(false)}
              className="text-[#8C734B] hover:text-current p-1"
            >
              <X size={14} />
            </button>
          </div>

          {active.technicalDetails.formula && (
            <div className={`p-2.5 rounded-lg border text-[11px] break-all ${
              isDark 
                ? 'bg-[#11110F] border-[#24221E] text-[#E8D89A]' 
                : 'bg-[#EFE9DC] border-[#DDD4C0] text-[#181715]'
            }`}>
              <code>{active.technicalDetails.formula}</code>
            </div>
          )}

          <div className="space-y-2 pt-1">
            {active.technicalDetails.metrics.map((m, idx) => (
              <div key={idx} className={`flex items-center justify-between text-[11px] py-1 border-b last:border-0 ${
                isDark ? 'border-[#24221E]/60' : 'border-[#EBE5D8]'
              }`}>
                <span className="text-[#8C734B]">{m.label}</span>
                <span className="font-semibold">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minimal Qubit Click Tooltip */}
      {selectedQubit !== null && (
        <div className={`absolute left-6 bottom-24 z-30 p-3.5 rounded-xl border backdrop-blur-md shadow-xl font-mono text-xs space-y-1.5 animate-fadeIn max-w-xs ${
          isDark 
            ? 'bg-[#181715]/95 border-[#B89A4A] text-[#FAF7F0]' 
            : 'bg-[#FAF7F0]/95 border-[#B89A4A] text-[#181715]'
        }`}>
          <div className="flex items-center justify-between text-[#B89A4A] font-bold">
            <span>Qubit q[{selectedQubit}] Node</span>
            <button onClick={() => setSelectedQubit(null)} className="text-[#8C734B] hover:text-current">
              <X size={13} />
            </button>
          </div>
          <p className="text-[11px]">
            Mapped to spin variable x_{selectedQubit} for local pileup haplotype assignment.
          </p>
        </div>
      )}

    </div>
  );
};

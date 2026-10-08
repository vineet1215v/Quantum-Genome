import React, { useState, useEffect } from 'react';
import { 
  Book, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Atom, 
  Layers, 
  Filter, 
  Tag, 
  Activity, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  HelpCircle,
  Scissors,
  ArrowRight,
  Database,
  Sliders,
  BarChart3
} from 'lucide-react';
import { ThemeMode } from '../../types';

export interface StepSimulationInfo {
  step: number;
  title: string;
  category: string;
  operation: string;
  simulatesComponent: string;
  targetAnchorId: string;
  downstreamImpact: string;
  simulatedMetrics: { label: string; value: string }[];
  biologyAnalogy: string;
}

export const STEP_SIMULATION_DETAILS: Record<number, StepSimulationInfo> = {
  1: {
    step: 1,
    title: 'Reference Genome (GRCh38)',
    category: 'Master Standard Ingestion',
    operation: 'Ingests standard human reference genome sequence (master book standard) at target locus chr12:25,204,789–25,250,929.',
    simulatesComponent: 'Dual-Track Alignment (Track 1 REF)',
    targetAnchorId: 'dual-track-visualizer',
    downstreamImpact: 'Establishes the wild-type reference nucleotide chain (ATGACTGAATAT...) and the baseline coordinate axis starting at bp 1.',
    simulatedMetrics: [
      { label: 'Reference Track', value: '1. REF Standard' },
      { label: 'Coordinate Window', value: '1–48 bp' },
      { label: 'Coordinate Axis Start', value: 'bp 1' },
      { label: 'Codon 12 Ref', value: 'G (Glycine)' }
    ],
    biologyAnalogy: 'Master original book against which patient copies are compared.'
  },
  2: {
    step: 2,
    title: 'Sequencing Reads (FASTQ)',
    category: 'Query Reads Ingestion',
    operation: 'Shreds patient sequence into short fragment reads paired with per-base Phred ASCII confidence scores.',
    simulatesComponent: 'Dual-Track Alignment (Track 2 QUERY)',
    targetAnchorId: 'dual-track-visualizer',
    downstreamImpact: 'Loads the query sequence read pileup into Track 2 QUERY, providing the alternative nucleotides to align against reference.',
    simulatedMetrics: [
      { label: 'Query Track', value: '2. QUERY Sample' },
      { label: 'Read Technology', value: 'Targeted Amplicon' },
      { label: 'Base Streams', value: 'Fragmented K-mers' },
      { label: 'Codon 12 Alt', value: 'A (Aspartate G12D)' }
    ],
    biologyAnalogy: 'Millions of torn, overlapping strips of the patient’s copy.'
  },
  3: {
    step: 3,
    title: 'Quality Control (QC)',
    category: 'Preprocessing & Filtering',
    operation: 'Trims low-confidence bases, filters adapters, and removes reads with base error probabilities > 1% (Phred < Q20).',
    simulatesComponent: 'Phred Quality Score (Q-Score) Plot',
    targetAnchorId: 'phred-quality-plot',
    downstreamImpact: 'Initializes the Phred Quality baseline thresholds: Q20 Threshold (99.0% accuracy) and Q30 Threshold (99.9% accuracy).',
    simulatedMetrics: [
      { label: 'Q20 Baseline', value: '99.0% Accuracy' },
      { label: 'Q30 Baseline', value: '99.9% Accuracy' },
      { label: 'Filter Criterion', value: 'Phred >= Q20' },
      { label: 'Quality Plot', value: 'Baseline Curve Initialized' }
    ],
    biologyAnalogy: 'Inspecting torn fragments and discarding blurred, stained, or illegible words.'
  },
  4: {
    step: 4,
    title: 'Mapping (BWA-MEM)',
    category: 'Seed-and-Extend Alignment',
    operation: 'Executes Burrows-Wheeler Transform seed-and-extend algorithm to align shredded reads to precise reference coordinates.',
    simulatesComponent: 'Dual-Track Nucleotide Alignment & Mismatch Visualizer',
    targetAnchorId: 'dual-track-visualizer',
    downstreamImpact: 'Synchronizes patient reads into the 1–48 bp coordinate window, locks sequence position, and initiates the laser sweep scanner.',
    simulatedMetrics: [
      { label: 'Coordinate Frame', value: '1–48 bp Coordinates' },
      { label: 'Alignment Method', value: 'BWA-MEM Seed & Extend' },
      { label: 'Alignment Target', value: 'Locus Codon 12 / 13' },
      { label: 'Laser Scanner', value: 'Matrix Aligned' }
    ],
    biologyAnalogy: 'Finding where each torn strip belongs by matching text to the master book.'
  },
  5: {
    step: 5,
    title: 'Duplicate Removal',
    category: 'Deduplication',
    operation: 'Purges optical and PCR duplicates (MarkDuplicates) to preserve only unique original molecular barcoded templates.',
    simulatesComponent: 'Depth Normalization & Allele Frequency Calibration',
    targetAnchorId: 'vaf-histogram',
    downstreamImpact: 'Eliminates artificial PCR amplification spikes, ensuring depth (DP) accurately reflects true biological variant representation.',
    simulatedMetrics: [
      { label: 'Deduplication Status', value: 'PCR Duplicates Purged' },
      { label: 'Depth Normalization', value: 'Normalized DP' },
      { label: 'VAF Accuracy', value: 'Unbiased Read Ratios' },
      { label: 'Molecular Fidelity', value: 'Single Observation / Mol' }
    ],
    biologyAnalogy: 'Throwing away photocopies of the same torn page to prevent false counts.'
  },
  6: {
    step: 6,
    title: 'Base Quality Score Recalibration (BQSR)',
    category: 'Machine Covariate Recalibration',
    operation: 'Applies empirical machine learning covariates to correct systematic machine sequencer base-calling errors.',
    simulatesComponent: 'Phred Quality Score (Q-Score) Plot',
    targetAnchorId: 'phred-quality-plot',
    downstreamImpact: 'Recalibrates the quality curve across bp 1 to bp 90, elevating the Mean Quality to Q43.6 (>99.98% Accuracy) and confirming Q30+ Benchmark Met.',
    simulatedMetrics: [
      { label: 'Mean Quality Score', value: 'Q43.6 (>99.98% Accuracy)' },
      { label: 'Benchmark Status', value: 'Q30+ Benchmark Met' },
      { label: 'Sequence Range', value: 'Start: bp 1 to End: bp 90' },
      { label: 'Quality Range', value: 'Q41.2 – Q45.0' }
    ],
    biologyAnalogy: 'Re-evaluating handwriting with experience: what looked like a smudged letter is now verified.'
  },
  7: {
    step: 7,
    title: 'Variant Calling (Pairwise Mismatch)',
    category: 'Candidate Discovery',
    operation: 'Conducts pairwise comparison between read pileups and reference standard to identify true candidate nucleotide differences.',
    simulatesComponent: 'Dual-Track Nucleotide Alignment & Mismatch Visualizer',
    targetAnchorId: 'dual-track-visualizer',
    downstreamImpact: 'Highlights 1 Mismatches / InDels Highlighted at Codon 12 (G → A point mutation) and engages the "Next Variant Site" targeting pointer.',
    simulatedMetrics: [
      { label: 'Mismatches Highlighted', value: '1 Mismatches / InDels Highlighted' },
      { label: 'Next Variant Site', value: 'Codon 12 (GGT > GAT)' },
      { label: 'Nucleotide Transition', value: 'Guanine (G) > Adenine (A)' },
      { label: 'Amino Acid Alteration', value: 'p.Gly12Asp (G12D)' }
    ],
    biologyAnalogy: 'Comparing aligned text line-by-line: the master book says "GO" but the patient reads say "TO".'
  },
  8: {
    step: 8,
    title: 'Gather Evidence (Pileup Depth & VAF)',
    category: 'Evidence Matrix',
    operation: 'Tallies total read depth (DP), reference allele counts (RD), and alternative allele counts (AD) at every candidate locus.',
    simulatesComponent: 'Variant Allele Frequency (VAF %) Histogram',
    targetAnchorId: 'vaf-histogram',
    downstreamImpact: 'Generates the 3 distinct binned VAF histogram peaks: 10–20% Subclone G12C, 30–40% Primary Driver G12D, and 40–50% Germline Het.',
    simulatedMetrics: [
      { label: '10–20% Bin', value: '1 variant (Subclone G12C)' },
      { label: '30–40% Bin', value: '1 variant (Primary Driver G12D)' },
      { label: '40–50% Bin', value: '1 variant (Germline Het)' },
      { label: 'Bimodal Peaks', value: 'Subclonal Somatic (15–38%) vs Germline (~50%)' }
    ],
    biologyAnalogy: 'Counting the votes: 3 reads say "GO", 3 reads say "TO", confirming a 50% split.'
  },
  9: {
    step: 9,
    title: 'Genotype Likelihoods (Bayesian Posteriors)',
    category: 'Statistical Modeling',
    operation: 'Computes Bayesian likelihood matrix P(Data|Genotype) across 0/0, 0/1, 1/1 states, integrating ClinVar and COSMIC pathogenicity annotations.',
    simulatesComponent: 'Biological Data Visualizations (Breakdown & Pathogenicity Spectra)',
    targetAnchorId: 'biological-visualizations',
    downstreamImpact: 'Simulates the 4 biological data visualization cards: 1. Variant Type (3 SNPs 100%), 2. Somatic vs Germline (2 Somatic 67% / 1 Germline 33%), 3. Cancer Pathogenicity (2 Cancerous / 1 Benign, 67% actionability), 4. What Variant Is It (2 Missense / 1 Intronic).',
    simulatedMetrics: [
      { label: '1. Variant Type', value: 'Total 3 • SNPs 3 (100%) • InDels 0 (0%)' },
      { label: '2. Somatic vs Germline', value: 'Somatic 2 (67%) • Germline 1 (33%)' },
      { label: '3. Cancer Pathogenicity', value: 'Cancerous 2 • Benign 1 • VUS 0 (67% Actionability)' },
      { label: '4. What Variant Is It', value: '2 Missense • 1 Intronic / Non-coding' }
    ],
    biologyAnalogy: 'Calculating the mathematical odds: 1% chance both letters match, 92% chance heterozygous.'
  },
  10: {
    step: 10,
    title: 'Quantum Optimization (QUBO + QAOA)',
    category: 'Quantum Core',
    operation: 'Maps candidate variant alignment matrix into an Ising QUBO Hamiltonian. 3-qubit QAOA circuit collapses the superposition to ground state eigenvalues 0/1.',
    simulatesComponent: 'Analysis Output (O.p) & Detailed Variant Output Table',
    targetAnchorId: 'analysis-output-kpi',
    downstreamImpact: 'Formally confirms 3 Genomic Alterations Identified, validates High-Confidence Total Calls 3, and populates the Detailed Variant Output Table (3 of 3 Visible) with VCF 4.2 / CSV download!',
    simulatedMetrics: [
      { label: 'Analysis Output (O.p)', value: '3 Genomic Alterations Identified' },
      { label: 'Total Calls', value: '3 High-Confidence (SNPs/InDels: 3 / 0)' },
      { label: 'Cancer / Benign', value: '2 Oncogenic Drivers / 1 Benign Polymorphism' },
      { label: 'Detailed Table', value: '3 of 3 Visible • PASS Filter • VCF 4.2' }
    ],
    biologyAnalogy: 'Consulting the quantum computer to settle all ambiguous homologous regions instantly.'
  }
};

interface QuantumGenomicPipelineVisualizerProps {
  theme: ThemeMode;
  activeStep?: number; // 0 = idle, 1..10 active, 11..15
  isRunning?: boolean;
  onStepChange?: (step: number) => void;
  onRunPipeline?: () => void;
  refSequenceSnippet?: string;
  querySequenceSnippet?: string;
}

export const QuantumGenomicPipelineVisualizer: React.FC<QuantumGenomicPipelineVisualizerProps> = ({
  theme,
  activeStep = 0,
  isRunning = false,
  onStepChange,
  onRunPipeline,
  refSequenceSnippet = 'ACGTACGTA',
  querySequenceSnippet = 'ACGTGCGTA',
}) => {
  const isDark = theme === 'dark';
  const [selectedStepModal, setSelectedStepModal] = useState<number | null>(null);

  const getStepStatus = (stepNum: number) => {
    if (activeStep === 0) return 'idle';
    if (activeStep === stepNum) return 'active';
    if (activeStep > stepNum) return 'completed';
    return 'pending';
  };

  const getStepHeaderColor = (stepNum: number) => {
    switch (stepNum) {
      case 1: return 'bg-[#1D4ED8] text-white';
      case 2: return 'bg-[#15803D] text-white';
      case 3: return 'bg-[#B45309] text-white';
      case 4: return 'bg-[#1E40AF] text-white';
      case 5: return 'bg-[#C2410C] text-white';
      case 6: return 'bg-[#0F766E] text-white';
      case 7: return 'bg-[#BE185D] text-white';
      case 8: return 'bg-[#0E7490] text-white';
      case 9: return 'bg-[#7C3AED] text-white';
      case 10: return 'bg-[#9D174D] text-white';
      case 11: return 'bg-[#2563EB] text-white';
      case 12: return 'bg-[#4338CA] text-white';
      case 13: return 'bg-[#1E3A8A] text-white';
      case 14: return 'bg-[#B91C1C] text-white';
      case 15: return 'bg-[#0F172A] text-white';
      default: return 'bg-[#4B5563] text-white';
    }
  };

  const getStepCardBg = (stepNum: number, status: string) => {
    if (status === 'active') {
      return isDark 
        ? 'bg-[#1E1C18] border-[#B89A4A] ring-2 ring-[#B89A4A] shadow-lg animate-pulse-glow' 
        : 'bg-[#FFFDF7] border-[#B89A4A] ring-2 ring-[#B89A4A] shadow-md';
    }
    if (status === 'completed') {
      return isDark 
        ? 'bg-[#141311] border-[#38352F] opacity-95' 
        : 'bg-[#FAF7F0] border-[#DDD4C0]';
    }
    // pending or idle
    return isDark 
      ? 'bg-[#100F0D] border-[#262420] opacity-85 hover:opacity-100' 
      : 'bg-[#F9F5EC] border-[#DDD4C0] hover:bg-[#FAF7F0]';
  };

  return (
    <section className={`rounded-2xl border p-4 sm:p-6 transition-all shadow-sm ${
      isDark ? 'bg-[#12110F] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
    }`}>
      {/* Top Main Banner Header */}
      <div className="rounded-xl overflow-hidden mb-6 border border-[#234A70] dark:border-[#1E3D5C] shadow-sm">
        <div className="bg-gradient-to-r from-[#0C243B] via-[#12385C] to-[#0A1F33] p-4 sm:p-5 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/30 text-sky-200 border border-sky-400/30">
                  Interactive Pipeline Architecture
                </span>
                <span className="text-xs text-sky-200/70 font-mono">
                  10-Stage Quantum-Classical Core + Reporting
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-serif-sc">
                Hybrid Quantum-Classical Pipeline for Genomic Variant Calling
              </h2>
              <p className="text-xs sm:text-sm text-sky-100/90 mt-1 leading-relaxed max-w-4xl">
                <span className="font-semibold text-amber-300">Analogy:</span> Reconstructing a person&apos;s book from torn pages and finding the differences from the master book using a quantum-powered decision step.
              </p>
            </div>

            {/* Stepper Controls & Status */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onRunPipeline && (
                <button
                  onClick={onRunPipeline}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
                    isRunning 
                      ? 'bg-amber-500 text-black cursor-wait animate-pulse'
                      : 'bg-[#B89A4A] hover:bg-[#C9A952] text-black active:scale-95'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Step {activeStep} / 10 Active...</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} fill="currentColor" />
                      <span>Simulate Steps 1 → 10</span>
                    </>
                  )}
                </button>
              )}

              {onStepChange && (
                <div className="flex items-center bg-black/40 backdrop-blur-md rounded-lg border border-sky-400/20 p-1">
                  <button
                    onClick={() => onStepChange(Math.max(1, (activeStep || 1) - 1))}
                    disabled={activeStep <= 1 || isRunning}
                    className="p-1 text-sky-200 hover:text-white disabled:opacity-30 transition-colors"
                    title="Previous Step"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-2 text-xs font-mono text-sky-100 font-semibold">
                    {activeStep > 0 ? `Step ${activeStep}/10` : 'Ready'}
                  </span>
                  <button
                    onClick={() => onStepChange(Math.min(10, (activeStep || 0) + 1))}
                    disabled={activeStep >= 10 || isRunning}
                    className="p-1 text-sky-200 hover:text-white disabled:opacity-30 transition-colors"
                    title="Next Step"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Step Progress Pill Bar */}
          <div className="mt-4 pt-3 border-t border-sky-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-sky-200/80 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {activeStep === 0 && 'Pipeline Standby • Upload Sequences or Click "Simulate Steps 1 → 10"'}
                {activeStep === 1 && 'Step 1/10: Ingesting Standard GRCh38 Human Reference Genome'}
                {activeStep === 2 && 'Step 2/10: Splitting Query into Fragmented FASTQ Sequencing Reads'}
                {activeStep === 3 && 'Step 3/10: Quality Control (QC) & Low-Q Phred Filter'}
                {activeStep === 4 && 'Step 4/10: BWA-MEM Seed-and-Extend Read Mapping to Pos 10'}
                {activeStep === 5 && 'Step 5/10: PCR Optical Duplicate De-duplication'}
                {activeStep === 6 && 'Step 6/10: Base Quality Score Recalibration (BQSR)'}
                {activeStep === 7 && 'Step 7/10: Pairwise Mismatch & Candidate Variant Calling (A → G SNP)'}
                {activeStep === 8 && 'Step 8/10: Gathering Read Depth (DP=6) & Allele Frequency Evidence'}
                {activeStep === 9 && 'Step 9/10: Computing Bayesian Posterior Genotype Likelihoods'}
                {activeStep === 10 && 'Step 10/10: QAOA Quantum Circuit (3 Qubits) Hamiltonian Optimization'}
                {activeStep > 10 && 'Pipeline Execution Complete: Alterations Confirmed'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              {Array.from({ length: 10 }).map((_, i) => {
                const stepNum = i + 1;
                const status = getStepStatus(stepNum);
                return (
                  <button
                    key={stepNum}
                    onClick={() => onStepChange?.(stepNum)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      status === 'active'
                        ? 'bg-amber-400 text-black scale-110 ring-2 ring-white shadow-md'
                        : status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/20 text-sky-100 hover:bg-white/30'
                    }`}
                  >
                    {status === 'completed' ? '✓' : stepNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Step Simulation Impact & Downstream Component Attribution HUD */}
      {(() => {
        const currentStepKey = (activeStep >= 1 && activeStep <= 10) ? activeStep : 1;
        const currentInfo = STEP_SIMULATION_DETAILS[currentStepKey];
        if (!currentInfo) return null;

        const scrollToTarget = (id: string) => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-[#B89A4A]', 'transition-all');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-[#B89A4A]');
            }, 2500);
          }
        };

        return (
          <div className={`mb-6 rounded-xl border p-4 sm:p-5 transition-all shadow-md relative overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-r from-[#171512] via-[#1D1B16] to-[#171512] border-[#B89A4A]/50 ring-1 ring-[#B89A4A]/30' 
              : 'bg-gradient-to-r from-[#FFFDF7] via-[#FAF4E6] to-[#FFFDF7] border-[#B89A4A]/60 ring-1 ring-[#B89A4A]/30'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#DDD4C0]/70 dark:border-[#38352F]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#B89A4A] text-black flex items-center gap-1.5 shadow-xs">
                  <Sparkles size={13} />
                  <span>Step {currentInfo.step} / 10 Simulation HUD</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#181715] dark:text-[#FAF7F0]">
                  {currentInfo.title}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/25">
                  {currentInfo.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                  Simulates Output Section:
                </span>
                <button
                  onClick={() => scrollToTarget(currentInfo.targetAnchorId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-[#B89A4A]/20 hover:bg-[#B89A4A] text-[#8C6D23] dark:text-[#E8D89A] hover:text-black transition-all border border-[#B89A4A]/40 shadow-xs"
                >
                  <span>{currentInfo.simulatesComponent}</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3 text-xs">
              <div className="md:col-span-7 space-y-2">
                <p className="text-[12px] font-mono text-[#181715] dark:text-[#FAF7F0] leading-relaxed">
                  <span className="font-bold text-[#B89A4A] dark:text-[#E8D89A]">Biological Operation: </span>
                  {currentInfo.operation}
                </p>
                <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] leading-relaxed">
                  <span className="font-semibold text-sky-600 dark:text-sky-400">Downstream UI Impact: </span>
                  {currentInfo.downstreamImpact}
                </p>
                <div className="text-[11px] text-[#5C5549] dark:text-[#A8A092] italic">
                  💡 <span className="font-semibold">Analogy: </span>{currentInfo.biologyAnalogy}
                </div>
              </div>

              <div className="md:col-span-5 grid grid-cols-2 gap-2 bg-black/5 dark:bg-black/30 p-2.5 rounded-lg border border-[#DDD4C0]/60 dark:border-[#2E2C27]">
                {currentInfo.simulatedMetrics.map((metric, idx) => (
                  <div key={idx} className="p-2 rounded bg-white/70 dark:bg-[#1A1815] border border-[#DDD4C0]/50 dark:border-[#2E2C27] flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092] uppercase truncate">{metric.label}</span>
                    <span className="text-[11px] font-mono font-bold text-[#181715] dark:text-[#FAF7F0] truncate mt-0.5">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Grid of All Steps Exactly Like the Image */}
      <div className="space-y-5">

        {/* ============================================================== */}
        {/* ROW 1: STEPS 1 TO 6 (Classical Data Ingestion & Preprocessing) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">

          {/* STEP 1: REFERENCE GENOME */}
          <div 
            onClick={() => onStepChange?.(1)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(1, getStepStatus(1))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(1)}`}>
                  1
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Reference Genome
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Master book (standard human genome)
                  </p>
                </div>
              </div>

              {/* Graphic: 3D Hardcover Book */}
              <div className="my-3 flex flex-col items-center justify-center">
                <div className="w-24 h-16 rounded-md bg-gradient-to-r from-[#1E40AF] to-[#2563EB] border border-[#1D4ED8] p-1.5 shadow-md flex flex-col justify-between text-white relative">
                  <div className="w-1 h-full absolute left-1 top-0 bg-blue-300/40 rounded-xs" />
                  <div className="pl-2 pt-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-tight block">Reference</span>
                    <span className="text-[8px] opacity-80 block">Genome</span>
                  </div>
                  <div className="w-full h-1 bg-amber-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Sequence Stream */}
            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] font-mono text-[9px] text-[#5C5549] dark:text-[#A8A092] space-y-0.5">
              <div>... A C G T A C G T A ...</div>
              <div>... G T T A C G A T ..</div>
              <div className="text-[8px] text-[#B89A4A] dark:text-[#E8D89A] font-semibold">... (complete sequence)</div>
            </div>
          </div>

          {/* STEP 2: SEQUENCING READS (FASTQ) */}
          <div 
            onClick={() => onStepChange?.(2)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(2, getStepStatus(2))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(2)}`}>
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Sequencing Reads (FASTQ)
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Millions of torn pieces of person&apos;s book.
                  </p>
                </div>
              </div>

              {/* Graphic: Sequencer Machine + Torn Reads */}
              <div className="my-2 flex items-center justify-between gap-1.5">
                <div className="space-y-1 font-mono text-[9px]">
                  <div className="px-1.5 py-0.5 bg-[#FAF7F0] dark:bg-[#1E1C18] border border-[#DDD4C0] dark:border-[#38352F] rounded shadow-2xs text-[#181715] dark:text-[#FAF7F0]">ACGTAC</div>
                  <div className="px-1.5 py-0.5 bg-[#FAF7F0] dark:bg-[#1E1C18] border border-[#DDD4C0] dark:border-[#38352F] rounded shadow-2xs text-[#181715] dark:text-[#FAF7F0]">CGTACA</div>
                  <div className="px-1.5 py-0.5 bg-[#FAF7F0] dark:bg-[#1E1C18] border border-[#DDD4C0] dark:border-[#38352F] rounded shadow-2xs text-[#181715] dark:text-[#FAF7F0]">GTACGA</div>
                  <div className="px-1.5 py-0.5 bg-[#FAF7F0] dark:bg-[#1E1C18] border border-[#DDD4C0] dark:border-[#38352F] rounded shadow-2xs text-[#181715] dark:text-[#FAF7F0]">TACGTA</div>
                </div>

                {/* Sequencer machine icon box */}
                <div className="w-14 h-16 rounded-md bg-[#E8DFD0] dark:bg-[#201E1A] border border-[#C9BA9B] dark:border-[#38352F] p-1 flex flex-col justify-between items-center shadow-xs">
                  <div className="w-8 h-4 rounded bg-[#0F2840] border border-cyan-500/50 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  <div className="w-full h-1.5 bg-[#B89A4A] rounded-xs" />
                  <div className="text-[8px] font-mono font-bold text-[#5C5549] dark:text-[#A8A092]">NGS-Run</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-center">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-semibold">
                FASTQ (millions of short reads)
              </span>
            </div>
          </div>

          {/* STEP 3: QUALITY CONTROL (QC) */}
          <div 
            onClick={() => onStepChange?.(3)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(3, getStepStatus(3))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(3)}`}>
                  3
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Quality Control (QC)
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Check and keep good pieces.
                  </p>
                </div>
              </div>

              {/* Graphic: Passing vs Failing Reads */}
              <div className="my-2 space-y-1.5 font-mono text-[9px]">
                <div className="flex items-center justify-between p-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">ACGTAC</span>
                  <span className="flex items-center gap-1 text-[8px] text-emerald-700 dark:text-emerald-300 font-semibold">
                    <CheckCircle2 size={10} /> Good (keep)
                  </span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-rose-500/10 border border-rose-500/30">
                  <span className="line-through text-rose-800 dark:text-rose-400">NNNNNN</span>
                  <span className="flex items-center gap-1 text-[8px] text-rose-700 dark:text-rose-400">
                    <XCircle size={10} /> Low Q (del)
                  </span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-rose-500/10 border border-rose-500/30">
                  <span className="line-through text-rose-800 dark:text-rose-400">ACGTTN</span>
                  <span className="flex items-center gap-1 text-[8px] text-rose-700 dark:text-rose-400">
                    <XCircle size={10} /> Unknown N
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Phred Score Filter: Q &gt; 20</span>
            </div>
          </div>

          {/* STEP 4: MAPPING */}
          <div 
            onClick={() => onStepChange?.(4)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(4, getStepStatus(4))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(4)}`}>
                  4
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Mapping
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Find where each piece belongs in ref.
                  </p>
                </div>
              </div>

              {/* Graphic: Read mapping to Reference */}
              <div className="my-2.5 flex flex-col items-center font-mono">
                <div className="px-2 py-0.5 rounded bg-blue-500 text-white font-bold text-[10px] shadow-2xs">
                  TACGTA
                </div>
                <div className="text-blue-500 my-0.5 text-xs font-bold">↓</div>
                <div className="w-full text-center p-1 rounded bg-[#EFE9DC] dark:bg-[#1E1C18] border border-[#DDD4C0] dark:border-[#38352F] text-[9px] text-[#181715] dark:text-[#FAF7F0]">
                  ... A C G <span className="bg-blue-400/30 text-blue-800 dark:text-blue-300 font-bold px-0.5 rounded">T A C G T A</span> ...
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-center">
              <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-800 dark:text-blue-300 font-mono text-[9px] font-bold">
                Mapped to position 10
              </span>
            </div>
          </div>

          {/* STEP 5: DUPLICATE REMOVAL */}
          <div 
            onClick={() => onStepChange?.(5)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(5, getStepStatus(5))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(5)}`}>
                  5
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Duplicate Removal
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Remove photocopies of same piece.
                  </p>
                </div>
              </div>

              {/* Graphic: Stack of duplicates */}
              <div className="my-2 font-mono text-[9px] space-y-1">
                <div className="p-1 rounded bg-[#FAF7F0] dark:bg-[#1E1C18] border border-orange-500/30 relative">
                  <div className="text-[#5C5549] dark:text-[#A8A092]">ACGTAC</div>
                  <div className="text-[#5C5549] dark:text-[#A8A092] opacity-60">ACGTAC</div>
                  <div className="text-[#5C5549] dark:text-[#A8A092] opacity-40">ACGTAC</div>
                  <span className="absolute right-1 top-1 text-[8px] text-orange-700 dark:text-orange-400 font-bold">
                    Duplicates (del)
                  </span>
                </div>
                <div className="text-center text-xs text-orange-600 font-bold">↓</div>
                <div className="p-1 rounded bg-emerald-500/15 border border-emerald-500/40 font-bold text-emerald-800 dark:text-emerald-300 flex justify-between items-center">
                  <span>ACGTAC</span>
                  <span className="text-[8px] font-sans font-semibold">Keep one</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>PCR Artefacts Purged</span>
            </div>
          </div>

          {/* STEP 6: BASE QUALITY RECALIBRATION (BQSR) */}
          <div 
            onClick={() => onStepChange?.(6)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(6, getStepStatus(6))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(6)}`}>
                  6
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Base Recalibration (BQSR)
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Correct confidence labels on each base.
                  </p>
                </div>
              </div>

              {/* Graphic: Original vs Recalibrated Quality */}
              <div className="my-2 font-mono text-[9px] space-y-1">
                <div className="flex justify-between font-bold text-center text-[#181715] dark:text-[#FAF7F0] px-0.5">
                  <span>A</span><span>C</span><span>G</span><span>T</span><span>A</span><span>C</span>
                </div>
                <div className="flex justify-between text-orange-600 text-[8px] font-bold text-center px-1">
                  <span>↓</span><span>↓</span><span>↓</span><span>↓</span><span>↓</span><span>↓</span>
                </div>
                <div className="flex justify-between text-[8px] bg-sky-500/10 rounded px-1 py-0.5 text-sky-800 dark:text-sky-300">
                  <span>30</span><span>25</span><span>20</span><span>30</span><span>28</span><span>20</span>
                </div>
                <div className="text-center text-[8px] text-teal-600 font-bold">↓ Recalibrated</div>
                <div className="flex justify-between text-[8px] bg-teal-500/20 rounded px-1 py-0.5 font-bold text-teal-800 dark:text-teal-300">
                  <span>32</span><span>28</span><span>25</span><span>32</span><span>30</span><span>28</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Systematic Error Adjusted</span>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* ROW 2: STEPS 7 TO 12 (Variant Calling, Likelihoods, Quantum) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">

          {/* STEP 7: VARIANT CALLING */}
          <div 
            onClick={() => onStepChange?.(7)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(7, getStepStatus(7))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(7)}`}>
                  7
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Variant Calling
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Find differences from the reference.
                  </p>
                </div>
              </div>

              {/* Graphic: Ref vs Person diff */}
              <div className="my-2.5 font-mono text-[9px] space-y-1">
                <div className="flex items-center justify-between text-[#5C5549] dark:text-[#A8A092]">
                  <span className="font-semibold text-[8px]">Ref:</span>
                  <span>A C G T <span className="font-bold text-emerald-700 dark:text-emerald-400">A</span> C G T</span>
                </div>
                <div className="flex items-center justify-between text-[#181715] dark:text-[#FAF7F0]">
                  <span className="font-semibold text-[8px]">Sample:</span>
                  <span>A C G T <span className="px-1 py-0.2 rounded bg-rose-500 text-white font-bold">G</span> C G T</span>
                </div>
                <div className="text-center text-rose-600 text-xs font-bold my-0.5">↓</div>
                <div className="p-1 rounded bg-rose-500/15 border border-rose-500/40 text-center font-bold text-rose-800 dark:text-rose-300 text-[9px]">
                  Variant at pos 5: A → G (SNP)
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Candidate Locus Flagged</span>
            </div>
          </div>

          {/* STEP 8: GATHER EVIDENCE */}
          <div 
            onClick={() => onStepChange?.(8)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(8, getStepStatus(8))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(8)}`}>
                  8
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Gather Evidence
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Collect read info for each variant.
                  </p>
                </div>
              </div>

              {/* Graphic: Pileup column + read metrics */}
              <div className="my-2 flex items-center gap-2">
                <div className="flex flex-col gap-0.5 font-mono text-[9px]">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">A</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold">G</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">A</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold">G</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold">G</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">A</span>
                </div>
                <div className="text-[8px] font-mono space-y-0.5 text-[#5C5549] dark:text-[#A8A092] pl-1 border-l border-[#DDD4C0] dark:border-[#38352F]">
                  <div className="font-bold text-[#181715] dark:text-[#FAF7F0]">Depth (DP) = 6</div>
                  <div>Ref reads = 3</div>
                  <div>Alt reads = 3</div>
                  <div className="font-semibold text-amber-700 dark:text-amber-400">AF = 0.5 (50%)</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Base Quality Scores Compiled</span>
            </div>
          </div>

          {/* STEP 9: GENOTYPE LIKELIHOODS */}
          <div 
            onClick={() => onStepChange?.(9)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(9, getStepStatus(9))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(9)}`}>
                  9
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Genotype Likelihoods
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    How well does each explain evidence?
                  </p>
                </div>
              </div>

              {/* Graphic: Likelihood Table */}
              <div className="my-2 border rounded border-[#DDD4C0] dark:border-[#38352F] overflow-hidden font-mono text-[9px]">
                <table className="w-full text-left">
                  <thead className="bg-[#EFE9DC] dark:bg-[#1E1C18] text-[#5C5549] dark:text-[#A8A092] border-b border-[#DDD4C0] dark:border-[#38352F]">
                    <tr>
                      <th className="py-0.5 px-1.5">Genotype</th>
                      <th className="py-0.5 px-1 text-right">P(D|G)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD4C0] dark:divide-[#38352F]">
                    <tr>
                      <td className="py-0.5 px-1.5">0/0 (A/A)</td>
                      <td className="py-0.5 px-1 text-right text-slate-500">0.01</td>
                    </tr>
                    <tr className="bg-purple-500/15 font-bold text-purple-900 dark:text-purple-300">
                      <td className="py-0.5 px-1.5">0/1 (A/G)</td>
                      <td className="py-0.5 px-1 text-right">0.92</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 px-1.5">1/1 (G/G)</td>
                      <td className="py-0.5 px-1 text-right text-slate-500">0.07</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-purple-700 dark:text-purple-400 font-semibold">
              <span>Bayesian Model Computed</span>
            </div>
          </div>

          {/* STEP 10: QUANTUM OPTIMIZATION (QUBO + QAOA) - THE STAR COMPONENT */}
          <div 
            onClick={() => onStepChange?.(10)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(10, getStepStatus(10))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(10)}`}>
                  10
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight flex items-center gap-1">
                    <span>Quantum Optimization</span>
                    <Sparkles size={11} className="text-amber-500" />
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5 font-bold text-[#B89A4A] dark:text-[#E8D89A]">
                    (QUBO + QAOA Hybrid)
                  </p>
                </div>
              </div>

              {/* Graphic: Quantum Chip + 3 Qubits + Solution */}
              <div className="my-2 p-1.5 rounded-lg bg-[#0E0D0B] border border-fuchsia-500/40 text-white font-mono space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[9px] font-bold text-cyan-300">QAOA (3 qubits)</span>
                  </div>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/40 font-bold">
                    Depth p=3
                  </span>
                </div>

                {/* Circuit Bloch representation */}
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="w-4 h-4 rounded-full border border-cyan-400 flex items-center justify-center text-[7px] text-cyan-300">q₀</div>
                  <div className="w-3 h-0.5 bg-fuchsia-400" />
                  <div className="w-4 h-4 rounded-full border border-fuchsia-400 flex items-center justify-center text-[7px] text-fuchsia-300">q₁</div>
                  <div className="w-3 h-0.5 bg-fuchsia-400" />
                  <div className="w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center text-[7px] text-amber-300">q₂</div>
                </div>

                <div className="p-1 rounded bg-fuchsia-600/30 border border-fuchsia-400 text-center font-bold text-white text-[9px]">
                  Best Genotype: <span className="text-amber-300 text-[10px]">0/1</span>
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[8px] font-mono text-[#5C5549] dark:text-[#A8A092] leading-tight">
              <span>QUBO Hamiltonian Solved</span>
            </div>
          </div>

          {/* STEP 11: FILTERING */}
          <div 
            onClick={() => onStepChange?.(11)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(11, getStepStatus(11))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(11)}`}>
                  11
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Filtering
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Keep high-confidence variants.
                  </p>
                </div>
              </div>

              {/* Graphic: Funnel */}
              <div className="my-2 flex flex-col items-center">
                <div className="w-12 h-10 border-t-[12px] border-l-[8px] border-r-[8px] border-l-transparent border-r-transparent border-t-blue-500 rounded-xs flex items-center justify-center" />
                <div className="w-3 h-3 bg-blue-600 -mt-1 rounded-b-xs" />
                <div className="mt-1 text-[8px] font-mono space-y-0.5 text-center text-[#5C5549] dark:text-[#A8A092]">
                  <div>• Min Depth ≥ 6</div>
                  <div>• VAF ≥ 0.15</div>
                  <div>• PASS Criteria</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>False Positives Filtered</span>
            </div>
          </div>

          {/* STEP 12: ANNOTATION */}
          <div 
            onClick={() => onStepChange?.(12)}
            className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(12, getStepStatus(12))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(12)}`}>
                  12
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Annotation
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Identify genomic context.
                  </p>
                </div>
              </div>

              {/* Graphic: Gene Map */}
              <div className="my-2 font-mono text-[8px] space-y-1">
                <div className="relative pt-2 pb-1">
                  <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                  <div className="absolute top-1 left-1/3 w-10 h-2 bg-indigo-500 rounded-xs text-white text-[6px] font-bold text-center leading-none">
                    Exon
                  </div>
                  <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
                </div>
                <div className="space-y-0.5 text-[#5C5549] dark:text-[#A8A092]">
                  <div><strong className="text-[#181715] dark:text-[#FAF7F0]">Pos:</strong> 10,500 (A→G)</div>
                  <div><strong className="text-[#181715] dark:text-[#FAF7F0]">Gene:</strong> TP53 / Targeted</div>
                  <div><strong className="text-[#181715] dark:text-[#FAF7F0]">Effect:</strong> Missense</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-indigo-700 dark:text-indigo-400 font-semibold">
              <span>Clinical ClinVar Linked</span>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* ROW 3: STEPS 13 TO 15 (Reporting, Evaluation & Summary Analogy)*/}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">

          {/* STEP 13: FINAL OUTPUT (VCF) - 4 cols */}
          <div 
            onClick={() => onStepChange?.(13)}
            className={`md:col-span-4 rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(13, getStepStatus(13))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(13)}`}>
                  13
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Final Output (VCF)
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Standard format report of variants.
                  </p>
                </div>
              </div>

              {/* VCF Table Preview */}
              <div className="my-2 border rounded border-[#DDD4C0] dark:border-[#38352F] overflow-x-auto font-mono text-[8px]">
                <table className="w-full text-left">
                  <thead className="bg-[#EFE9DC] dark:bg-[#1E1C18] text-[#5C5549] dark:text-[#A8A092] border-b border-[#DDD4C0] dark:border-[#38352F]">
                    <tr>
                      <th className="py-1 px-1.5">CHROM</th>
                      <th className="py-1 px-1">POS</th>
                      <th className="py-1 px-1">REF</th>
                      <th className="py-1 px-1">ALT</th>
                      <th className="py-1 px-1">QUAL</th>
                      <th className="py-1 px-1">FILTER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD4C0] dark:divide-[#38352F]">
                    <tr>
                      <td className="py-1 px-1.5">chr17</td>
                      <td className="py-1 px-1">7577538</td>
                      <td className="py-1 px-1 text-rose-700 font-bold">C</td>
                      <td className="py-1 px-1 text-emerald-700 font-bold">T</td>
                      <td className="py-1 px-1">99</td>
                      <td className="py-1 px-1 text-emerald-600 font-semibold">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5">chr17</td>
                      <td className="py-1 px-1">7578406</td>
                      <td className="py-1 px-1 text-rose-700 font-bold">C</td>
                      <td className="py-1 px-1 text-emerald-700 font-bold">A</td>
                      <td className="py-1 px-1">95</td>
                      <td className="py-1 px-1 text-emerald-600 font-semibold">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] flex items-center justify-between text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Standard VCF 4.2 Spec</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Ready for Export</span>
            </div>
          </div>

          {/* STEP 14: EVALUATION WITH TRUTH SET - 4 cols */}
          <div 
            onClick={() => onStepChange?.(14)}
            className={`md:col-span-4 rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(14, getStepStatus(14))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(14)}`}>
                  14
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Evaluation with Truth Set
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    Compare predicted variants with known true variants.
                  </p>
                </div>
              </div>

              {/* Graphic: Venn Diagram + Precision/Recall/F1 */}
              <div className="my-2 flex items-center justify-between gap-2">
                <div className="relative w-24 h-16 shrink-0 flex items-center justify-center">
                  <div className="absolute left-1 w-12 h-12 rounded-full bg-blue-500/30 border border-blue-500/60" />
                  <div className="absolute right-1 w-12 h-12 rounded-full bg-emerald-500/30 border border-emerald-500/60" />
                  <span className="absolute z-10 text-[8px] font-mono font-bold text-[#181715] dark:text-[#FAF7F0]">
                    TP (99.8%)
                  </span>
                </div>

                <div className="font-mono text-[8px] space-y-1 text-[#5C5549] dark:text-[#A8A092] pl-1 border-l border-[#DDD4C0] dark:border-[#38352F]">
                  <div>
                    <strong className="text-blue-700 dark:text-blue-400">Precision:</strong> TP / (TP + FP) = 99.8%
                  </div>
                  <div>
                    <strong className="text-emerald-700 dark:text-emerald-400">Recall:</strong> TP / (TP + FN) = 99.4%
                  </div>
                  <div className="font-bold text-[#B89A4A] dark:text-[#E8D89A]">
                    F1 Score: 0.996
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              <span>Benchmark: GIAB High-Confidence</span>
            </div>
          </div>

          {/* STEP 15: OVERALL FLOW (ANALOGY) - 4 cols */}
          <div 
            onClick={() => onStepChange?.(15)}
            className={`md:col-span-4 rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer ${
              getStepCardBg(15, getStepStatus(15))
            }`}
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-xs ${getStepHeaderColor(15)}`}>
                  15
                </span>
                <div>
                  <h4 className="text-xs font-bold font-mono text-[#181715] dark:text-[#FAF7F0] leading-tight">
                    Overall Flow (Analogy)
                  </h4>
                  <p className="text-[10px] text-[#5C5549] dark:text-[#A8A092] leading-tight mt-0.5">
                    From torn pages to final report with quantum decision.
                  </p>
                </div>
              </div>

              {/* Graphic: Complete Pipeline Chain */}
              <div className="my-2 flex items-center justify-between text-center font-mono text-[7px] text-[#5C5549] dark:text-[#A8A092]">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded bg-blue-600/20 text-blue-800 dark:text-blue-300 flex items-center justify-center mb-0.5">
                    <Book size={12} />
                  </div>
                  <span>Master Book</span>
                </div>
                <ArrowRight size={10} className="text-[#B89A4A]" />
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-0.5">
                    <Scissors size={12} />
                  </div>
                  <span>Torn Reads</span>
                </div>
                <ArrowRight size={10} className="text-[#B89A4A]" />
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded bg-amber-600/20 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-0.5">
                    <Sliders size={12} />
                  </div>
                  <span>QC & Map</span>
                </div>
                <ArrowRight size={10} className="text-[#B89A4A]" />
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded bg-fuchsia-600/20 text-fuchsia-800 dark:text-fuchsia-300 flex items-center justify-center mb-0.5">
                    <Atom size={12} />
                  </div>
                  <span>Quantum Opt</span>
                </div>
                <ArrowRight size={10} className="text-[#B89A4A]" />
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded bg-[#B89A4A]/20 text-[#B89A4A] flex items-center justify-center mb-0.5">
                    <FileText size={12} />
                  </div>
                  <span>VCF Report</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDD4C0]/60 dark:border-[#2E2C27] flex items-center justify-between text-[9px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Hybrid QAOA Pipeline</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">End-to-End</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

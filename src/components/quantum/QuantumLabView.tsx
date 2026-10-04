import React, { useState } from 'react';
import { CURRENT_EXPERIMENT, CANDIDATE_REGIONS } from '../../data/mockData';
import { CandidateRegion, NavigationTab } from '../../types';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  Atom, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Dna, 
  CircuitBoard, 
  Grid3X3, 
  Play, 
  CheckCircle2, 
  Layers,
  FileCode2,
  HelpCircle
} from 'lucide-react';

interface QuantumLabViewProps {
  onNavigate: (tab: NavigationTab) => void;
  selectedRegion?: CandidateRegion;
}

export const QuantumLabView: React.FC<QuantumLabViewProps> = ({
  onNavigate,
  selectedRegion = CANDIDATE_REGIONS[0]
}) => {
  const [activeStep, setActiveStep] = useState<number>(4); // Step 4 = QUBO Formulation
  const [animatingTransformation, setAnimatingTransformation] = useState<boolean>(false);

  const hybridPipeline = [
    {
      id: 'step-1',
      domain: 'CLASSICAL',
      title: 'FASTQ Reads & QC',
      desc: '1.25M short reads checked for base call accuracy (mean Q38.6).',
      type: 'classical'
    },
    {
      id: 'step-2',
      domain: 'CLASSICAL',
      title: 'Global Alignment',
      desc: 'BWA-MEM aligns 99.4% of reads to GRCh38.p14 reference contig.',
      type: 'classical'
    },
    {
      id: 'step-3',
      domain: 'CLASSICAL',
      title: 'Candidate Regions',
      desc: 'Pileup analysis isolates 1,842 focal windows with read ambiguity.',
      type: 'classical'
    },
    {
      id: 'step-4',
      domain: 'QUANTUM SUBPROBLEM',
      title: 'QUBO Formulation',
      desc: 'Ambiguous reads and gap penalties mapped into binary quadratic spins.',
      type: 'quantum'
    },
    {
      id: 'step-5',
      domain: 'QUANTUM SUBPROBLEM',
      title: 'QAOA Circuit Execution',
      desc: 'Parameterized p=3 layers optimize variational ground-state bitstrings.',
      type: 'quantum'
    },
    {
      id: 'step-6',
      domain: 'QUANTUM SUBPROBLEM',
      title: 'Ground State Solution',
      desc: 'Measurement distribution yields optimal haplotype assignment |101101⟩.',
      type: 'quantum'
    },
    {
      id: 'step-7',
      domain: 'CLASSICAL',
      title: 'Classical Validation',
      desc: 'Likelihood ratio cross-check against Bayesian genotype priors.',
      type: 'classical'
    },
    {
      id: 'step-8',
      domain: 'CLASSICAL',
      title: 'Final Variant Calling',
      desc: 'Calibrated VCF record generated (QUAL 98.2, chr1:10555 A>G).',
      type: 'classical'
    }
  ];

  const handleRunTransformation = () => {
    setAnimatingTransformation(true);
    setTimeout(() => {
      setAnimatingTransformation(false);
      setActiveStep(5);
    }, 1200);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Quantum Computing / Quantum Lab
            </span>
            <ScientificBadge status="SIMULATED" detail="Hybrid Co-Processing" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Hybrid Classical-Quantum Architecture
          </h1>
          <p className="text-sm text-[#5C5549]">
            Targeting quantum variational algorithms strictly to computationally intractable genomic subproblems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('qubo-explorer')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#FAF7F0] border border-[#DDD4C0] hover:bg-[#EAE2D0] text-[#181715] transition-colors"
          >
            <Grid3X3 size={14} className="text-[#B89A4A]" />
            <span>Open QUBO Matrix</span>
          </button>
          <button
            onClick={() => onNavigate('quantum-circuit')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-colors shadow-sm"
          >
            <CircuitBoard size={14} className="text-[#E8D89A]" />
            <span>Explore Circuit</span>
          </button>
        </div>
      </div>

      {/* Signature Architecture Interactive Pipeline: CLASSICAL vs QUANTUM SUBPROBLEM */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBE5D8] pb-4">
          <div>
            <h2 className="font-serif-sc text-xl font-semibold text-[#181715]">
              Interactive Hybrid Execution Topology
            </h2>
            <p className="text-xs text-[#8C734B] font-mono">
              Click any stage to examine how biological data translates into quantum variables and returns to classical validation.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#5C5549]">
              <Cpu size={14} className="text-[#5C5549]" /> CLASSICAL CPU (BWA / GATK)
            </span>
            <span className="flex items-center gap-1.5 text-[#B89A4A] font-bold">
              <Atom size={14} className="text-[#B89A4A]" /> QUANTUM COPILOT (QUBO / QAOA)
            </span>
          </div>
        </div>

        {/* Step-by-Step Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hybridPipeline.map((step, idx) => {
            const isQuantum = step.type === 'quantum';
            const isActive = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isActive
                    ? isQuantum
                      ? 'bg-[#181715] text-[#FAF7F0] border-[#E8D89A] ring-2 ring-[#B89A4A]/50 shadow-lg'
                      : 'bg-[#FAF7F0] text-[#181715] border-[#181715] ring-2 ring-[#DDD4C0] shadow-md'
                    : isQuantum
                    ? 'bg-[#24221E] text-[#FAF7F0] border-[#38352F] hover:border-[#B89A4A]'
                    : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0] hover:bg-[#F2EBDB]'
                }`}
              >
                {/* Domain Pill */}
                <div className="flex items-center justify-between mb-2 font-mono text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold tracking-wider ${
                    isQuantum 
                      ? 'bg-[#B89A4A]/25 text-[#E8D89A] border border-[#B89A4A]/40' 
                      : 'bg-[#EFE9DC] text-[#5C5549] border border-[#DDD4C0]'
                  }`}>
                    {step.domain}
                  </span>
                  <span className="text-[#8C734B]">0{idx + 1}</span>
                </div>

                <div className={`font-serif-sc text-base font-semibold ${isQuantum ? 'text-[#FAF7F0]' : 'text-[#181715]'}`}>
                  {step.title}
                </div>
                <p className={`text-xs mt-1 font-sans ${isQuantum ? 'text-[#DDD4C0]' : 'text-[#5C5549]'}`}>
                  {step.desc}
                </p>

                {isActive && (
                  <div className="mt-3 pt-2 border-t border-current/20 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#B89A4A]">Active Focus</span>
                    <span className="text-xs">&rarr;</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Region Transformation Simulator into QUBO */}
      <div className="bg-[#11110F] text-[#FAF7F0] border border-[#24221E] rounded-2xl p-6 lg:p-8 shadow-xl space-y-6 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24221E] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#E8D89A] font-bold">ACTIVE TRANSFORMATION STAGE</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#24221E] text-[#8C734B] border border-[#38352F]">
                Locus: {selectedRegion.chromosome}:{selectedRegion.start}-{selectedRegion.end}
              </span>
            </div>
            <h3 className="font-serif-sc text-2xl font-bold text-[#FAF7F0] mt-1">
              Genomic Sequence &rarr; QUBO Formulation &rarr; QAOA Circuit
            </h3>
          </div>

          <button
            onClick={handleRunTransformation}
            disabled={animatingTransformation}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#B89A4A] to-[#D4B76B] text-[#11110F] hover:brightness-110 active:scale-98 transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles size={14} className={animatingTransformation ? 'animate-spin' : ''} />
            <span>{animatingTransformation ? 'Mapping Hamiltonians...' : 'Re-Run Transformation'}</span>
          </button>
        </div>

        {/* 4-Step Visual Metamorphosis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          
          {/* Step A: Genomic Read String */}
          <div className="p-4 rounded-xl bg-[#181715] border border-[#38352F] space-y-2">
            <span className="text-[10px] text-[#8C734B] uppercase">1. Focal DNA Segment</span>
            <div className="text-[#E8D89A] text-xs font-mono break-all bg-[#11110F] p-2.5 rounded border border-[#24221E]">
              {selectedRegion.referenceSeq.slice(0, 36)}...
            </div>
            <p className="text-[11px] text-[#DDD4C0]/70 font-sans">
              42 overlapping reads at focal SNV site (pos 10,555).
            </p>
          </div>

          {/* Step B: Binary Variables */}
          <div className="p-4 rounded-xl bg-[#181715] border border-[#38352F] space-y-2">
            <span className="text-[10px] text-[#8C734B] uppercase">2. Binary Variable Set</span>
            <div className="text-[#FAF7F0] text-xs font-mono bg-[#11110F] p-2.5 rounded border border-[#24221E] space-y-1">
              <div>x0: Read#1 &rarr; Hap A</div>
              <div>x1: Read#1 &rarr; Hap B</div>
              <div>x2: Read#2 &rarr; Hap B</div>
              <div>x3..x11: Diplotype spins</div>
            </div>
            <p className="text-[11px] text-[#DDD4C0]/70 font-sans">
              12 spins encode mutual exclusive read-haplotype assignments.
            </p>
          </div>

          {/* Step C: QUBO Matrix */}
          <div className="p-4 rounded-xl bg-[#181715] border border-[#B89A4A]/40 space-y-2">
            <span className="text-[10px] text-[#E8D89A] uppercase">3. Objective Coupling Matrix Q</span>
            <div className="text-[#E8D89A] text-xs font-mono bg-[#11110F] p-2.5 rounded border border-[#24221E] space-y-0.5">
              <div>[ -12.4,  +8.2, -3.5 ]</div>
              <div>[  +8.2, -10.8, +6.4 ]</div>
              <div>[  -3.5,  +6.4, -14.2]</div>
            </div>
            <p className="text-[11px] text-[#DDD4C0]/70 font-sans">
              Penalizes base quality discordance &amp; diploid ploidy conflicts.
            </p>
          </div>

          {/* Step D: QAOA Variational Circuit */}
          <div className="p-4 rounded-xl bg-[#181715] border border-[#E8D89A] space-y-2 shadow-inner">
            <span className="text-[10px] text-[#E8D89A] uppercase font-bold">4. Ground State Solution</span>
            <div className="text-[#2E6B48] text-xs font-mono bg-[#11110F] p-2.5 rounded border border-[#24221E] space-y-1">
              <div className="text-sm font-bold text-[#E8D89A]">|101101&rang;</div>
              <div className="text-[10px] text-[#DDD4C0]">Probability: 94.2%</div>
              <div className="text-[10px] text-[#2E6B48] font-bold">&check; Ground state found</div>
            </div>
            <p className="text-[11px] text-[#DDD4C0]/70 font-sans">
              Disambiguates heterozygous A/G transition with 0.992 confidence.
            </p>
          </div>

        </div>

        {/* Quick Nav to specialized pages */}
        <div className="pt-4 border-t border-[#24221E] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <span className="text-[#8C734B]">Deep Dive Sub-interfaces:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('qubo-explorer')}
              className="px-4 py-2 rounded-lg bg-[#24221E] hover:bg-[#38352F] text-[#FAF7F0] border border-[#38352F] transition-colors"
            >
              Interactive QUBO Heatmap &rarr;
            </button>
            <button
              onClick={() => onNavigate('quantum-circuit')}
              className="px-4 py-2 rounded-lg bg-[#24221E] hover:bg-[#38352F] text-[#FAF7F0] border border-[#38352F] transition-colors"
            >
              Quantum Circuit Visualizer &rarr;
            </button>
            <button
              onClick={() => onNavigate('optimization-runs')}
              className="px-4 py-2 rounded-lg bg-[#E8D89A] text-[#11110F] font-bold hover:bg-[#FAF7F0] transition-colors"
            >
              Run QAOA Simulation &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

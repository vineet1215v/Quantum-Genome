import React from 'react';
import { 
  CURRENT_EXPERIMENT, 
  CANDIDATE_REGIONS, 
  EXPERIMENTS_LIST, 
  VARIANTS_LIST 
} from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { NavigationTab, CandidateRegion } from '../../types';
import { 
  Dna, 
  Atom, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Clock, 
  Layers, 
  Search, 
  Activity, 
  GitBranch, 
  SlidersHorizontal,
  TrendingDown,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectCandidateRegion: (region: CandidateRegion) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectCandidateRegion
}) => {
  const pipelineSteps = [
    { id: 'fastq', label: 'FASTQ', sub: '1.25M Reads', status: 'Completed', icon: Dna, classical: true },
    { id: 'qc', label: 'QC', sub: 'Q38.6 Phred', status: 'Completed', icon: CheckCircle2, classical: true },
    { id: 'alignment', label: 'ALIGNMENT', sub: 'BWA-MEM2', status: 'Completed', icon: SlidersHorizontal, classical: true },
    { id: 'candidates', label: 'CANDIDATES', sub: '1,842 Regions', status: 'Active', icon: Search, classical: true },
    { id: 'quantum', label: 'QUANTUM QAOA', sub: 'QUBO Subproblem', status: 'Active', icon: Atom, classical: false },
    { id: 'validation', label: 'VALIDATION', sub: 'Likelihood Test', status: 'Completed', icon: Cpu, classical: true },
    { id: 'variants', label: 'VARIANTS', sub: '327 Calls', status: 'Completed', icon: GitBranch, classical: true }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Clean Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Research Overview
            </span>
            <ScientificBadge status="SIMULATED" detail="QAOA v1.8" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715] mt-0.5">
            Research Dashboard
          </h1>
          <p className="text-xs text-[#5C5549] font-sans">
            Pipeline progress, candidate pileup windows, and hybrid quantum-classical optimization status.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('quantum-lab')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-all shadow-sm"
          >
            <Atom size={14} className="text-[#E8D89A]" />
            <span>Launch Quantum Lab</span>
          </button>
          
          <button
            onClick={() => onNavigate('results')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#FAF7F0] border border-[#DDD4C0] hover:bg-[#EAE2D0] text-[#181715] transition-all"
          >
            <span>View 327 Variants</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Primary Pipeline Progress Diagram */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBE5D8] pb-4">
          <div>
            <h2 className="font-serif-sc text-xl font-semibold text-[#181715]">
              Hybrid Computational Pipeline Status
            </h2>
            <p className="text-xs text-[#8C734B] font-mono">
              Classical preprocessing partitions reads; high-entropy loci are solved via variational quantum optimization.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#5C5549]">
              <span className="w-2.5 h-2.5 rounded bg-[#DDD4C0]" /> Classical Stage
            </span>
            <span className="flex items-center gap-1.5 text-[#8C734B]">
              <span className="w-2.5 h-2.5 rounded bg-[#B89A4A]" /> Quantum Subproblem
            </span>
          </div>
        </div>

        {/* Pipeline Nodes Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isQuantum = !step.classical;

            return (
              <div 
                key={step.id}
                onClick={() => {
                  if (step.id === 'candidates') onNavigate('candidate-regions');
                  else if (step.id === 'quantum') onNavigate('quantum-lab');
                  else if (step.id === 'variants') onNavigate('variant-calling');
                  else if (step.id === 'alignment') onNavigate('alignment-lab');
                  else if (step.id === 'fastq') onNavigate('sequence-explorer');
                }}
                className={`relative p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isQuantum
                    ? 'bg-[#181715] border-[#B89A4A] text-[#FAF7F0] shadow-md hover:scale-[1.02]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] hover:border-[#8C734B] hover:bg-[#F2EBDB]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-md ${
                    isQuantum ? 'bg-[#24221E] text-[#E8D89A]' : 'bg-[#EAE2D0] text-[#5C5549]'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isQuantum 
                      ? 'bg-[#B89A4A]/30 text-[#E8D89A] border border-[#B89A4A]/40' 
                      : 'bg-[#2E6B48]/10 text-[#2E6B48]'
                  }`}>
                    {step.status}
                  </span>
                </div>

                <div className={`text-xs font-bold tracking-tight ${isQuantum ? 'text-[#FAF7F0]' : 'text-[#181715]'}`}>
                  {step.label}
                </div>
                <div className={`text-[11px] font-mono truncate ${isQuantum ? 'text-[#E8D89A]' : 'text-[#8C734B]'}`}>
                  {step.sub}
                </div>

                {/* Micro step connector indicator */}
                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#8C734B] opacity-40">
                    ›
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Research Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[#8C734B] uppercase">Reads Processed</div>
          <div className="text-xl font-bold text-[#181715]">1,250,000</div>
          <div className="text-[10px] text-[#2E6B48] flex items-center gap-1">
            <span>● 100% paired-end</span>
          </div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[#8C734B] uppercase">Candidate Regions</div>
          <div className="text-xl font-bold text-[#181715]">1,842</div>
          <div className="text-[10px] text-[#8C734B]">High-entropy loci</div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[#8C734B] uppercase">Variants Detected</div>
          <div className="text-xl font-bold text-[#181715]">327</div>
          <div className="text-[10px] text-[#2E6B48]">304 SNPs, 23 INDELs</div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[#8C734B] uppercase">Quantum Runtime</div>
          <div className="text-xl font-bold text-[#181715]">1,480 ms</div>
          <div className="text-[10px] text-[#2E6B48]">Simulated QAOA</div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[#8C734B] uppercase">Classical Runtime</div>
          <div className="text-xl font-bold text-[#181715]">4,120 ms</div>
          <div className="text-[10px] text-[#5C5549]">CPU Baseline</div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[#8C734B] uppercase">Circuit Depth / p</div>
          <div className="text-xl font-bold text-[#181715]">p = 3 layers</div>
          <div className="text-[10px] text-[#8C734B]">12 Qubits • 2048 shots</div>
        </div>
      </div>

      {/* Two-column layout: High-priority Candidate Regions & Classical vs Quantum Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Recent Candidate Regions */}
        <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
            <div>
              <h3 className="font-serif-sc text-lg font-semibold text-[#181715]">
                Active Candidate Regions for Quantum Optimization
              </h3>
              <p className="text-xs text-[#8C734B]">
                Loci exhibiting read ambiguity, discordant mapping, or repeat-flanked indels.
              </p>
            </div>
            <button
              onClick={() => onNavigate('candidate-regions')}
              className="text-xs font-mono font-medium text-[#8C734B] hover:text-[#181715] flex items-center gap-1"
            >
              <span>View all (1,842)</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3 font-mono">
            {CANDIDATE_REGIONS.slice(0, 4).map((region) => (
              <div
                key={region.id}
                onClick={() => {
                  onSelectCandidateRegion(region);
                  onNavigate('candidate-regions');
                }}
                className="p-3.5 rounded-xl border border-[#DDD4C0] hover:border-[#B89A4A] bg-[#FAF7F0] hover:bg-[#F2EBDB] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#181715] text-xs">
                      {region.chromosome}:{region.start}-{region.end}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EFE9DC] text-[#5C5549] border border-[#DDD4C0]">
                      {region.length} bp
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2E6B48]/15 text-[#2E6B48] font-semibold">
                      AF {region.alleleFrequency.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C5549] font-sans line-clamp-1">
                    {region.selectionReason}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#181715]">{region.readDepth}× Depth</div>
                    <div className="text-[10px] text-[#8C734B]">MapQ {region.mappingQuality.toFixed(0)}</div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCandidateRegion(region);
                      onNavigate('quantum-lab');
                    }}
                    className="px-2.5 py-1.5 rounded-md text-[11px] bg-[#181715] group-hover:bg-[#B89A4A] text-[#FAF7F0] group-hover:text-[#181715] font-semibold transition-all flex items-center gap-1 shadow-xs"
                    title="Transfer to Quantum Lab"
                  >
                    <Atom size={12} />
                    <span>QUBO</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Classical vs Quantum Snapshot & Experiments */}
        <div className="lg:col-span-5 space-y-6">
          {/* Snapshot Comparison Card */}
          <div className="bg-[#181715] text-[#FAF7F0] border border-[#38352F] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#24221E] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#B89A4A] uppercase tracking-wider">
                  Experimental Benchmark Snapshot
                </span>
                <h3 className="font-serif-sc text-lg font-semibold text-[#FAF7F0]">
                  Disambiguation Efficiency
                </h3>
              </div>
              <button
                onClick={() => onNavigate('classical-quantum')}
                className="text-xs font-mono text-[#E8D89A] hover:underline flex items-center gap-1"
              >
                <span>Full Benchmark</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#24221E] border border-[#38352F] space-y-1">
                <div className="text-[#8C734B] text-[10px] uppercase">Classical (GATK)</div>
                <div className="text-sm font-bold text-[#FAF7F0]">4,120 ms</div>
                <div className="text-[10px] text-[#DDD4C0]/70">Score: 93.1% concordant</div>
                <div className="text-[10px] text-[#8C734B]">O(2^N) branch search</div>
              </div>

              <div className="p-3 rounded-xl bg-[#24221E] border border-[#B89A4A]/50 space-y-1">
                <div className="text-[#E8D89A] text-[10px] uppercase">Quantum (QAOA)</div>
                <div className="text-sm font-bold text-[#E8D89A]">1,480 ms</div>
                <div className="text-[10px] text-[#2E6B48]">Score: 98.2% concordant</div>
                <div className="text-[10px] text-[#B89A4A]">p=3, 12 qubits</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#24221E]/60 text-[11px] font-mono text-[#DDD4C0]/80 space-y-1 border border-[#38352F]/40">
              <span className="text-[#B89A4A] font-semibold">Research Observation:</span>
              <p>
                In 105 regions with repeat-flanked indels, the hybrid QAOA formulation produced unambiguous ground-state haplotypes where classical heuristics flagged multi-mapping warnings.
              </p>
            </div>
          </div>

          {/* Recent Experiments Card */}
          <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-2">
              <h3 className="font-serif-sc text-base font-semibold text-[#181715]">
                Recent Experiment Runs
              </h3>
              <button
                onClick={() => onNavigate('experiments')}
                className="text-xs font-mono text-[#8C734B] hover:text-[#181715]"
              >
                Manage Runs
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {EXPERIMENTS_LIST.map((exp) => (
                <div 
                  key={exp.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#EFE9DC]/60 hover:bg-[#EAE2D0] transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#181715] flex items-center gap-1.5">
                      <span>{exp.id}</span>
                      <span className="font-normal text-[11px] text-[#5C5549]">
                        • {exp.qubits > 0 ? `${exp.qubits} Qubits` : 'Classical CPU'}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8C734B] truncate max-w-[200px]">
                      {exp.name}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2E6B48]/10 text-[#2E6B48] font-semibold">
                    {exp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

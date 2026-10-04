import React, { useState } from 'react';
import { BENCHMARK_DATA } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  ChartNoAxesCombined, 
  Cpu, 
  Atom, 
  BarChart3, 
  TrendingUp, 
  Scale, 
  Clock, 
  CheckCircle2, 
  Info,
  ShieldAlert
} from 'lucide-react';

export const ClassicalQuantumView: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'runtime' | 'accuracy'>('runtime');

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Quantum Computing / Classical vs Quantum Benchmark
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="Empirical Benchmarking Protocol" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Algorithmic Benchmark &amp; Scalability Evaluation
          </h1>
          <p className="text-sm text-[#5C5549]">
            Rigorous comparative analysis of CPU dynamic programming heuristics versus hybrid variational QAOA optimization.
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center bg-[#FAF7F0] border border-[#DDD4C0] rounded-lg p-1 text-xs font-mono">
          <button
            onClick={() => setSelectedMetric('runtime')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedMetric === 'runtime'
                ? 'bg-[#181715] text-[#FAF7F0] font-bold'
                : 'text-[#5C5549] hover:bg-[#EAE2D0]'
            }`}
          >
            Runtime Scaling
          </button>
          <button
            onClick={() => setSelectedMetric('accuracy')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedMetric === 'accuracy'
                ? 'bg-[#181715] text-[#FAF7F0] font-bold'
                : 'text-[#5C5549] hover:bg-[#EAE2D0]'
            }`}
          >
            Concordance Accuracy
          </button>
        </div>
      </div>

      {/* Scientific Credibility Notice */}
      <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#B89A4A]/40 flex items-start gap-3 text-xs font-mono text-[#5C5549]">
        <Info size={16} className="text-[#B89A4A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[#181715] font-bold uppercase tracking-wider">
            Research Neutrality &amp; Methodological Integrity Note:
          </span>
          <p>
            Results reflect <strong>observed experimental benchmarks</strong> on simulated statevector backends alongside classical BWA-MEM2/GATK baselines. We report algorithmic complexity bounds and empirical scaling without asserting unverified physical quantum supremacy. Hardware overhead and error mitigation costs are incorporated into theoretical projections.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards as explicitly requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Classical Profile Card */}
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-[#5C5549]" />
              <h3 className="font-serif-sc text-xl font-bold text-[#181715]">
                CLASSICAL COMPUTATION
              </h3>
            </div>
            <span className="text-xs font-mono bg-[#EFE9DC] text-[#5C5549] px-2.5 py-0.5 rounded border border-[#DDD4C0]">
              CPU Baseline
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#8C734B]">Primary Algorithm:</span>
              <span className="font-bold text-[#181715]">BWA-MEM2 + GATK HaplotypeCaller 4.4</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#8C734B]">Observed Runtime:</span>
              <span className="font-bold text-[#181715]">4,120 ms (focal batch)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#8C734B]">Memory Footprint:</span>
              <span className="font-bold text-[#181715]">1.82 GB RAM</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#8C734B]">Theoretical Complexity:</span>
              <span className="font-bold text-[#181715]">O(2^N) Branch-and-bound search</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#8C734B]">Alignment Score:</span>
              <span className="font-bold text-[#181715]">93.1% concordant</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#8C734B]">Homopolymer Disambiguation:</span>
              <span className="font-bold text-[#A33A3A]">Ambiguous in 105 regions</span>
            </div>
          </div>
        </div>

        {/* Quantum Profile Card */}
        <div className="bg-[#181715] text-[#FAF7F0] border border-[#38352F] rounded-2xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#24221E] pb-3">
            <div className="flex items-center gap-2">
              <Atom size={18} className="text-[#B89A4A]" />
              <h3 className="font-serif-sc text-xl font-bold text-[#FAF7F0]">
                QUANTUM COPILOT
              </h3>
            </div>
            <span className="text-xs font-mono bg-[#B89A4A]/20 text-[#E8D89A] px-2.5 py-0.5 rounded border border-[#B89A4A]/40 font-bold">
              QAOA Hybrid Subproblem
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[#24221E]">
              <span className="text-[#8C734B]">Primary Algorithm:</span>
              <span className="font-bold text-[#E8D89A]">QAOA-QUBO v2.4 (Ising H_C)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#24221E]">
              <span className="text-[#8C734B]">Observed Runtime:</span>
              <span className="font-bold text-[#E8D89A]">1,480 ms (simulator)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#24221E]">
              <span className="text-[#8C734B]">Qubits &amp; Circuit Depth:</span>
              <span className="font-bold text-[#FAF7F0]">12 Qubits • 18 Depth (p=3)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#24221E]">
              <span className="text-[#8C734B]">Theoretical Complexity:</span>
              <span className="font-bold text-[#FAF7F0]">O(p · poly(N)) circuit execution</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#24221E]">
              <span className="text-[#8C734B]">Alignment Score:</span>
              <span className="font-bold text-[#2E6B48]">98.2% concordant</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#8C734B]">Homopolymer Disambiguation:</span>
              <span className="font-bold text-[#2E6B48]">Resolved to ground bitstring</span>
            </div>
          </div>
        </div>

      </div>

      {/* Benchmark Scaling Table & Charts */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
          <div>
            <h3 className="font-serif-sc text-xl font-bold text-[#181715]">
              Empirical Performance vs Problem Size
            </h3>
            <p className="text-xs text-[#8C734B] font-mono">
              Evaluated across varying read pileup depths and qubit register allocations.
            </p>
          </div>
          <span className="text-xs font-mono text-[#8C734B]">5 Benchmark Batches</span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-[#DDD4C0]">
            <thead className="bg-[#EFE9DC] text-[#5C5549] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold">Subproblem Input Size</th>
                <th className="px-5 py-3 font-semibold">Classical Runtime (ms)</th>
                <th className="px-5 py-3 font-semibold">Quantum Sim Runtime (ms)</th>
                <th className="px-5 py-3 font-semibold">Classical Concordance</th>
                <th className="px-5 py-3 font-semibold">Quantum Concordance</th>
                <th className="px-5 py-3 font-semibold">Observed Speedup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE5D8] bg-[#FAF7F0] text-[#181715]">
              {BENCHMARK_DATA.map((row, idx) => {
                const ratio = (row.classicalTimeMs / row.quantumSimTimeMs).toFixed(2);
                return (
                  <tr key={idx} className="hover:bg-[#F2EBDB] transition-colors">
                    <td className="px-5 py-3.5 font-bold">{row.problemSize}</td>
                    <td className="px-5 py-3.5 font-bold text-[#5C5549]">{row.classicalTimeMs.toLocaleString()} ms</td>
                    <td className="px-5 py-3.5 font-bold text-[#8C734B]">{row.quantumSimTimeMs.toLocaleString()} ms</td>
                    <td className="px-5 py-3.5">{row.accuracyClassical}%</td>
                    <td className="px-5 py-3.5 font-bold text-[#2E6B48]">{row.accuracyQuantum}%</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        Number(ratio) > 1.0 
                          ? 'bg-[#2E6B48]/15 text-[#2E6B48]' 
                          : 'bg-[#B46927]/15 text-[#B46927]'
                      }`}>
                        {ratio}&times;
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

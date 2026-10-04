import React, { useState } from 'react';
import { QUBO_VARIABLES, QUBO_MATRIX } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  Grid3X3, 
  HelpCircle, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

export const QuboExplorerView: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [selectedVarIndex, setSelectedVarIndex] = useState<number>(0);

  const selectedVariable = QUBO_VARIABLES[selectedVarIndex];
  const cellVal = QUBO_MATRIX[selectedCell.row][selectedCell.col];

  const getHeatmapColor = (val: number) => {
    if (val < -10) return 'bg-[#B89A4A] text-[#11110F] font-bold'; // Strong favorable energy
    if (val < 0) return 'bg-[#E8D89A] text-[#11110F] font-semibold'; // Favorable
    if (val === 0) return 'bg-[#181715] text-[#8C734B]'; // Neutral
    if (val < 5) return 'bg-[#38352F] text-[#FAF7F0]'; // Small penalty
    return 'bg-[#A33A3A] text-white font-bold'; // Severe penalty / violation
  };

  const quboPipelineSteps = [
    { title: 'Genomic Subproblem', desc: 'Read pileup discordance in repetitive region' },
    { title: 'Binary Variables', desc: 'x_i ∈ {0, 1} encoding assignment choices' },
    { title: 'Objective Function', desc: 'Minimizing mismatch penalties & diploid conflicts' },
    { title: 'QUBO Matrix (Q)', desc: 'Diagonal weights (h_i) + off-diagonal couplings (J_ij)' },
    { title: 'Ising Hamiltonian', desc: 'Mapped to Pauli Z spin operators for QAOA' }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Quantum Computing / QUBO Explorer
            </span>
            <ScientificBadge status="THEORETICAL" detail="Quadratic Unconstrained Binary Optimization" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Explainable QUBO Formulation &amp; Couplings
          </h1>
          <p className="text-sm text-[#5C5549]">
            Examine how ambiguous alignment decisions and diploid ploidy constraints map directly into quadratic energy matrices.
          </p>
        </div>
      </div>

      {/* Conceptual Mathematical Pipeline */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
          <h2 className="font-serif-sc text-lg font-semibold text-[#181715]">
            From Genomic Logic to Quadratic Energy Formulation
          </h2>
          <span className="text-xs font-mono text-[#8C734B]">
            Cost Objective H(x) = x^T Q x
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {quboPipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs font-mono space-y-1 ${
                idx === 3 
                  ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A]' 
                  : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0]'
              }`}
            >
              <div className="text-[10px] opacity-70 font-bold">
                0{idx + 1}
              </div>
              <div className="font-bold text-sm tracking-tight">{step.title}</div>
              <p className="text-[11px] font-sans opacity-80 leading-tight">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive QUBO Matrix Heatmap & Variable Biological Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: QUBO Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-[#11110F] text-[#FAF7F0] border border-[#24221E] rounded-2xl p-6 shadow-xl space-y-6 font-mono">
          <div className="flex items-center justify-between border-b border-[#24221E] pb-3 text-xs">
            <div>
              <span className="text-[#E8D89A] font-bold">QUBO MATRIX HEATMAP Q</span>
              <div className="text-[10px] text-[#8C734B]">Diagonal = Linear bias h_i • Off-diagonal = Quadratic coupling J_ij</div>
            </div>
            <span className="text-xs text-[#8C734B]">6 × 6 Matrix</span>
          </div>

          {/* Interactive Heatmap Table */}
          <div className="overflow-x-auto dark-scroll pb-2">
            <div className="inline-block min-w-full">
              {/* Column labels */}
              <div className="grid grid-cols-7 gap-2 pb-2 text-center text-xs text-[#E8D89A]">
                <div className="text-[#8C734B]">Q</div>
                {QUBO_VARIABLES.map(v => (
                  <div key={v.index} className="font-bold">{v.label}</div>
                ))}
              </div>

              {/* Rows */}
              {QUBO_MATRIX.map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-7 gap-2 py-1 items-center">
                  {/* Row label */}
                  <div className="text-center text-xs text-[#E8D89A] font-bold">
                    {QUBO_VARIABLES[rIdx].label}
                  </div>

                  {/* Cell buttons */}
                  {row.map((val, cIdx) => {
                    const isSelected = selectedCell.row === rIdx && selectedCell.col === cIdx;

                    return (
                      <button
                        key={cIdx}
                        onClick={() => {
                          setSelectedCell({ row: rIdx, col: cIdx });
                          setSelectedVarIndex(rIdx);
                        }}
                        className={`h-11 rounded-lg text-xs transition-all flex items-center justify-center cursor-pointer ${getHeatmapColor(val)} ${
                          isSelected ? 'ring-2 ring-white scale-105 shadow-md' : 'hover:opacity-90'
                        }`}
                        title={`Q[${rIdx}, ${cIdx}] = ${val}`}
                      >
                        {val > 0 ? `+${val}` : val}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#24221E] text-xs text-[#8C734B]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#B89A4A]" /> Ground favorable (&lt; -10)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#E8D89A]" /> Favorable energy (&lt; 0)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#A33A3A]" /> Conflict penalty (&gt; 5)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Biological Meaning & Cell Explanation (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-6 font-mono text-xs">
          <div className="border-b border-[#EBE5D8] pb-3">
            <span className="text-[10px] text-[#8C734B] uppercase">Explainable Formulation</span>
            <h3 className="font-serif-sc text-xl font-bold text-[#181715] mt-1">
              Cell Q[{selectedCell.row}, {selectedCell.col}] = {cellVal > 0 ? `+${cellVal}` : cellVal}
            </h3>
            <p className="text-[11px] text-[#5C5549] font-sans mt-1">
              {selectedCell.row === selectedCell.col 
                ? 'Linear local field bias promoting or penalizing this specific binary decision.'
                : 'Mutual quadratic coupling term regulating co-occurrence between both variables.'
              }
            </p>
          </div>

          {/* Interacting Variables Deep Dive */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#EFE9DC] border border-[#DDD4C0] space-y-1">
              <span className="text-[10px] text-[#8C734B] uppercase font-bold">
                Variable {QUBO_VARIABLES[selectedCell.row].label} Biological Meaning:
              </span>
              <div className="text-xs font-bold text-[#181715]">
                {QUBO_VARIABLES[selectedCell.row].biologicalMeaning}
              </div>
            </div>

            {selectedCell.row !== selectedCell.col && (
              <div className="p-3.5 rounded-xl bg-[#EFE9DC] border border-[#DDD4C0] space-y-1">
                <span className="text-[10px] text-[#8C734B] uppercase font-bold">
                  Coupled Variable {QUBO_VARIABLES[selectedCell.col].label} Meaning:
                </span>
                <div className="text-xs font-bold text-[#181715]">
                  {QUBO_VARIABLES[selectedCell.col].biologicalMeaning}
                </div>
              </div>
            )}
          </div>

          {/* Variable Selector List */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] text-[#8C734B] uppercase font-bold">All Problem Variables:</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {QUBO_VARIABLES.map(v => (
                <div
                  key={v.index}
                  onClick={() => {
                    setSelectedVarIndex(v.index);
                    setSelectedCell({ row: v.index, col: v.index });
                  }}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedVarIndex === v.index
                      ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A]'
                      : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0] hover:bg-[#F2EBDB]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{v.label}</span>
                    <span className="text-[10px] opacity-80">Bit: {v.assignedBit}</span>
                  </div>
                  <div className="text-[11px] font-sans opacity-90 truncate">
                    {v.biologicalMeaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Contribution Callout */}
          <div className="p-3 rounded-lg bg-[#2E6B48]/10 border border-[#2E6B48]/30 text-[11px] text-[#2E6B48] flex items-center justify-between">
            <span>Optimal State Assignment:</span>
            <span className="font-bold">x* = (1, 0, 1, 1, 0, 1)</span>
          </div>
        </div>

      </div>
    </div>
  );
};

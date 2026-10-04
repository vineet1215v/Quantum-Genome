import React, { useState } from 'react';
import { EXPERIMENTS_LIST, CURRENT_EXPERIMENT } from '../../data/mockData';
import { Experiment, NavigationTab } from '../../types';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  FlaskConical, 
  Copy, 
  Download, 
  Archive, 
  Play, 
  CheckCircle2, 
  Clock, 
  Atom, 
  Cpu, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ExperimentsViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const ExperimentsView: React.FC<ExperimentsViewProps> = ({
  onNavigate
}) => {
  const [experiments, setExperiments] = useState<Experiment[]>(EXPERIMENTS_LIST);
  const [selectedExp, setSelectedExp] = useState<Experiment>(CURRENT_EXPERIMENT);

  const duplicateExperiment = (exp: Experiment) => {
    const newId = `EXP-2026-${String(experiments.length + 14).padStart(3, '0')}`;
    const copy: Experiment = {
      ...exp,
      id: newId,
      name: `${exp.name} (Copy)`,
      date: 'Just now',
      status: 'Queued'
    };
    setExperiments([copy, ...experiments]);
    setSelectedExp(copy);
  };

  const exportExperimentJson = (exp: Experiment) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exp, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${exp.id}_metadata.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Research / Experiment Manager
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="Reproducible Computational Runs" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Computational Experiment Tracking &amp; Provenance
          </h1>
          <p className="text-sm text-[#5C5549]">
            Full provenance tracking of hybrid quantum variational parameters, seeds, datasets, and runtime telemetry.
          </p>
        </div>

        <button
          onClick={() => duplicateExperiment(selectedExp)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-colors shadow-sm"
        >
          <FlaskConical size={14} className="text-[#E8D89A]" />
          <span>New Experiment Run</span>
        </button>
      </div>

      {/* Main Grid: Experiment List & Selected Experiment Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Left: Experiment Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD4C0]">
            <span className="text-xs text-[#8C734B] uppercase">Registered Experiments ({experiments.length})</span>
            <span className="text-xs text-[#5C5549]">Active: {CURRENT_EXPERIMENT.id}</span>
          </div>

          <div className="space-y-3">
            {experiments.map((exp) => {
              const isSelected = selectedExp.id === exp.id;
              const isActive = CURRENT_EXPERIMENT.id === exp.id;

              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExp(exp)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF7F0] border-[#B89A4A] ring-2 ring-[#B89A4A]/20 shadow-md'
                      : 'bg-[#FAF7F0] border-[#DDD4C0] hover:bg-[#F2EBDB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#181715] text-sm">{exp.id}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded bg-[#2E6B48]/15 text-[#2E6B48] font-bold text-[10px]">
                          ACTIVE WORKSPACE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8C734B]">{exp.date}</span>
                  </div>

                  <h3 className="font-serif-sc text-base font-bold text-[#181715] mb-1 font-sans">
                    {exp.name}
                  </h3>
                  <p className="text-[11px] text-[#5C5549] font-sans line-clamp-2 mb-3">
                    {exp.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-[#EBE5D8] text-[10px]">
                    <div>
                      <span className="text-[#8C734B]">Backend:</span>
                      <div className="font-bold text-[#181715] truncate">{exp.quantumBackend}</div>
                    </div>
                    <div>
                      <span className="text-[#8C734B]">Qubits / Depth:</span>
                      <div className="font-bold text-[#181715]">{exp.qubits > 0 ? `${exp.qubits}q / p=${exp.layers}` : 'Classical CPU'}</div>
                    </div>
                    <div>
                      <span className="text-[#8C734B]">Variants:</span>
                      <div className="font-bold text-[#2E6B48]">{exp.variantsDetected} calls</div>
                    </div>
                  </div>

                  {/* Actions toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EBE5D8] text-[11px]">
                    <span className="text-[#8C734B]">Runtime: {exp.runtimeQuantumMs + exp.runtimeClassicalMs} ms</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateExperiment(exp);
                        }}
                        className="p-1.5 rounded hover:bg-[#EAE2D0] text-[#5C5549]"
                        title="Duplicate Experiment"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportExperimentJson(exp);
                        }}
                        className="p-1.5 rounded hover:bg-[#EAE2D0] text-[#5C5549]"
                        title="Export JSON"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Experiment Detailed Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#EBE5D8] pb-3">
            <span className="text-[10px] text-[#8C734B] uppercase">Experiment Specification</span>
            <h3 className="font-serif-sc text-2xl font-bold text-[#181715] mt-1">
              {selectedExp.id}
            </h3>
            <p className="text-xs text-[#5C5549] mt-1 font-sans">
              {selectedExp.name}
            </p>
          </div>

          {/* Key Parameters */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#EFE9DC] border border-[#DDD4C0] space-y-1">
              <span className="text-[10px] text-[#8C734B] uppercase font-bold">Target Dataset:</span>
              <div className="font-bold text-[#181715] text-xs">{selectedExp.dataset}</div>
              <div className="text-[10px] text-[#5C5549]">Reference Contig: {selectedExp.referenceGenome}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#EFE9DC] border border-[#DDD4C0] space-y-1">
              <span className="text-[10px] text-[#8C734B] uppercase font-bold">Algorithm &amp; Ansatz:</span>
              <div className="font-bold text-[#181715] text-xs">{selectedExp.algorithm}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#DDD4C0]">
                <span className="text-[#8C734B]">Qubits:</span>
                <div className="font-bold text-sm text-[#181715]">{selectedExp.qubits}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#DDD4C0]">
                <span className="text-[#8C734B]">Layers:</span>
                <div className="font-bold text-sm text-[#181715]">{selectedExp.layers}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#DDD4C0]">
                <span className="text-[#8C734B]">Shots:</span>
                <div className="font-bold text-sm text-[#181715]">{selectedExp.shots}</div>
              </div>
            </div>
          </div>

          {/* Reproducibility Specification */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#8C734B] uppercase font-bold">Scientific Reproducibility:</span>
            <div className="p-3.5 rounded-xl bg-[#181715] text-[#FAF7F0] border border-[#38352F] space-y-1 text-[11px]">
              <div className="text-[#E8D89A]">PRNG Seed: <strong>0x4A2B81F9 (42)</strong></div>
              <div className="text-[#DDD4C0]/80">Simulator Engine: PennyLane Statevector v1.8</div>
              <div className="text-[#DDD4C0]/80">QUBO Penalty Lambda: λ = 2.50</div>
              <div className="text-[#2E6B48] font-bold pt-1">&check; Deterministic hash validated</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-2.5 rounded-lg bg-[#181715] text-[#FAF7F0] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#24221E] transition-colors"
            >
              <Play size={13} className="text-[#E8D89A]" />
              <span>Load into Workspace</span>
            </button>
            <button
              onClick={() => exportExperimentJson(selectedExp)}
              className="w-full py-2 rounded-lg border border-[#DDD4C0] bg-[#FAF7F0] text-[#181715] font-semibold text-xs hover:bg-[#EAE2D0] transition-colors"
            >
              Export Complete Run Bundle (.json)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

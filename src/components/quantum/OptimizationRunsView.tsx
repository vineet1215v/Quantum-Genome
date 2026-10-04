import React, { useState, useEffect } from 'react';
import { QAOA_CONVERGENCE_DATA, CURRENT_EXPERIMENT } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  TrendingDown, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Layers,
  Activity,
  AlertCircle
} from 'lucide-react';

export const OptimizationRunsView: React.FC = () => {
  const [qubits, setQubits] = useState<number>(12);
  const [layers, setLayers] = useState<number>(3);
  const [optimizer, setOptimizer] = useState<string>('COBYLA');
  const [shots, setShots] = useState<number>(2048);
  const [maxIterations, setMaxIterations] = useState<number>(30);
  const [backend, setBackend] = useState<string>('Simulator');

  // Simulation execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentIter, setCurrentIter] = useState<number>(30);
  const [convergenceHistory, setConvergenceHistory] = useState(QAOA_CONVERGENCE_DATA);

  // Live animation runner
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isRunning) {

      if (currentIter < maxIterations) {
        timer = setTimeout(() => {
          setCurrentIter(prev => prev + 1);
          // Progressively compute energy
          const newEnergy = -4.2 - (34.44 * ((currentIter + 1) / maxIterations));
          setConvergenceHistory(prev => [
            ...prev,
            {
              iteration: currentIter + 1,
              energy: Number(newEnergy.toFixed(2)),
              expectation: Number((newEnergy + 0.4).toFixed(2)),
              overlap: Number((0.15 + 0.8 * ((currentIter + 1) / maxIterations)).toFixed(2))
            }
          ]);
        }, 120);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentIter, maxIterations]);

  const handleStartRun = () => {
    setConvergenceHistory([{ iteration: 1, energy: -4.2, expectation: -3.8, overlap: 0.12 }]);
    setCurrentIter(1);
    setIsRunning(true);
  };

  const currentEnergy = convergenceHistory[convergenceHistory.length - 1]?.energy || -38.64;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Quantum Computing / Optimization Runs
            </span>
            <ScientificBadge status="SIMULATED" detail="QAOA Variational Loop" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            QAOA Variational Experiment Runner
          </h1>
          <p className="text-sm text-[#5C5549]">
            Configure parameterized quantum circuits, run classical-quantum optimizer loops, and observe ground-state convergence.
          </p>
        </div>

        {/* Primary CTA Run Button */}
        <button
          onClick={handleStartRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#B89A4A] to-[#D4B76B] text-[#11110F] hover:brightness-110 active:scale-98 transition-all shadow-md disabled:opacity-50"
        >
          <Play size={14} className={isRunning ? 'animate-spin' : ''} />
          <span>{isRunning ? `Optimizing Iteration ${currentIter}/${maxIterations}...` : 'Run QAOA Experiment'}</span>
        </button>
      </div>

      {/* Control Configuration Panel */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 shadow-xs space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
          <span className="font-serif-sc text-lg font-bold text-[#181715]">
            Hyperparameter &amp; Hardware Configuration
          </span>
          <span className="text-xs text-[#8C734B]">PennyLane / Qiskit Backend Engine</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Qubits */}
          <div className="space-y-1.5">
            <label className="text-[#8C734B]">Qubits (n):</label>
            <select
              value={qubits}
              onChange={(e) => setQubits(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-[#EFE9DC] border border-[#DDD4C0] rounded-lg p-2 text-xs font-bold text-[#181715]"
            >
              <option value={8}>8 Qubits</option>
              <option value={10}>10 Qubits</option>
              <option value={12}>12 Qubits (Default)</option>
              <option value={14}>14 Qubits</option>
              <option value={16}>16 Qubits (Max Sim)</option>
            </select>
          </div>

          {/* QAOA Layers */}
          <div className="space-y-1.5">
            <label className="text-[#8C734B]">Circuit Depth (p):</label>
            <select
              value={layers}
              onChange={(e) => setLayers(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-[#EFE9DC] border border-[#DDD4C0] rounded-lg p-2 text-xs font-bold text-[#181715]"
            >
              <option value={1}>p = 1 (Fastest)</option>
              <option value={2}>p = 2</option>
              <option value={3}>p = 3 (Balanced)</option>
              <option value={4}>p = 4</option>
              <option value={5}>p = 5 (Deep)</option>
            </select>
          </div>

          {/* Optimizer */}
          <div className="space-y-1.5">
            <label className="text-[#8C734B]">Classical Optimizer:</label>
            <select
              value={optimizer}
              onChange={(e) => setOptimizer(e.target.value)}
              disabled={isRunning}
              className="w-full bg-[#EFE9DC] border border-[#DDD4C0] rounded-lg p-2 text-xs font-bold text-[#181715]"
            >
              <option value="COBYLA">COBYLA (Constrained)</option>
              <option value="Nelder-Mead">Nelder-Mead Simplex</option>
              <option value="Adam">Adam Gradient</option>
              <option value="SPSA">SPSA (Stochastic)</option>
            </select>
          </div>

          {/* Shots */}
          <div className="space-y-1.5">
            <label className="text-[#8C734B]">Measurement Shots:</label>
            <select
              value={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-[#EFE9DC] border border-[#DDD4C0] rounded-lg p-2 text-xs font-bold text-[#181715]"
            >
              <option value={1024}>1,024 shots</option>
              <option value={2048}>2,048 shots</option>
              <option value={4096}>4,096 shots</option>
              <option value={8192}>8,192 shots</option>
            </select>
          </div>

          {/* Iterations */}
          <div className="space-y-1.5">
            <label className="text-[#8C734B]">Max Iterations:</label>
            <select
              value={maxIterations}
              onChange={(e) => setMaxIterations(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-[#EFE9DC] border border-[#DDD4C0] rounded-lg p-2 text-xs font-bold text-[#181715]"
            >
              <option value={15}>15 iterations</option>
              <option value={30}>30 iterations</option>
              <option value={50}>50 iterations</option>
            </select>
          </div>

          {/* Backend */}
          <div className="space-y-1.5">
            <label className="text-[#8C734B]">Execution Mode:</label>
            <select
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
              disabled={isRunning}
              className="w-full bg-[#EFE9DC] border border-[#DDD4C0] rounded-lg p-2 text-xs font-bold text-[#181715]"
            >
              <option value="Simulator">Simulator (Statevector)</option>
              <option value="NoisySim">Simulator (Density Matrix)</option>
              <option value="HardwareAPI">Hardware Mode (Simulated)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Convergence Chart & Live Optimization Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Convergence Graph (8 cols) */}
        <div className="lg:col-span-8 bg-[#11110F] text-[#FAF7F0] border border-[#24221E] rounded-2xl p-6 lg:p-8 shadow-xl space-y-6 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#24221E] pb-4 text-xs">
            <div>
              <span className="text-[#E8D89A] font-bold">QAOA OBJECTIVE CONVERGENCE</span>
              <div className="text-[10px] text-[#8C734B]">⟨ψ(γ, β)| H_C |ψ(γ, β)⟩ vs Iteration Step</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#2E6B48] font-bold">
                E* = {currentEnergy}
              </span>
              <span className="text-xs text-[#8C734B]">
                Iter: {currentIter} / {maxIterations}
              </span>
            </div>
          </div>

          {/* Convergence Chart SVG */}
          <div className="relative h-64 w-full bg-[#181715] rounded-xl border border-[#38352F] p-4 flex flex-col justify-between">
            {/* Y axis labels */}
            <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-[10px] text-[#8C734B] select-none pointer-events-none">
              <span>0.0</span>
              <span>-10.0</span>
              <span>-20.0</span>
              <span>-30.0</span>
              <span>-40.0</span>
            </div>

            {/* SVG Plot Line */}
            <svg className="w-full h-full pl-8 pb-4 overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#24221E" strokeDasharray="3 3" />
              <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#24221E" strokeDasharray="3 3" />
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#24221E" strokeDasharray="3 3" />
              <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#24221E" strokeDasharray="3 3" />

              {/* Convergence Curve Polyline */}
              <polyline
                fill="none"
                stroke="#E8D89A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={convergenceHistory.map((pt, i) => {
                  const x = (pt.iteration / maxIterations) * 100;
                  // Map energy -4.2 to -40.0 into 10% to 90%
                  const y = Math.min(95, Math.max(5, (Math.abs(pt.energy) / 40) * 85));
                  return `${x}%,${y}%`;
                }).join(' ')}
              />

              {/* Data points */}
              {convergenceHistory.map((pt, i) => {
                const x = (pt.iteration / maxIterations) * 100;
                const y = Math.min(95, Math.max(5, (Math.abs(pt.energy) / 40) * 85));
                return (
                  <circle
                    key={i}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="3.5"
                    fill="#B89A4A"
                    stroke="#11110F"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between pl-8 text-[10px] text-[#8C734B] select-none">
              <span>Iter 1</span>
              <span>Iter 10</span>
              <span>Iter 20</span>
              <span>Iter 30</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#24221E] text-[11px] text-[#DDD4C0]/80 flex items-center justify-between border border-[#38352F]/60">
            <span>Minimum Energy Reached: <strong className="text-[#E8D89A]">-38.64</strong></span>
            <span>Ground-State Probability: <strong className="text-[#2E6B48]">94.2%</strong></span>
          </div>
        </div>

        {/* Right: Telemetry & Result Bitstring (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-6 font-mono text-xs">
          <div className="border-b border-[#EBE5D8] pb-3">
            <span className="text-[10px] text-[#8C734B] uppercase">Optimal Run Result</span>
            <h3 className="font-serif-sc text-xl font-bold text-[#181715] mt-1">
              Sampled Solution
            </h3>
          </div>

          {/* Best Bitstring Card */}
          <div className="p-4 rounded-xl bg-[#181715] text-[#FAF7F0] border border-[#38352F] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#8C734B]">
              <span>BEST MEASURED BITSTRING</span>
              <span className="text-[#2E6B48] font-bold">OPTIMAL</span>
            </div>
            <div className="text-2xl font-bold text-[#E8D89A] tracking-widest text-center py-1">
              |101101⟩
            </div>
            <div className="text-[10px] text-center text-[#DDD4C0]/70">
              Corresponds to: Read#1 &rarr; HapA, Read#2 &rarr; HapB (Heterozygous)
            </div>
          </div>

          {/* Telemetry Metrics List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#5C5549]">Objective Value:</span>
              <span className="font-bold text-[#181715]">{currentEnergy}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#5C5549]">Execution Time:</span>
              <span className="font-bold text-[#181715]">1,480 ms</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#5C5549]">Total Circuit Depth:</span>
              <span className="font-bold text-[#181715]">18 gates</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#EBE5D8]">
              <span className="text-[#5C5549]">Confidence Metric:</span>
              <span className="font-bold text-[#2E6B48]">0.992</span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="p-3 rounded-lg bg-[#2E6B48]/10 border border-[#2E6B48]/30 text-[11px] text-[#2E6B48] flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>Convergence criteria met with tolerance &epsilon; &lt; 10⁻⁴</span>
          </div>
        </div>

      </div>
    </div>
  );
};

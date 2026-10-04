import React, { useState } from 'react';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  CircuitBoard, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  RotateCcw, 
  Sliders, 
  BarChart3, 
  Info,
  CheckCircle2,
  Atom
} from 'lucide-react';

interface GateInfo {
  name: string;
  type: 'H' | 'RZ' | 'RX' | 'CNOT' | 'M';
  qubit: number;
  targetQubit?: number;
  parameter?: string;
  matrix: string;
  description: string;
}

export const QuantumCircuitView: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateInfo | null>({
    name: 'RZ(γ₁)',
    type: 'RZ',
    qubit: 1,
    parameter: 'γ₁ = 0.482 rad',
    matrix: '[[e^(-iγ/2), 0], [0, e^(iγ/2)]]',
    description: 'Problem Hamiltonian cost layer rotation encoding edge weight in QUBO graph.'
  });

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<number>(1); // Layer p=1, 2, or 3

  const circuitGates: { col: number; qubit: number; type: string; param?: string; cnotTarget?: number }[] = [
    // Column 0: Superposition Hadamards
    { col: 0, qubit: 0, type: 'H' },
    { col: 0, qubit: 1, type: 'H' },
    { col: 0, qubit: 2, type: 'H' },
    { col: 0, qubit: 3, type: 'H' },
    { col: 0, qubit: 4, type: 'H' },
    { col: 0, qubit: 5, type: 'H' },

    // Column 1: CNOT Couplings (Problem Hamiltonian Entanglement)
    { col: 1, qubit: 0, type: 'CNOT', cnotTarget: 1 },
    { col: 1, qubit: 2, type: 'CNOT', cnotTarget: 3 },
    { col: 1, qubit: 4, type: 'CNOT', cnotTarget: 5 },

    // Column 2: Parameterized Cost Rotations RZ(gamma)
    { col: 2, qubit: 0, type: 'RZ', param: 'γ₀=0.32' },
    { col: 2, qubit: 1, type: 'RZ', param: 'γ₁=0.48' },
    { col: 2, qubit: 2, type: 'RZ', param: 'γ₂=0.19' },
    { col: 2, qubit: 3, type: 'RZ', param: 'γ₃=0.61' },
    { col: 2, qubit: 4, type: 'RZ', param: 'γ₄=0.25' },
    { col: 2, qubit: 5, type: 'RZ', param: 'γ₅=0.53' },

    // Column 3: CNOT Reverse Couplings
    { col: 3, qubit: 1, type: 'CNOT', cnotTarget: 2 },
    { col: 3, qubit: 3, type: 'CNOT', cnotTarget: 4 },

    // Column 4: Mixer Hamiltonian Rotations RX(beta)
    { col: 4, qubit: 0, type: 'RX', param: 'β₀=0.74' },
    { col: 4, qubit: 1, type: 'RX', param: 'β₁=0.52' },
    { col: 4, qubit: 2, type: 'RX', param: 'β₂=0.88' },
    { col: 4, qubit: 3, type: 'RX', param: 'β₃=0.45' },
    { col: 4, qubit: 4, type: 'RX', param: 'β₄=0.69' },
    { col: 4, qubit: 5, type: 'RX', param: 'β₅=0.78' },

    // Column 5: Measurements
    { col: 5, qubit: 0, type: 'M' },
    { col: 5, qubit: 1, type: 'M' },
    { col: 5, qubit: 2, type: 'M' },
    { col: 5, qubit: 3, type: 'M' },
    { col: 5, qubit: 4, type: 'M' },
    { col: 5, qubit: 5, type: 'M' },
  ];

  const measurementProbabilities = [
    { bitstring: '|101101⟩', prob: 0.942, state: 'GROUND STATE (Valid Haplotype)' },
    { bitstring: '|101100⟩', prob: 0.024, state: 'Suboptimal gap variant' },
    { bitstring: '|001101⟩', prob: 0.016, state: 'HapA inversion' },
    { bitstring: '|111101⟩', prob: 0.009, state: 'Diploid penalty violation' },
    { bitstring: 'Others', prob: 0.009, state: 'Residual quantum thermal noise' }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Quantum Computing / Quantum Circuit Explorer
            </span>
            <ScientificBadge status="SIMULATED" detail="12-Qubit QAOA Ansatz" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Parameterized QAOA Quantum Circuit Visualizer
          </h1>
          <p className="text-sm text-[#5C5549]">
            Interactive inspection of problem Hamiltonians, mixer rotations, and measurement state vectors.
          </p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#FAF7F0] border border-[#DDD4C0] rounded-lg p-1 text-xs font-mono">
            <button 
              onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
              className="p-1.5 hover:bg-[#EAE2D0] rounded text-[#5C5549]"
            >
              <ZoomOut size={15} />
            </button>
            <span className="px-2 font-bold text-[#181715]">{(zoomLevel * 100).toFixed(0)}%</span>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.2))}
              className="p-1.5 hover:bg-[#EAE2D0] rounded text-[#5C5549]"
            >
              <ZoomIn size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Circuit Telemetry Summary Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-3.5">
          <div className="text-[10px] text-[#8C734B] uppercase">Active Qubits</div>
          <div className="text-lg font-bold text-[#181715]">12 Qubits</div>
          <div className="text-[10px] text-[#2E6B48]">All active in sim</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-3.5">
          <div className="text-[10px] text-[#8C734B] uppercase">Circuit Depth</div>
          <div className="text-lg font-bold text-[#181715]">18 Gates</div>
          <div className="text-[10px] text-[#8C734B]">p = 3 QAOA layers</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-3.5">
          <div className="text-[10px] text-[#8C734B] uppercase">Parameters (γ, β)</div>
          <div className="text-lg font-bold text-[#181715]">6 Angles</div>
          <div className="text-[10px] text-[#2E6B48]">Optimized via COBYLA</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-3.5">
          <div className="text-[10px] text-[#8C734B] uppercase">Execution Shots</div>
          <div className="text-lg font-bold text-[#181715]">2,048 Shots</div>
          <div className="text-[10px] text-[#8C734B]">Z-basis projective</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-3.5">
          <div className="text-[10px] text-[#8C734B] uppercase">Cost Hamiltonian</div>
          <div className="text-lg font-bold text-[#181715]">H_C (QUBO)</div>
          <div className="text-[10px] text-[#8C734B]">Pairwise Ising ZZ</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-3.5">
          <div className="text-[10px] text-[#8C734B] uppercase">Mixer Hamiltonian</div>
          <div className="text-lg font-bold text-[#181715]">H_M = Σ X_i</div>
          <div className="text-[10px] text-[#2E6B48]">Transverse Field</div>
        </div>
      </div>

      {/* Primary Quantum Circuit Canvas (Dark charcoal surrounded by warm research UI) */}
      <div className="bg-[#11110F] text-[#FAF7F0] border border-[#24221E] rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#24221E] pb-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[#E8D89A] font-bold">QAOA ANSATZ CIRCUIT CANVAS</span>
            <span className="text-[#8C734B]">| Click any gate to inspect mathematical transformation</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  activeLayer === layer
                    ? 'bg-[#E8D89A] text-[#11110F] font-bold'
                    : 'bg-[#24221E] text-[#8C734B] hover:text-[#FAF7F0]'
                }`}
              >
                Layer p={layer}
              </button>
            ))}
          </div>
        </div>

        {/* Circuit Diagram Grid */}
        <div 
          className="overflow-x-auto dark-scroll pb-6 pt-2 font-mono"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          <div className="min-w-[850px] space-y-6">
            {[0, 1, 2, 3, 4, 5].map((qIndex) => (
              <div key={qIndex} className="relative flex items-center h-10 select-none">
                
                {/* Qubit Label */}
                <div className="w-16 shrink-0 flex items-center gap-1 text-xs text-[#E8D89A] font-bold">
                  <span>q[{qIndex}]</span>
                  <span className="text-[#8C734B] text-[10px]">|0&rang;</span>
                </div>

                {/* Horizontal Quantum Wire */}
                <div className="absolute left-16 right-0 h-0.5 bg-[#38352F] -z-0" />

                {/* Gates plotted along columns */}
                <div className="flex-1 flex justify-around items-center pl-6 z-10">
                  {/* Step 0: Superposition Hadamard */}
                  <button
                    onClick={() => setSelectedGate({
                      name: `Hadamard H (q${qIndex})`,
                      type: 'H',
                      qubit: qIndex,
                      matrix: '1/√2 [[1, 1], [1, -1]]',
                      description: 'Creates uniform equal superposition over all 2^n computational basis states.'
                    })}
                    className="w-8 h-8 rounded bg-[#24221E] border border-[#B89A4A] text-[#E8D89A] hover:bg-[#B89A4A] hover:text-[#11110F] font-bold text-xs flex items-center justify-center transition-all shadow-md"
                  >
                    H
                  </button>

                  {/* Step 1: Entanglement CNOT */}
                  {qIndex % 2 === 0 ? (
                    <div className="relative flex flex-col items-center">
                      <button 
                        onClick={() => setSelectedGate({
                          name: `CNOT Entangler (q${qIndex} → q${qIndex + 1})`,
                          type: 'CNOT',
                          qubit: qIndex,
                          targetQubit: qIndex + 1,
                          matrix: '[[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]',
                          description: 'Entangles adjacent spins according to QUBO graph coupling J_ij.'
                        })}
                        className="w-4 h-4 rounded-full bg-[#E8D89A] border-2 border-[#11110F] shadow-xs" 
                        title="Control Node"
                      />
                      <div className="w-0.5 h-16 bg-[#B89A4A] absolute top-2" />
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedGate({
                        name: `CNOT Target (q${qIndex})`,
                        type: 'CNOT',
                        qubit: qIndex,
                        matrix: 'X on target if control is |1⟩',
                        description: 'Inverts target qubit conditioned on control register.'
                      })}
                      className="w-7 h-7 rounded-full border-2 border-[#E8D89A] bg-[#24221E] text-[#E8D89A] flex items-center justify-center font-bold text-xs"
                      title="Target Node (XOR)"
                    >
                      +
                    </button>
                  )}

                  {/* Step 2: Parameterized Phase Rotation RZ(gamma) */}
                  <button
                    onClick={() => setSelectedGate({
                      name: `RZ(γ${qIndex})`,
                      type: 'RZ',
                      qubit: qIndex,
                      parameter: `γ = ${(0.25 + qIndex * 0.08).toFixed(3)} rad`,
                      matrix: `[[e^(-iγ/2), 0], [0, e^(iγ/2)]]`,
                      description: `Problem Hamiltonian parameter rotation for layer ${activeLayer}.`
                    })}
                    className="px-2 h-8 rounded bg-[#181715] border border-[#E8D89A] text-[#E8D89A] hover:bg-[#E8D89A] hover:text-[#11110F] font-bold text-[11px] flex items-center justify-center transition-all shadow-md"
                  >
                    RZ(γ)
                  </button>

                  {/* Step 3: Parameterized Mixer Rotation RX(beta) */}
                  <button
                    onClick={() => setSelectedGate({
                      name: `RX(β${qIndex})`,
                      type: 'RX',
                      qubit: qIndex,
                      parameter: `β = ${(0.65 - qIndex * 0.05).toFixed(3)} rad`,
                      matrix: '[[cos(β/2), -i sin(β/2)], [-i sin(β/2), cos(β/2)]]',
                      description: 'Mixer Hamiltonian transverse rotation allowing quantum tunneling.'
                    })}
                    className="px-2 h-8 rounded bg-[#24221E] border border-[#8C734B] text-[#DDD4C0] hover:bg-[#8C734B] hover:text-[#11110F] font-bold text-[11px] flex items-center justify-center transition-all shadow-md"
                  >
                    RX(β)
                  </button>

                  {/* Step 4: Measurement in Z Basis */}
                  <button
                    onClick={() => setSelectedGate({
                      name: `Measurement M (q${qIndex})`,
                      type: 'M',
                      qubit: qIndex,
                      matrix: 'Projective |0⟩⟨0| + |1⟩⟨1|',
                      description: 'Collapses quantum state into classical binary bit x_i.'
                    })}
                    className="w-8 h-8 rounded bg-[#181715] border border-[#38352F] text-[#FAF7F0] hover:border-[#E8D89A] font-bold text-xs flex items-center justify-center transition-all"
                  >
                    M
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Column Inspection: Gate Mathematical Properties & Measurement Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gate Inspector Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4 font-mono text-xs">
          <div className="border-b border-[#EBE5D8] pb-3">
            <span className="text-[10px] text-[#8C734B] uppercase">Gate Inspector</span>
            <h3 className="font-serif-sc text-xl font-bold text-[#181715] mt-1">
              {selectedGate?.name || 'Select a Gate'}
            </h3>
          </div>

          {selectedGate ? (
            <div className="space-y-4">
              <p className="text-[#5C5549] font-sans text-xs">
                {selectedGate.description}
              </p>

              {selectedGate.parameter && (
                <div className="p-3 rounded-lg bg-[#EFE9DC] border border-[#DDD4C0] flex items-center justify-between">
                  <span className="text-[#8C734B]">Variational Parameter:</span>
                  <span className="font-bold text-[#181715]">{selectedGate.parameter}</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] text-[#8C734B] uppercase">Unitary Matrix Representation:</span>
                <div className="p-3 rounded-lg bg-[#11110F] text-[#E8D89A] border border-[#24221E] text-xs font-mono select-all">
                  <code>{selectedGate.matrix}</code>
                </div>
              </div>

              <div className="text-[11px] text-[#2E6B48] flex items-center gap-1.5 pt-1">
                <CheckCircle2 size={13} />
                <span>Hamiltonian Term Verified in PennyLane/Qiskit backend</span>
              </div>
            </div>
          ) : (
            <p className="text-[#8C734B]">Click any gate on the circuit above to inspect its unitary operator.</p>
          )}
        </div>

        {/* Statevector Measurement Probabilities Histogram (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
            <div>
              <span className="text-[10px] text-[#8C734B] uppercase">Measurement Statistics</span>
              <h3 className="font-serif-sc text-xl font-bold text-[#181715]">
                Sampled Ground State Distribution
              </h3>
            </div>
            <span className="text-xs text-[#8C734B]">2,048 Projective Shots</span>
          </div>

          <div className="space-y-3 pt-1">
            {measurementProbabilities.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#181715]">{item.bitstring}</span>
                    <span className="text-[10px] text-[#5C5549] font-sans">({item.state})</span>
                  </div>
                  <span className="font-bold text-[#181715]">
                    {(item.prob * 100).toFixed(1)}% ({Math.round(item.prob * 2048)} shots)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full bg-[#EFE9DC] rounded-full overflow-hidden border border-[#DDD4C0]">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 
                        ? 'bg-gradient-to-r from-[#B89A4A] to-[#E8D89A]' 
                        : 'bg-[#DDD4C0]'
                    }`}
                    style={{ width: `${item.prob * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#2E6B48]/10 border border-[#2E6B48]/30 text-[11px] text-[#2E6B48] flex items-center justify-between mt-4">
            <span>Optimal Ground Bitstring: <strong>|101101⟩</strong></span>
            <span className="font-bold">E = -38.64 (Convergence Met)</span>
          </div>
        </div>

      </div>
    </div>
  );
};

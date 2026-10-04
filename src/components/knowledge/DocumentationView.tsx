import React from 'react';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  FileCode, 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Knowledge / Documentation
            </span>
            <ScientificBadge status="THEORETICAL" detail="API Reference v2.4" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Technical API &amp; Algorithm Documentation
          </h1>
          <p className="text-sm text-[#5C5549]">
            Python SDK, PennyLane/Qiskit Hamiltonians, CIGAR string parsing, and CLI toolchain reference.
          </p>
        </div>
      </div>

      {/* Code Snippets & Architecture Reference */}
      <div className="space-y-6 font-mono text-xs">
        
        {/* CLI Usage Snippet */}
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-2">
            <div className="flex items-center gap-2 text-[#181715] font-bold">
              <Terminal size={15} className="text-[#B89A4A]" />
              <span>QuantumGen Command-Line Interface (CLI)</span>
            </div>
            <span className="text-[10px] text-[#8C734B]">Bash / PowerShell</span>
          </div>

          <div className="p-4 rounded-xl bg-[#11110F] text-[#FAF7F0] border border-[#24221E] space-y-2 select-all overflow-x-auto">
            <div className="text-[#8C734B]"># Step 1: Align reads and extract candidate regions</div>
            <div className="text-[#E8D89A]">quantumgen align --reads sample_HG002.fastq.gz --ref GRCh38.fa --output-pileup candidates.json</div>
            <div className="text-[#8C734B] pt-2"># Step 2: Formulate QUBO and run QAOA optimization loop</div>
            <div className="text-[#E8D89A]">quantumgen qaoa-solve --input candidates.json --qubits 12 --layers 3 --backend pennylane.statevector</div>
            <div className="text-[#8C734B] pt-2"># Step 3: Emit calibrated VCF</div>
            <div className="text-[#E8D89A]">quantumgen call-variants --ground-state solution.json --output-vcf variants.vcf</div>
          </div>
        </div>

        {/* Python SDK PennyLane Hamiltonian Snippet */}
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-2">
            <div className="flex items-center gap-2 text-[#181715] font-bold">
              <Code2 size={15} className="text-[#B89A4A]" />
              <span>PennyLane QAOA Hamiltonian Implementation</span>
            </div>
            <span className="text-[10px] text-[#8C734B]">Python 3.11</span>
          </div>

          <div className="p-4 rounded-xl bg-[#11110F] text-[#FAF7F0] border border-[#24221E] space-y-1 select-all overflow-x-auto text-[11px] leading-relaxed">
            <span className="text-[#8C734B]">import pennylane as qml</span><br/>
            <span className="text-[#8C734B]">from quantumgen.bio import pileup_to_qubo</span><br/><br/>
            <span className="text-[#DDD4C0]"># Map ambiguous read pileup to Ising cost Hamiltonian</span><br/>
            <span className="text-[#FAF7F0]">H_cost, H_mixer = pileup_to_qubo(locus="chr1:10520-10595", penalty_lambda=2.5)</span><br/>
            <span className="text-[#FAF7F0]">dev = qml.device("default.qubit", wires=12)</span><br/><br/>
            <span className="text-[#DDD4C0]">@qml.qnode(dev)</span><br/>
            <span className="text-[#FAF7F0]">def qaoa_ansatz(gamma, beta):</span><br/>
            <span className="text-[#E8D89A]">&nbsp;&nbsp;&nbsp;&nbsp;for wire in dev.wires:</span><br/>
            <span className="text-[#FAF7F0]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;qml.Hadamard(wires=wire)</span><br/>
            <span className="text-[#E8D89A]">&nbsp;&nbsp;&nbsp;&nbsp;for l in range(len(gamma)):</span><br/>
            <span className="text-[#FAF7F0]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;qml.ApproximateTimeEvolution(H_cost, gamma[l], 1)</span><br/>
            <span className="text-[#FAF7F0]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;qml.ApproximateTimeEvolution(H_mixer, beta[l], 1)</span><br/>
            <span className="text-[#E8D89A]">&nbsp;&nbsp;&nbsp;&nbsp;return qml.expval(H_cost)</span>
          </div>
        </div>

      </div>
    </div>
  );
};

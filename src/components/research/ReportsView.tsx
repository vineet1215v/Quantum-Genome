import React, { useState } from 'react';
import { CURRENT_EXPERIMENT } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Atom, 
  Cpu, 
  Sparkles,
  Bookmark
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleExportPDF = () => {
    setDownloadNotice('Compiling LaTeX/PDF research report: QuantumGen_EXP-2026-014_Report.pdf...');
    setTimeout(() => {
      window.print();
      setDownloadNotice(null);
    }, 800);
  };

  const handleExportDataBundle = () => {
    setDownloadNotice('Bundling VCF, BAM indices, QUBO matrix and convergence logs into ZIP bundle...');
    setTimeout(() => {
      setDownloadNotice('Download complete: QuantumGen_EXP-2026-014_Bundle.tar.gz');
      setTimeout(() => setDownloadNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Research / Research Reports
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="Academic Report Format" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Academic Research Report &amp; Manuscript Draft
          </h1>
          <p className="text-sm text-[#5C5549]">
            Publication-ready summary synthesizing hybrid computational formulation, convergence telemetry, and benchmark evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportDataBundle}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#FAF7F0] border border-[#DDD4C0] hover:bg-[#EAE2D0] text-[#181715] transition-colors"
          >
            <Download size={14} className="text-[#8C734B]" />
            <span>Export Experiment Data</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-colors shadow-sm"
          >
            <Printer size={14} className="text-[#E8D89A]" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-xl bg-[#2E6B48]/10 border border-[#2E6B48]/30 text-xs font-mono text-[#2E6B48] flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Styled Academic Paper Document Container (Warm ivory editorial paper look) */}
      <article className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-8 lg:p-14 shadow-lg space-y-8 text-[#181715]">
        
        {/* Document Header */}
        <div className="border-b-2 border-[#181715] pb-6 space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#8C734B]">
            <span>QUANTUMGEN RESEARCH TECHNICAL MEMORANDUM</span>
            <span>EXPERIMENT: {CURRENT_EXPERIMENT.id}</span>
          </div>

          <h2 className="font-serif-sc text-3xl lg:text-4xl font-normal text-[#181715] leading-tight">
            Hybrid Quantum-Classical Realignment and Variant Calling in High-Homology Genomic Loci
          </h2>

          <div className="text-xs font-mono text-[#5C5549] pt-2">
            Computational Genomics Laboratory • Oxford Nanopore &amp; Illumina NovaSeq Benchmarks • Date: October 2026
          </div>
        </div>

        {/* Abstract */}
        <section className="bg-[#EFE9DC]/60 p-6 rounded-xl border border-[#DDD4C0] space-y-2">
          <h3 className="font-serif-sc text-lg font-bold text-[#181715]">
            Abstract
          </h3>
          <p className="text-xs font-sans text-[#38352F] leading-relaxed">
            High-throughput genomic sequence alignment suffers from severe combinatorial degeneracy in repetitive and high-homology genomic regions. Here, we present <strong>QuantumGen</strong>, an architecture partitioning ambiguous read pileup windows into Quadratic Unconstrained Binary Optimization (QUBO) instances. Using the Quantum Approximate Optimization Algorithm (QAOA) on simulated 12-qubit statevectors, we demonstrate unambiguous ground-state haplotype convergence (E = -38.64, 98.2% concordance) where classical heuristics produced degenerate branch searches.
          </p>
        </section>

        {/* Section 1: Overview & Dataset */}
        <section className="space-y-3 font-sans text-xs text-[#38352F] leading-relaxed">
          <h3 className="font-serif-sc text-xl font-bold text-[#181715] border-b border-[#DDD4C0] pb-1">
            1. Experiment Overview &amp; Dataset Provenance
          </h3>
          <p>
            The experiment was executed using the <strong>HG002 / NA24385</strong> human genome benchmark dataset subset on chromosome 1. A total of 1,250,000 paired-end 150bp reads with a mean Phred score of Q38.6 were aligned against the GRCh38.p14 canonical reference contig.
          </p>
          <div className="p-3 bg-[#EFE9DC] rounded-lg font-mono text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>Reference: GRCh38.p14</div>
            <div>Reads: 1,250,000</div>
            <div>Candidate Windows: 1,842</div>
            <div>Verified Variants: 327</div>
          </div>
        </section>

        {/* Section 2: Methodology & QUBO Formulation */}
        <section className="space-y-3 font-sans text-xs text-[#38352F] leading-relaxed">
          <h3 className="font-serif-sc text-xl font-bold text-[#181715] border-b border-[#DDD4C0] pb-1">
            2. Methodology &amp; QUBO Hamiltonian Formulation
          </h3>
          <p>
            Unlike naive attempts to encode multi-gigabase genomes into quantum memory, QuantumGen isolates 75bp candidate windows where the classical pileup entropy exceeds threshold τ = 0.85. Each binary decision variable x_i &isin; &#123;0, 1&#125; denotes whether read i aligns to candidate haplotype allele A or allele B.
          </p>
          <div className="p-4 bg-[#11110F] text-[#E8D89A] rounded-xl font-mono text-xs overflow-x-auto">
            <code>
              {"H_QUBO = ∑_i h_i x_i + ∑_{i < j} J_ij x_i x_j + λ_diploid (1 - ∑ x_k)²"}
            </code>
          </div>

        </section>

        {/* Section 3: QAOA Configuration & Results */}
        <section className="space-y-3 font-sans text-xs text-[#38352F] leading-relaxed">
          <h3 className="font-serif-sc text-xl font-bold text-[#181715] border-b border-[#DDD4C0] pb-1">
            3. Variational Results &amp; Algorithmic Comparison
          </h3>
          <p>
            Optimization was carried out using QAOA with circuit depth \(p = 3\) layers across 12 qubits, utilizing the COBYLA optimizer for 30 classical-quantum iterations with 2,048 projective measurement shots.
          </p>

          <table className="w-full text-left font-mono text-xs border border-[#DDD4C0] mt-3">
            <thead className="bg-[#EFE9DC]">
              <tr>
                <th className="p-2 border-b border-[#DDD4C0]">Metric</th>
                <th className="p-2 border-b border-[#DDD4C0]">Classical GATK</th>
                <th className="p-2 border-b border-[#DDD4C0]">QuantumGen (QAOA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE5D8]">
              <tr>
                <td className="p-2 font-bold">Execution Runtime</td>
                <td className="p-2">4,120 ms</td>
                <td className="p-2 text-[#2E6B48] font-bold">1,480 ms (simulated)</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Solution Concordance</td>
                <td className="p-2">93.1%</td>
                <td className="p-2 text-[#2E6B48] font-bold">98.2%</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Ground Bitstring</td>
                <td className="p-2">Heuristic split</td>
                <td className="p-2 font-bold">|101101⟩ (94.2%)</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 4: Limitations & Conclusion */}
        <section className="space-y-3 font-sans text-xs text-[#38352F] leading-relaxed">
          <h3 className="font-serif-sc text-xl font-bold text-[#181715] border-b border-[#DDD4C0] pb-1">
            4. Methodological Limitations &amp; Reproducibility
          </h3>
          <p>
            Current results rely on statevector simulation. Physical hardware deployment will necessitate dynamical decoupling, readout error mitigation, and zero-noise extrapolation (ZNE). Reproducibility is guaranteed via deterministic random seed <code>0x4A2B81F9</code>.
          </p>
        </section>

      </article>
    </div>
  );
};

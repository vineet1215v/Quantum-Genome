import React, { useState } from 'react';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  BookOpen, 
  Dna, 
  Atom, 
  Cpu, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections = [
    {
      id: 1,
      title: '1. Genomic Sequencing Fundamentals',
      subtitle: 'From cellular DNA to base calls',
      body: 'Deoxyribonucleic acid is composed of four nucleobases: Adenine (A), Cytosine (C), Guanine (G), and Thymine (T). Modern sequencers break cellular DNA into millions of fragments, synthesizing complementary strands with fluorescent tags to record nucleotide emissions.'
    },
    {
      id: 2,
      title: '2. Sequencing Reads & Fragment Lengths',
      subtitle: 'Paired-end reads and insert sizes',
      body: 'Sequencing reads are short digital representations (typically 150bp for Illumina, or 10-20kb for PacBio HiFi). Paired-end sequencing reads both ends of a ~400bp DNA fragment, providing structural distance constraints that assist alignment across repetitive loci.'
    },
    {
      id: 3,
      title: '3. FASTQ File Format & Phred Quality Scores',
      subtitle: 'Probabilistic uncertainty encoding',
      body: 'FASTQ stores sequence strings alongside base call qualities: Q = -10 log10(P_err). A score of Q30 represents 99.9% accuracy (1 error in 1,000), while Q40 represents 99.99% accuracy. These probabilities directly weight the cost terms in our quantum Hamiltonian.'
    },
    {
      id: 4,
      title: '4. Reference Genomes (GRCh38 / T2T)',
      subtitle: 'The coordinate foundation for alignment',
      body: 'Reference genomes represent consensus assemblies of human chromosomes. GRCh38.p14 serves as the standard clinical and research reference coordinate system against which individual sequenced donor reads are mapped.'
    },
    {
      id: 5,
      title: '5. Sequence Alignment & BWA-MEM',
      subtitle: 'Burrows-Wheeler Transform & Smith-Waterman',
      body: 'Classical aligners index the reference genome using suffix trees (Burrows-Wheeler Transform with FM-index). Reads are seeded, extended, and realigned using dynamic programming to identify matching coordinates and CIGAR string operations.'
    },
    {
      id: 6,
      title: '6. Multi-Read Pileup Accumulation',
      subtitle: 'Vertical stacks of overlapping evidence',
      body: 'At each genomic position, multiple independent reads overlap (e.g. 30× to 60× coverage). Pileup structures stack read bases vertically to measure allele frequencies and test whether non-reference bases represent biological variation or sequencing noise.'
    },
    {
      id: 7,
      title: '7. Candidate Region Discovery Windows',
      subtitle: 'Isolating focal high-entropy loci',
      body: 'High-homology regions, homopolymer repeats, and indels trigger multi-mapping ambiguity. QuantumGen computes Shannon entropy across pileup windows, selecting loci with discordant evidence as candidate regions for targeted optimization.'
    },
    {
      id: 8,
      title: '8. Classical Variant Calling Limitations',
      subtitle: 'Why heuristics struggle in complex regions',
      body: 'Classical callers (like GATK HaplotypeCaller) construct local de Bruijn graphs. When repetitive motifs create multiple graph cycles, classical branch-and-bound heuristics encounter exponential O(2^N) search times or arbitrarily collapse true heterozygous indels.'
    },
    {
      id: 9,
      title: '9. QUBO (Quadratic Unconstrained Binary Optimization)',
      subtitle: 'Mapping biology into quadratic energy functions',
      body: 'We translate the read-to-haplotype disambiguation problem into binary spins x_i ∈ {0, 1}. The objective function penalizes mismatch penalties, gap openings, and diploid conflicts while rewarding concordant phase assignments.'
    },
    {
      id: 10,
      title: '10. QAOA (Quantum Approximate Optimization Algorithm)',
      subtitle: 'Variational quantum-classical optimization',
      body: 'QAOA alternates applications of the problem Hamiltonian H_C and the transverse mixer Hamiltonian H_M. Over p variational layers, classical optimizers iteratively tune angles (γ, β) to steer the quantum state toward the global minimum energy.'
    },
    {
      id: 11,
      title: '11. Hybrid Quantum-Classical Co-Processing',
      subtitle: 'Targeting quantum coprocessors strictly where needed',
      body: 'Quantum computing is never applied to the full genome. Classical CPUs efficiently handle 95% of unambiguous reads. Only computationally intractable candidate pileups are dispatched to the quantum layer, with results validated classically.'
    },
    {
      id: 12,
      title: '12. Benchmarking & Concordance Validation',
      subtitle: 'Evaluating against NIST GIAB truth sets',
      body: 'We benchmark all variant calls against high-confidence gold standards (GIAB HG002 / NA24385). Concordance rates, F1 scores, runtime scaling, and Phred calibration are evaluated side-by-side between classical and hybrid architectures.'
    },
    {
      id: 13,
      title: '13. Current Limitations & Hardware Roadmap',
      subtitle: 'From statevector simulation to fault-tolerant NISQ',
      body: 'Current runs utilize 12-to-16 qubit statevector simulators. Deployment to physical superconducting or neutral-atom processors requires readout error mitigation, zero-noise extrapolation (ZNE), and high two-qubit gate fidelities.'
    }
  ];

  const current = sections[activeSection];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Knowledge / Methodology
            </span>
            <ScientificBadge status="THEORETICAL" detail="Algorithmic Foundations" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Scientific Foundations &amp; Methodology Guide
          </h1>
          <p className="text-sm text-[#5C5549]">
            Comprehensive guide bridging computational genomics and quantum optimization for interdisciplinary researchers.
          </p>
        </div>
      </div>

      {/* Two-Column Explorer: Section Directory (4 cols) & Educational Panel (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-xs">
        
        {/* Navigation Index (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-5 space-y-2">
          <div className="pb-3 border-b border-[#EBE5D8] flex items-center justify-between">
            <span className="text-xs font-bold text-[#181715]">Table of Sections</span>
            <span className="text-[11px] text-[#8C734B]">{sections.length} Chapters</span>
          </div>

          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {sections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  activeSection === idx
                    ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A] shadow-sm'
                    : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0] hover:bg-[#F2EBDB]'
                }`}
              >
                <div className={`font-bold text-xs truncate ${activeSection === idx ? 'text-[#E8D89A]' : 'text-[#181715]'}`}>
                  {sec.title}
                </div>
                <div className={`text-[10px] font-sans truncate ${activeSection === idx ? 'text-[#DDD4C0]' : 'text-[#8C734B]'}`}>
                  {sec.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Section Detailed Article (8 cols) */}
        <div className="lg:col-span-8 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-8 space-y-6">
          <div className="border-b border-[#EBE5D8] pb-4 space-y-1">
            <div className="text-[10px] text-[#8C734B] uppercase font-bold">
              Chapter 0{current.id} of 13
            </div>
            <h2 className="font-serif-sc text-3xl font-bold text-[#181715]">
              {current.title}
            </h2>
            <div className="text-sm font-sans text-[#8C734B]">
              {current.subtitle}
            </div>
          </div>

          <div className="font-sans text-sm text-[#38352F] leading-relaxed space-y-4">
            <p className="text-base font-serif-sc leading-relaxed text-[#181715]">
              {current.body}
            </p>
          </div>

          {/* Interactive Scientific Diagram specific to section topic */}
          <div className="p-6 rounded-xl bg-[#11110F] text-[#FAF7F0] border border-[#24221E] space-y-3 font-mono text-xs">
            <span className="text-[10px] text-[#E8D89A] uppercase font-bold tracking-wider">
              Conceptual Architecture Diagram
            </span>

            {current.id <= 8 ? (
              /* Bioinformatics Flow */
              <div className="p-4 bg-[#181715] rounded-lg border border-[#38352F] space-y-2 text-center text-xs">
                <div className="text-[#8C734B]">DNA Double Helix (3.2Gb) &rarr; NGS Fragmentation</div>
                <div className="text-[#E8D89A] font-bold">&darr; 150bp Short Reads (FASTQ @Q38.6)</div>
                <div className="text-[#8C734B]">&darr; BWA-MEM FM-Index Reference Mapping</div>
                <div className="text-[#2E6B48] font-bold">&darr; Pileup Accumulation &amp; High-Entropy Windowing</div>
              </div>
            ) : (
              /* Quantum Flow */
              <div className="p-4 bg-[#181715] rounded-lg border border-[#38352F] space-y-2 text-center text-xs">
                <div className="text-[#E8D89A]">Ambiguous Pileup &rarr; Binary Spin Mapping x_i ∈ {'{0, 1}'}</div>
                <div className="text-[#8C734B]">&darr; Matrix Couplings: H(x) = x^T Q x</div>
                <div className="text-[#B89A4A] font-bold">&darr; QAOA Variational Unitary: U(γ, β) across p layers</div>
                <div className="text-[#2E6B48] font-bold">&darr; Ground State Bitstring |101101⟩ &rarr; Verified VCF</div>
              </div>
            )}
          </div>

          {/* Stepper Footer */}
          <div className="pt-4 border-t border-[#EBE5D8] flex items-center justify-between">
            <button
              onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
              disabled={activeSection === 0}
              className="px-4 py-2 rounded-lg bg-[#EFE9DC] text-[#181715] font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EAE2D0] transition-colors"
            >
              &larr; Previous Section
            </button>

            <button
              onClick={() => setActiveSection(prev => Math.min(sections.length - 1, prev + 1))}
              disabled={activeSection === sections.length - 1}
              className="px-4 py-2 rounded-lg bg-[#181715] text-[#FAF7F0] font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#24221E] transition-colors"
            >
              Next Section &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SAMPLE_ALIGNMENT_READS } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  Search, 
  Filter, 
  Dna, 
  Check, 
  Sliders, 
  Download, 
  Eye, 
  Hash, 
  BarChart2,
  FileCode
} from 'lucide-react';

export const SequenceExplorerView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReadId, setSelectedReadId] = useState(SAMPLE_ALIGNMENT_READS[0].id);
  const [highlightBase, setHighlightBase] = useState<string | null>(null);
  const [showQualityColors, setShowQualityColors] = useState(true);

  const selectedRead = SAMPLE_ALIGNMENT_READS.find(r => r.id === selectedReadId) || SAMPLE_ALIGNMENT_READS[0];

  // Base coloring utility
  const getBaseStyle = (base: string) => {
    if (highlightBase && highlightBase !== base) {
      return 'opacity-25';
    }

    switch (base) {
      case 'A': return 'text-[#2E6B48] bg-[#2E6B48]/10 font-bold'; // Restrained green
      case 'C': return 'text-[#4A6482] bg-[#4A6482]/10 font-bold'; // Muted slate blue
      case 'G': return 'text-[#B89A4A] bg-[#B89A4A]/10 font-bold'; // Restrained gold
      case 'T': return 'text-[#A33A3A] bg-[#A33A3A]/10 font-bold'; // Restrained red
      default: return 'text-[#5C5549] bg-[#DDD4C0]/20';
    }
  };

  const filteredReads = SAMPLE_ALIGNMENT_READS.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sequence.includes(searchTerm.toUpperCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Genomic Analysis / Sequence Explorer
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="Illumina NovaSeq HG002" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Sequence Explorer &amp; FASTQ Read Inspector
          </h1>
          <p className="text-sm text-[#5C5549]">
            Examine raw sequencing reads, nucleotide distributions, Phred quality metrics, and local motif alignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([SAMPLE_ALIGNMENT_READS.map(r => `@${r.id}\n${r.sequence}\n+\n${r.qualityScores}`).join('\n')], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = "sample_reads.fastq";
              document.body.appendChild(element);
              element.click();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#FAF7F0] border border-[#DDD4C0] hover:bg-[#EAE2D0] text-[#181715] transition-colors"
          >
            <Download size={14} />
            <span>Export FASTQ</span>
          </button>
        </div>
      </div>

      {/* Nucleotide Metrics & Composition Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4">
          <div className="text-[11px] text-[#8C734B]">Base A (Adenine)</div>
          <div className="text-xl font-bold text-[#2E6B48]">28.4%</div>
          <div className="text-[10px] text-[#5C5549]">355,000 bases</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4">
          <div className="text-[11px] text-[#8C734B]">Base C (Cytosine)</div>
          <div className="text-xl font-bold text-[#4A6482]">21.6%</div>
          <div className="text-[10px] text-[#5C5549]">270,000 bases</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4">
          <div className="text-[11px] text-[#8C734B]">Base G (Guanine)</div>
          <div className="text-xl font-bold text-[#B89A4A]">22.0%</div>
          <div className="text-[10px] text-[#5C5549]">275,000 bases</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4">
          <div className="text-[11px] text-[#8C734B]">Base T (Thymine)</div>
          <div className="text-xl font-bold text-[#A33A3A]">28.0%</div>
          <div className="text-[10px] text-[#5C5549]">350,000 bases</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4">
          <div className="text-[11px] text-[#8C734B]">GC Content</div>
          <div className="text-xl font-bold text-[#181715]">43.6%</div>
          <div className="text-[10px] text-[#2E6B48]">Normal human range</div>
        </div>
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4">
          <div className="text-[11px] text-[#8C734B]">Mean Phred Quality</div>
          <div className="text-xl font-bold text-[#181715]">Q38.6</div>
          <div className="text-[10px] text-[#2E6B48]">Accuracy &gt; 99.98%</div>
        </div>
      </div>

      {/* Main Interactive Sequence Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Read Browser List (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
            <h3 className="font-serif-sc text-lg font-semibold text-[#181715]">
              Read Browser
            </h3>
            <span className="text-xs font-mono text-[#8C734B]">
              {filteredReads.length} reads
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C734B]" />
            <input
              type="text"
              placeholder="Search by ID or motif (e.g. TGCT)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#EFE9DC]/60 border border-[#DDD4C0] text-xs font-mono placeholder:text-[#8C734B] focus:outline-none focus:border-[#B89A4A]"
            />
          </div>

          {/* Read list */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredReads.map((read) => (
              <div
                key={read.id}
                onClick={() => setSelectedReadId(read.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                  selectedReadId === read.id
                    ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A]'
                    : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0] hover:bg-[#F2EBDB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{read.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                    selectedReadId === read.id ? 'bg-[#E8D89A]/20 text-[#E8D89A]' : 'bg-[#DDD4C0] text-[#5C5549]'
                  }`}>
                    Strand {read.strand}
                  </span>
                </div>
                <div className="text-[11px] truncate opacity-70">
                  {read.sequence.slice(0, 32)}...
                </div>
                <div className="text-[10px] flex items-center justify-between mt-2 pt-1 border-t border-current/10">
                  <span>MapQ {read.mapQ}</span>
                  <span>CIGAR: {read.cigar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Monospace Sequence Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EBE5D8] pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#8C734B]">
                <span>FASTQ RECORD:</span>
                <span className="font-bold text-[#181715]">@{selectedRead.id}</span>
              </div>
              <h3 className="font-serif-sc text-xl font-semibold text-[#181715]">
                Monospace Sequence &amp; Quality Profile
              </h3>
            </div>

            {/* Base Highlight Selector Buttons */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[#8C734B] text-[11px] mr-1">Highlight Base:</span>
              {['A', 'C', 'G', 'T'].map((base) => (
                <button
                  key={base}
                  onClick={() => setHighlightBase(highlightBase === base ? null : base)}
                  className={`w-7 h-7 rounded border font-bold flex items-center justify-center transition-all ${
                    highlightBase === base
                      ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A]'
                      : 'bg-[#EFE9DC] text-[#38352F] border-[#DDD4C0] hover:bg-[#EAE2D0]'
                  }`}
                >
                  {base}
                </button>
              ))}
              {highlightBase && (
                <button
                  onClick={() => setHighlightBase(null)}
                  className="text-[10px] text-[#8C734B] underline ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Monospace Sequence Block with interactive styling */}
          <div className="p-5 rounded-xl bg-[#11110F] text-[#FAF7F0] border border-[#24221E] shadow-inner font-mono text-xs space-y-4 dark-scroll overflow-x-auto">
            <div className="flex items-center justify-between text-[11px] text-[#8C734B] border-b border-[#24221E] pb-2">
              <span>5' END &rarr; 3' STRAND ({selectedRead.sequence.length} bp)</span>
              <span>Coordinates: chr1:{selectedRead.startPos}-{selectedRead.startPos + selectedRead.sequence.length}</span>
            </div>

            {/* Base string with highlight classes */}
            <div className="leading-relaxed tracking-widest break-all font-mono text-sm py-2">
              {selectedRead.sequence.split('').map((base, idx) => (
                <span
                  key={idx}
                  className={`inline-block px-0.5 rounded cursor-pointer transition-all hover:scale-125 ${getBaseStyle(base)}`}
                  title={`Position ${selectedRead.startPos + idx} : ${base}`}
                >
                  {base}
                </span>
              ))}
            </div>

            {/* Phred Quality line */}
            <div className="pt-2 border-t border-[#24221E] text-[11px] space-y-1">
              <span className="text-[#8C734B]">Phred Score ASCII Encoded:</span>
              <div className="tracking-widest text-[#E8D89A] opacity-80 break-all select-all">
                {selectedRead.qualityScores}
              </div>
            </div>
          </div>

          {/* Pairwise Reference Comparison as demonstrated in prompt */}
          <div className="p-5 rounded-xl bg-[#EFE9DC]/70 border border-[#DDD4C0] font-mono text-xs space-y-3">
            <div className="font-semibold text-[#181715] text-xs flex items-center justify-between">
              <span>Pairwise Reference Haplotype Alignment</span>
              <span className="text-[11px] text-[#8C734B]">Position 10520 - 10540 snippet</span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#DDD4C0] space-y-1 font-mono text-xs overflow-x-auto">
              <div className="text-[#5C5549]">
                REF: <span className="text-[#181715] font-bold">ACGTTACGGTACCTGACCTG</span>
              </div>
              <div className="text-[#8C734B] tracking-wider">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;||||||||||||&nbsp;&nbsp;||||||
              </div>
              <div className="text-[#5C5549]">
                READ: <span className="text-[#181715] font-bold">ACGTTACGGTAC<span className="text-[#A33A3A] bg-[#A33A3A]/20 px-0.5 rounded font-bold">AT</span>GACCTG</span>
              </div>
              <div className="text-[10px] text-[#A33A3A] font-sans pt-1">
                &uarr; Biallelic transition mismatch candidate identified for quantum pileup resolution
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

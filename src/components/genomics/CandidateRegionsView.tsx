import React, { useState } from 'react';
import { CANDIDATE_REGIONS } from '../../data/mockData';
import { CandidateRegion, NavigationTab } from '../../types';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  ScanSearch, 
  Atom, 
  ArrowRight, 
  Layers, 
  Dna, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface CandidateRegionsViewProps {
  onSelectCandidateRegion: (region: CandidateRegion) => void;
  onNavigateToQuantumLab: (region: CandidateRegion) => void;
  selectedRegionId?: string;
}

export const CandidateRegionsView: React.FC<CandidateRegionsViewProps> = ({
  onSelectCandidateRegion,
  onNavigateToQuantumLab,
  selectedRegionId = CANDIDATE_REGIONS[0].id
}) => {
  const [activeRegion, setActiveRegion] = useState<CandidateRegion>(
    CANDIDATE_REGIONS.find(r => r.id === selectedRegionId) || CANDIDATE_REGIONS[0]
  );
  const [filterType, setFilterType] = useState<'ALL' | 'SNV' | 'INDEL'>('ALL');

  const generationStages = [
    { title: 'Aligned Reads', desc: 'BWA-MEM paired-end BAM records with MapQ calibration' },
    { title: 'Pileup Accumulator', desc: 'Base-by-base stack evaluating non-ref depth' },
    { title: 'Evidence Engine', desc: 'Statistical test of strand bias and Phred thresholds' },
    { title: 'Potential Variant Sites', desc: 'Loci with non-reference frequency AF > 0.15' },
    { title: 'Candidate Regions', desc: 'Segmented genomic windows isolated for optimization' }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Genomic Analysis / Candidate Regions
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="1,842 Filtered Windows" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Candidate Region Discovery &amp; Focal Windows
          </h1>
          <p className="text-sm text-[#5C5549]">
            Visual discovery of ambiguous genomic loci exhibiting non-reference evidence, partitioned for downstream quantum optimization.
          </p>
        </div>

        <button
          onClick={() => onNavigateToQuantumLab(activeRegion)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-all shadow-md group"
        >
          <Atom size={16} className="text-[#E8D89A] group-hover:rotate-45 transition-transform" />
          <span>Transform Selected Region into QUBO</span>
          <ArrowRight size={14} className="text-[#E8D89A]" />
        </button>
      </div>

      {/* Visual Pipeline Banner: How Candidate Regions Are Generated */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
          <h2 className="font-serif-sc text-lg font-semibold text-[#181715]">
            Candidate Generation Architecture
          </h2>
          <span className="text-xs font-mono text-[#8C734B]">
            Evidence-Driven Windowing Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {generationStages.map((stage, idx) => (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl border text-xs font-mono space-y-1 relative ${
                idx === 4 
                  ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A]' 
                  : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold ${idx === 4 ? 'text-[#E8D89A]' : 'text-[#8C734B]'}`}>
                  STAGE 0{idx + 1}
                </span>
                {idx < 4 && <span className="text-[#8C734B] text-[10px]">&rarr;</span>}
              </div>
              <div className="font-bold text-sm tracking-tight">{stage.title}</div>
              <p className={`text-[11px] leading-tight font-sans ${idx === 4 ? 'text-[#DDD4C0]' : 'text-[#5C5549]'}`}>
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Genome Coordinate Track Visualization */}
      <div className="bg-[#181715] text-[#FAF7F0] border border-[#24221E] rounded-2xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#24221E] pb-3 text-xs">
          <span className="text-[#E8D89A] font-bold">
            CHROMOSOME 1 COORDINATE TRACK • {activeRegion.chromosome}:{activeRegion.start} - {activeRegion.end}
          </span>
          <span className="text-[#8C734B]">FOCAL WINDOW: {activeRegion.length} bp</span>
        </div>

        {/* Genome Track ASCII-Graphic Display as specified in prompt */}
        <div className="py-4 space-y-3">
          <div className="text-xs text-[#8C734B] select-none flex justify-between px-2">
            <span>pos 10,000</span>
            <span>pos 10,500</span>
            <span>pos 10,555 (focal)</span>
            <span>pos 10,600</span>
            <span>pos 11,000</span>
          </div>

          {/* Coordinate rail */}
          <div className="relative h-12 w-full bg-[#11110F] rounded-lg border border-[#38352F] flex items-center px-4 overflow-hidden">
            <div className="w-full h-0.5 bg-[#38352F] absolute top-1/2 -translate-y-1/2 left-0 right-0" />
            
            {/* Candidate Region Box Highlight */}
            <div 
              className="absolute h-8 rounded bg-gradient-to-r from-[#B89A4A]/30 via-[#E8D89A]/80 to-[#B89A4A]/30 border-2 border-[#E8D89A] flex items-center justify-center text-[10px] text-[#11110F] font-bold shadow-lg animate-pulse"
              style={{ left: '42%', width: '18%' }}
            >
              <span>{activeRegion.id}</span>
            </div>

            {/* Other background candidate markers */}
            <div className="absolute h-5 w-8 rounded bg-[#38352F] border border-[#5C5549] opacity-40" style={{ left: '15%' }} />
            <div className="absolute h-5 w-8 rounded bg-[#38352F] border border-[#5C5549] opacity-40" style={{ left: '72%' }} />
            <div className="absolute h-5 w-8 rounded bg-[#38352F] border border-[#5C5549] opacity-40" style={{ left: '88%' }} />
          </div>

          <div className="text-center text-xs text-[#E8D89A] pt-1">
            &uarr; High-entropy region selected for quantum Hamiltonian mapping (Read depth: {activeRegion.readDepth}&times;)
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Region Table + Selected Region Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Candidate Regions Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
            <h3 className="font-serif-sc text-lg font-semibold text-[#181715]">
              Candidate Regions Table
            </h3>
            <span className="text-xs font-mono text-[#8C734B]">
              Showing {CANDIDATE_REGIONS.length} of 1,842
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {CANDIDATE_REGIONS.map((region) => {
              const isSelected = activeRegion.id === region.id;

              return (
                <div
                  key={region.id}
                  onClick={() => {
                    setActiveRegion(region);
                    onSelectCandidateRegion(region);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A] shadow-md'
                      : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0] hover:bg-[#F2EBDB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isSelected ? 'text-[#E8D89A]' : 'text-[#181715]'}`}>
                        {region.id}
                      </span>
                      <span className="text-[11px] opacity-80">
                        {region.chromosome}:{region.start}-{region.end}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      isSelected 
                        ? 'bg-[#B89A4A]/20 text-[#E8D89A] border border-[#B89A4A]/40' 
                        : 'bg-[#EFE9DC] text-[#5C5549]'
                    }`}>
                      AF {region.alleleFrequency.toFixed(2)}
                    </span>
                  </div>

                  <p className={`text-[11px] font-sans line-clamp-1 mb-2 ${isSelected ? 'text-[#DDD4C0]' : 'text-[#5C5549]'}`}>
                    {region.selectionReason}
                  </p>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-current/10 text-[10px]">
                    <div>
                      <span className="opacity-70">Depth:</span> <strong>{region.readDepth}×</strong>
                    </div>
                    <div>
                      <span className="opacity-70">Alt Count:</span> <strong>{region.altAlleleCount}</strong>
                    </div>
                    <div>
                      <span className="opacity-70">BaseQual:</span> <strong>Q{region.baseQuality.toFixed(0)}</strong>
                    </div>
                    <div>
                      <span className="opacity-70">Score:</span> <strong className="text-[#2E6B48]">{region.confidenceScore}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Region Detailed Local Analysis (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#EBE5D8] pb-3">
            <div className="text-xs font-mono text-[#8C734B] uppercase">Focal Local Analysis</div>
            <h3 className="font-serif-sc text-xl font-bold text-[#181715]">
              {activeRegion.id} Details
            </h3>
            <p className="text-xs text-[#5C5549] mt-1 font-sans">
              {activeRegion.selectionReason}
            </p>
          </div>

          {/* Reference vs Alternate Evidence Snippets */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#EFE9DC] border border-[#DDD4C0] space-y-1">
              <span className="text-[10px] text-[#8C734B] uppercase font-semibold">Reference Sequence (GRCh38):</span>
              <div className="text-[11px] text-[#181715] break-all tracking-wider font-mono">
                {activeRegion.referenceSeq.slice(0, 50)}...
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#181715] border border-[#38352F] text-[#FAF7F0] space-y-1">
              <span className="text-[10px] text-[#E8D89A] uppercase font-semibold">Observed Alt Evidence:</span>
              <div className="text-[11px] text-[#E8D89A] break-all tracking-wider font-mono">
                {activeRegion.alternateEvidence.slice(0, 50)}...
              </div>
            </div>
          </div>

          {/* Detailed Statistics Table */}
          <div className="border border-[#DDD4C0] rounded-xl overflow-hidden font-mono text-xs">
            <div className="grid grid-cols-2 divide-x divide-[#DDD4C0] border-b border-[#DDD4C0] p-2.5 bg-[#FAF7F0]">
              <span className="text-[#5C5549]">Read Depth:</span>
              <span className="font-bold text-[#181715] pl-2">{activeRegion.readDepth}&times; coverage</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[#DDD4C0] border-b border-[#DDD4C0] p-2.5 bg-[#FAF7F0]">
              <span className="text-[#5C5549]">Alt Allele Frequency:</span>
              <span className="font-bold text-[#181715] pl-2">{(activeRegion.alleleFrequency * 100).toFixed(1)}%</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[#DDD4C0] border-b border-[#DDD4C0] p-2.5 bg-[#FAF7F0]">
              <span className="text-[#5C5549]">Mapping Quality (MapQ):</span>
              <span className="font-bold text-[#181715] pl-2">{activeRegion.mappingQuality} / 60</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[#DDD4C0] p-2.5 bg-[#FAF7F0]">
              <span className="text-[#5C5549]">Confidence Score:</span>
              <span className="font-bold text-[#2E6B48] pl-2">{activeRegion.confidenceScore} / 100</span>
            </div>
          </div>

          {/* Action to Transfer to Quantum Lab */}
          <button
            onClick={() => onNavigateToQuantumLab(activeRegion)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B89A4A] to-[#D4B76B] text-[#11110F] font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all shadow-md"
          >
            <Atom size={16} />
            <span>Map to QUBO &amp; Send to Quantum Lab</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SAMPLE_ALIGNMENT_READS } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Filter, 
  Layers, 
  Eye, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const AlignmentLabView: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = normal, 2 = enlarged
  const [filterMinQuality, setFilterMinQuality] = useState<number>(30);
  const [showMismatchesOnly, setShowMismatchesOnly] = useState<boolean>(false);
  const [selectedCoord, setSelectedCoord] = useState<number>(10555);

  const referenceSequence = "ACGTACCGTGCAATGCATCAGTACCGTACGTAGCATCGATCAGTACTCGATCGATCGATGCATCGATCGTACGTAACGTACCGTGCAATGCATCAGTACCGTACGTAGCATCGATCAGTACTCGATCGATCGATGCATCGATCGTACGTA";
  const refStart = 10520;

  // Filter reads based on quality thresholds
  const displayedReads = SAMPLE_ALIGNMENT_READS.filter(r => r.mapQ >= filterMinQuality);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Genomic Analysis / Alignment Lab
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="BWA-MEM2 BAM Pileup" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Visual Sequence Alignment Canvas
          </h1>
          <p className="text-sm text-[#5C5549]">
            Multi-read pileup against GRCh38.p14 reference contig. Mismatches, indels, and discordant read pairs are marked.
          </p>
        </div>

        {/* Zoom & Navigation Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#FAF7F0] border border-[#DDD4C0] rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
              className="p-1.5 hover:bg-[#EAE2D0] rounded text-[#5C5549]"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <span className="px-2 font-bold text-[#181715]">{(zoomLevel * 100).toFixed(0)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.75, prev + 0.25))}
              className="p-1.5 hover:bg-[#EAE2D0] rounded text-[#5C5549]"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          <button 
            onClick={() => setShowMismatchesOnly(!showMismatchesOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
              showMismatchesOnly
                ? 'bg-[#B46927]/15 border-[#B46927] text-[#B46927]'
                : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#5C5549] hover:bg-[#EAE2D0]'
            }`}
          >
            {showMismatchesOnly ? 'Showing Discordant Only' : 'Show All Reads'}
          </button>
        </div>
      </div>

      {/* Alignment Coordinate Navigator Bar */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-4">
          <span className="text-[#8C734B] uppercase font-semibold">Active Locus:</span>
          <span className="bg-[#EFE9DC] px-2.5 py-1 rounded text-[#181715] font-bold border border-[#DDD4C0]">
            chr1 : {refStart} — {refStart + 150}
          </span>
          <span className="text-[#5C5549]">Selected Pos: <strong className="text-[#B89A4A]">{selectedCoord}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#8C734B]">Min MapQ:</span>
          <select 
            value={filterMinQuality} 
            onChange={(e) => setFilterMinQuality(Number(e.target.value))}
            className="bg-[#EFE9DC] border border-[#DDD4C0] rounded px-2 py-1 text-xs text-[#181715]"
          >
            <option value={0}>MapQ &ge; 0</option>
            <option value={30}>MapQ &ge; 30 (Probable)</option>
            <option value={50}>MapQ &ge; 50 (High)</option>
            <option value={60}>MapQ &ge; 60 (Unique)</option>
          </select>
        </div>
      </div>

      {/* Primary Alignment Canvas (Monospace, horizontally scrollable) */}
      <div className="bg-[#11110F] border border-[#24221E] rounded-2xl p-6 shadow-xl space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#24221E] pb-3 text-xs font-mono text-[#8C734B]">
          <span>GENOME ALIGNMENT TRACK • CHROMOSOME 1</span>
          <span>DISCORDANT BASES HIGHLIGHTED IN AMBER/RED</span>
        </div>

        {/* Scrollable track viewport */}
        <div className="overflow-x-auto dark-scroll pb-4 space-y-4 font-mono" style={{ fontSize: `${13 * zoomLevel}px` }}>
          
          {/* Coordinates Header Ruler */}
          <div className="flex items-center text-[#8C734B] border-b border-[#24221E] pb-1 select-none">
            <div className="w-36 shrink-0 text-[11px] font-semibold text-[#B89A4A]">COORDINATES</div>
            <div className="flex tracking-widest text-[11px]">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="w-20 text-left border-l border-[#38352F] pl-1">
                  {refStart + i * 10}
                </div>
              ))}
            </div>
          </div>

          {/* Reference Sequence Track */}
          <div className="flex items-center text-[#FAF7F0] bg-[#181715] p-2 rounded-lg border border-[#38352F]">
            <div className="w-36 shrink-0 text-xs font-bold text-[#E8D89A] flex items-center gap-1.5">
              <span>REFERENCE</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-[#38352F] text-[#DDD4C0]">GRCh38</span>
            </div>
            <div className="tracking-widest whitespace-pre select-all text-[#E8D89A]">
              {referenceSequence.slice(0, 100).split('').map((char, idx) => (
                <span 
                  key={idx}
                  onClick={() => setSelectedCoord(refStart + idx)}
                  className={`inline-block px-0.2 hover:bg-[#B89A4A] hover:text-[#11110F] cursor-pointer transition-colors ${
                    refStart + idx === 10555 ? 'bg-[#A33A3A] text-white px-1 font-bold rounded' : ''
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Individual Reads Tracks */}
          <div className="space-y-2 pt-2">
            {displayedReads.map((read, rIdx) => {
              const isMismatchRow = read.mismatches.length > 0;

              return (
                <div 
                  key={read.id} 
                  className="flex items-center text-[#DDD4C0] hover:bg-[#181715] p-2 rounded transition-colors group"
                >
                  <div className="w-36 shrink-0 text-xs text-[#8C734B] flex items-center justify-between pr-2">
                    <span className="font-semibold text-[#DDD4C0] group-hover:text-[#E8D89A]">
                      {read.id}
                    </span>
                    <span className="text-[10px] text-[#8C734B]">Q{read.mapQ}</span>
                  </div>

                  <div className="tracking-widest whitespace-pre select-all">
                    {/* Render bases, coloring mismatches */}
                    {read.sequence.slice(0, 100).split('').map((char, charIdx) => {
                      const isMismatch = read.mismatches.includes(charIdx);

                      if (isMismatch) {
                        return (
                          <span 
                            key={charIdx} 
                            className="inline-block px-0.5 rounded bg-[#A33A3A] text-white font-bold animate-pulse"
                            title={`Mismatch detected at pos ${read.startPos + charIdx}: Read ${char} vs Ref`}
                          >
                            {char}
                          </span>
                        );
                      }

                      return (
                        <span key={charIdx} className="text-[#8C734B] group-hover:text-[#FAF7F0] opacity-80">
                          {char}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Alignment Canvas Footer Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#24221E] text-xs font-mono text-[#8C734B]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#A33A3A]" /> Mismatch (SNV candidate)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#B89A4A]" /> Insertion / InDel
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#38352F]" /> Concordant reference base
            </span>
          </div>

          <div className="text-[11px] text-[#E8D89A]">
            Selected Position: <span className="font-bold text-[#FAF7F0]">chr1:{selectedCoord}</span> (High-entropy transition site)
          </div>
        </div>
      </div>
    </div>
  );
};

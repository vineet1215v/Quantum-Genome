import React, { useState } from 'react';
import { CANDIDATE_REGIONS, VARIANTS_LIST } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  Search, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Layers, 
  ChevronRight, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const GenomeMapView: React.FC = () => {
  const [selectedChr, setSelectedChr] = useState<string>('chr1');
  const [searchCoord, setSearchCoord] = useState<string>('chr1:10520');
  const [selectedLocus, setSelectedLocus] = useState<string>('chr1:10520-10595');

  const chromosomes = [
    { name: 'chr1', sizeMb: 248.9, candidates: 1842, variants: 327 },
    { name: 'chr2', sizeMb: 242.1, candidates: 1620, variants: 289 },
    { name: 'chr3', sizeMb: 198.2, candidates: 1340, variants: 241 },
    { name: 'chr4', sizeMb: 190.2, candidates: 1210, variants: 215 },
    { name: 'chr5', sizeMb: 181.5, candidates: 1150, variants: 198 },
    { name: 'chr6', sizeMb: 170.8, candidates: 1080, variants: 182 },
    { name: 'chr7', sizeMb: 159.3, candidates: 990, variants: 165 },
    { name: 'chr8', sizeMb: 145.1, candidates: 920, variants: 154 },
    { name: 'chr9', sizeMb: 138.3, candidates: 870, variants: 142 },
    { name: 'chr10', sizeMb: 133.7, candidates: 830, variants: 138 },
    { name: 'chr11', sizeMb: 135.0, candidates: 840, variants: 140 },
    { name: 'chr12', sizeMb: 133.2, candidates: 820, variants: 135 },
    { name: 'chr13', sizeMb: 114.3, candidates: 710, variants: 112 },
    { name: 'chr14', sizeMb: 107.0, candidates: 660, variants: 105 },
    { name: 'chr15', sizeMb: 101.9, candidates: 620, variants: 99 },
    { name: 'chr16', sizeMb: 90.3, candidates: 540, variants: 88 },
    { name: 'chr17', sizeMb: 83.2, candidates: 510, variants: 81 },
    { name: 'chr18', sizeMb: 80.3, candidates: 480, variants: 76 },
    { name: 'chr19', sizeMb: 58.6, candidates: 390, variants: 64 },
    { name: 'chr20', sizeMb: 64.4, candidates: 410, variants: 68 },
    { name: 'chr21', sizeMb: 46.7, candidates: 290, variants: 48 },
    { name: 'chr22', sizeMb: 50.8, candidates: 310, variants: 52 },
    { name: 'chrX', sizeMb: 156.0, candidates: 970, variants: 160 },
    { name: 'chrY', sizeMb: 57.2, candidates: 180, variants: 28 }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Genomic Analysis / Genome Map
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="GRCh38 Coordinates" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Whole-Genome Cytoband &amp; Coordinate Map
          </h1>
          <p className="text-sm text-[#5C5549]">
            Multiscale navigation across chromosomal karyotypes, candidate region density tracks, and quantum-resolved variants.
          </p>
        </div>

        {/* Search bar for coordinates */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C734B]" />
            <input
              type="text"
              value={searchCoord}
              onChange={(e) => setSearchCoord(e.target.value)}
              placeholder="e.g. chr1:10520"
              className="pl-9 pr-3 py-2 rounded-lg bg-[#FAF7F0] border border-[#DDD4C0] text-xs font-mono text-[#181715] placeholder:text-[#8C734B] focus:outline-none focus:border-[#B89A4A]"
            />
          </div>
          <button 
            onClick={() => setSelectedLocus(`${searchCoord}-10600`)}
            className="px-3.5 py-2 rounded-lg text-xs font-mono bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-colors"
          >
            Locate
          </button>
        </div>
      </div>

      {/* Chromosome Karyotype Selector Buttons */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#8C734B]">
          <span>SELECT CHROMOSOME CONTIG (HOMO SAPIENS)</span>
          <span>{chromosomes.length} Karyotypes</span>
        </div>

        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {chromosomes.map((chr) => (
            <button
              key={chr.name}
              onClick={() => setSelectedChr(chr.name)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedChr === chr.name
                  ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A] font-bold shadow-xs'
                  : 'bg-[#FAF7F0] text-[#5C5549] border-[#DDD4C0] hover:bg-[#EAE2D0]'
              }`}
            >
              <span>{chr.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Full-width Horizontal Genomic Coordinate Visualization */}
      <div className="bg-[#181715] text-[#FAF7F0] border border-[#24221E] rounded-2xl p-6 shadow-xl space-y-6 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#24221E] pb-4">
          <div>
            <span className="text-xs text-[#E8D89A] font-semibold">{selectedChr.toUpperCase()} MACRO TRACK</span>
            <div className="text-xs text-[#8C734B]">0 Mb &mdash; 248.9 Mb Ideogram Centromere Representation</div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#DDD4C0]">
              <span className="w-2.5 h-2.5 rounded bg-[#E8D89A]" /> Candidate Cluster
            </span>
            <span className="flex items-center gap-1.5 text-[#DDD4C0]">
              <span className="w-2.5 h-2.5 rounded bg-[#2E6B48]" /> Verified Variant
            </span>
          </div>
        </div>

        {/* Chromosome Ideogram Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-[#8C734B]">
            <span>p-ter (0 Mb)</span>
            <span>Centromere (122 Mb)</span>
            <span>q-ter (249 Mb)</span>
          </div>

          <div className="relative h-10 w-full bg-[#24221E] rounded-full border border-[#38352F] overflow-hidden flex items-center px-4">
            {/* Centromere constriction */}
            <div className="absolute left-[48%] w-5 h-full bg-[#11110F] border-x border-[#38352F]" />
            
            {/* Cytoband density stripes */}
            <div className="absolute left-[2%] w-[12%] h-full bg-[#E8D89A]/30 border-r border-[#E8D89A]/50" />
            <div className="absolute left-[22%] w-[16%] h-full bg-[#B89A4A]/20 border-r border-[#B89A4A]/40" />
            <div className="absolute left-[62%] w-[18%] h-full bg-[#B89A4A]/25 border-r border-[#B89A4A]/40" />
            <div className="absolute left-[85%] w-[10%] h-full bg-[#E8D89A]/30 border-r border-[#E8D89A]/50" />

            {/* Selected Focal Window Pin */}
            <div 
              className="absolute left-[4%] top-0 bottom-0 w-3 bg-[#FAF7F0] shadow-lg shadow-white/50 cursor-pointer animate-pulse"
              title="Selected Locus: chr1:10520"
            />
          </div>
        </div>

        {/* Focal Zoom Track (10kb window) */}
        <div className="pt-4 border-t border-[#24221E] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#E8D89A] font-bold">FOCAL RESOLUTION (10,000 bp — 12,000 bp)</span>
            <span className="text-[#8C734B]">Zoom: 2,000 bp window</span>
          </div>

          <div className="h-16 w-full bg-[#11110F] rounded-xl border border-[#38352F] p-3 relative flex items-center">
            {/* Focal Candidate Region Box */}
            <div 
              className="absolute left-[25%] px-3 py-1.5 rounded bg-[#B89A4A]/30 border border-[#E8D89A] text-xs text-[#FAF7F0] flex items-center gap-2 cursor-pointer hover:bg-[#B89A4A]/50"
              onClick={() => setSelectedLocus('chr1:10520-10595')}
            >
              <MapPin size={14} className="text-[#E8D89A]" />
              <span>CR-10520 (pos 10,555 A&gt;G)</span>
            </div>

            <div 
              className="absolute left-[65%] px-3 py-1.5 rounded bg-[#24221E] border border-[#5C5549] text-xs text-[#DDD4C0] flex items-center gap-2 cursor-pointer"
            >
              <MapPin size={14} className="text-[#8C734B]" />
              <span>CR-11420 (pos 11,480 C&gt;T)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Region Card */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
        <div className="space-y-1">
          <span className="text-[#8C734B] uppercase">Inspected Coordinate Block</span>
          <div className="text-base font-bold text-[#181715]">{selectedLocus}</div>
          <p className="text-[11px] text-[#5C5549] font-sans">
            Overlaps DDX11L1 non-coding transcript; exhibits balanced biallelic transition resolved via QAOA quantum annealing.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="font-bold text-[#181715]">QUAL 98.2</div>
            <div className="text-[#2E6B48]">Verified Variant</div>
          </div>
          <span className="px-3 py-1 rounded bg-[#2E6B48]/15 text-[#2E6B48] font-bold border border-[#2E6B48]/30">
            PASS
          </span>
        </div>
      </div>
    </div>
  );
};

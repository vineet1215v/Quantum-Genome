import React from 'react';
import { Variant, CandidateRegion } from '../../types';
import { CANDIDATE_REGIONS } from '../../data/mockData';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  X, 
  Atom, 
  Cpu, 
  Dna, 
  CheckCircle2, 
  ExternalLink, 
  Download,
  Info,
  ShieldCheck
} from 'lucide-react';

interface VariantDrawerProps {
  variant: Variant | null;
  onClose: () => void;
  onOpenInQuantumLab?: (region: CandidateRegion) => void;
}

export const VariantDrawer: React.FC<VariantDrawerProps> = ({
  variant,
  onClose,
  onOpenInQuantumLab
}) => {
  if (!variant) return null;

  const associatedRegion = CANDIDATE_REGIONS.find(r => r.id === variant.candidateRegionId) || CANDIDATE_REGIONS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-xl h-full bg-[#FAF7F0] border-l border-[#DDD4C0] shadow-2xl flex flex-col font-mono text-xs overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#DDD4C0] bg-[#EFE9DC] flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#8C734B] uppercase font-bold">
                Calibrated Variant Record
              </span>
              <ScientificBadge status="EXPERIMENTAL" detail="VCF Record" />
            </div>
            <h2 className="font-serif-sc text-2xl font-bold text-[#181715] mt-1">
              {variant.chromosome}:{variant.position} {variant.ref} &rarr; {variant.alt}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#DDD4C0] text-[#5C5549] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Key Evidence Telemetry */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#DDD4C0] space-y-1">
              <span className="text-[10px] text-[#8C734B] uppercase">Depth</span>
              <div className="text-base font-bold text-[#181715]">{variant.depth}&times;</div>
              <div className="text-[10px] text-[#5C5549]">{variant.altDepth} Alt reads</div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#DDD4C0] space-y-1">
              <span className="text-[10px] text-[#8C734B] uppercase">Allele Freq</span>
              <div className="text-base font-bold text-[#181715]">{(variant.alleleFrequency * 100).toFixed(0)}%</div>
              <div className="text-[10px] text-[#2E6B48]">Heterozygous (0/1)</div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#DDD4C0] space-y-1">
              <span className="text-[10px] text-[#8C734B] uppercase">Phred Qual</span>
              <div className="text-base font-bold text-[#2E6B48]">{variant.quality.toFixed(1)}</div>
              <div className="text-[10px] text-[#2E6B48]">&check; {variant.filter}</div>
            </div>
          </div>

          {/* Biological & Gene Context */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#8C734B] uppercase font-bold">Genomic Annotation &amp; Impact:</span>
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#DDD4C0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#181715] text-sm">{variant.geneContext || 'Intergenic locus'}</span>
                <span className="px-2 py-0.5 rounded bg-[#EFE9DC] text-[#38352F] font-semibold text-[10px]">
                  {variant.functionalImpact || 'Non-coding'}
                </span>
              </div>
              <p className="text-[11px] text-[#5C5549] font-sans">
                Located within high-homology focal window {variant.candidateRegionId}. Mapped against GRCh38.p14 canonical transcript.
              </p>
            </div>
          </div>

          {/* Quantum vs Classical Realignment Analysis */}
          <div className="space-y-3">
            <span className="text-[10px] text-[#8C734B] uppercase font-bold">Co-Processing Resolution:</span>

            {/* Quantum Result */}
            <div className="p-4 rounded-xl bg-[#181715] text-[#FAF7F0] border border-[#B89A4A]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#E8D89A] font-bold">
                  <Atom size={14} className="text-[#B89A4A]" /> Quantum QAOA Analysis
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#2E6B48]/20 text-[#2E6B48] font-bold">
                  CONVERGED
                </span>
              </div>
              <p className="text-[11px] text-[#DDD4C0] font-sans leading-relaxed">
                Energy state -38.64 resolved the multi-read pileup into orthogonal diplotypes. Read #01, #02, and #04 were partitioned with 99.2% statistical confidence, eliminating ambiguous realignment loops.
              </p>
              <div className="text-[10px] text-[#E8D89A] pt-1">
                Ground State Bitstring: |101101⟩ (94.2% measurement density)
              </div>
            </div>

            {/* Classical Result */}
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#DDD4C0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#5C5549] font-bold">
                  <Cpu size={14} className="text-[#5C5549]" /> Classical Baseline (GATK)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFE9DC] text-[#5C5549]">
                  HEURISTIC
                </span>
              </div>
              <p className="text-[11px] text-[#5C5549] font-sans leading-relaxed">
                Classic Smith-Waterman graph assembly produced 2 tied de Bruijn haplotype paths due to flanking tandem repeats before tie-breaking.
              </p>
            </div>
          </div>

          {/* Local Sequence Context */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#8C734B] uppercase font-bold">Local Haplotype Context:</span>
            <div className="p-3 bg-[#11110F] text-[#FAF7F0] rounded-xl border border-[#24221E] space-y-1 overflow-x-auto select-all">
              <div className="text-[#8C734B] text-[10px]">Reference:</div>
              <div className="text-xs tracking-wider break-all text-[#DDD4C0]">
                {associatedRegion.referenceSeq.slice(0, 60)}
              </div>
              <div className="text-[#E8D89A] text-[10px] pt-1">Observed Alternate:</div>
              <div className="text-xs tracking-wider break-all text-[#E8D89A]">
                {associatedRegion.alternateEvidence.slice(0, 60)}
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Actions */}
        <div className="p-6 border-t border-[#DDD4C0] bg-[#EFE9DC] flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={() => {
              if (onOpenInQuantumLab) onOpenInQuantumLab(associatedRegion);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-lg bg-[#181715] text-[#FAF7F0] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#24221E] transition-colors"
          >
            <Atom size={14} className="text-[#E8D89A]" />
            <span>Open in Quantum Lab</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-[#DDD4C0] bg-[#FAF7F0] text-[#181715] font-semibold text-xs hover:bg-[#EAE2D0] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

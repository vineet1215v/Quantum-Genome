import React, { useState } from 'react';
import { VARIANTS_LIST } from '../../data/mockData';
import { Variant } from '../../types';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  GitBranch, 
  Filter, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  SlidersHorizontal,
  FileSpreadsheet,
  Atom
} from 'lucide-react';

interface VariantCallingViewProps {
  onSelectVariant: (variant: Variant) => void;
}

export const VariantCallingView: React.FC<VariantCallingViewProps> = ({
  onSelectVariant
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterMinQual, setFilterMinQual] = useState<number>(80);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const workflowSteps = [
    { title: 'Candidate Region', desc: 'Focal 75bp window' },
    { title: 'Local Evidence', desc: 'Read pileup & Phred' },
    { title: 'Candidate Alleles', desc: 'REF vs ALT hypotheses' },
    { title: 'Genotype Inference', desc: 'QAOA spin state' },
    { title: 'Classification', desc: 'SNP / InDel type' },
    { title: 'Bayesian Filtering', desc: 'QUAL & strand bias' },
    { title: 'Final Variant', desc: 'Calibrated VCF record' }
  ];

  const filteredVariants = VARIANTS_LIST.filter(v => {
    const matchesSearch = v.chromosome.includes(searchTerm) || 
      v.position.toString().includes(searchTerm) || 
      (v.geneContext && v.geneContext.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'ALL' || v.type === filterType;
    const matchesQual = v.quality >= filterMinQual;
    return matchesSearch && matchesType && matchesQual;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Genomic Analysis / Variant Calling
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="VCF v4.2 Calibrated" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Definitive Variant Calling &amp; Genotype Inference
          </h1>
          <p className="text-sm text-[#5C5549]">
            Rigorous statistical transition from candidate generation to final filtered variants using quantum-assisted genotype classification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const header = "CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\n";
              const rows = filteredVariants.map(v => `${v.chromosome}\t${v.position}\t${v.id}\t${v.ref}\t${v.alt}\t${v.quality}\t${v.filter}\tDP=${v.depth};AF=${v.alleleFrequency}\tGT\t${v.genotype}`).join('\n');
              const blob = new Blob([header + rows], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = "quantum_variants.vcf";
              a.click();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#FAF7F0] border border-[#DDD4C0] hover:bg-[#EAE2D0] text-[#181715] transition-colors"
          >
            <Download size={14} />
            <span>Export VCF</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow: Candidate to Final Variant */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
          <h2 className="font-serif-sc text-lg font-semibold text-[#181715]">
            Variant Calling Decision Workflow
          </h2>
          <span className="text-xs font-mono text-[#8C734B]">
            From Evidence Pileup to Genotype Probabilities
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                idx === 6 
                  ? 'bg-[#181715] text-[#FAF7F0] border-[#B89A4A]' 
                  : idx === 3
                  ? 'bg-[#24221E] text-[#E8D89A] border-[#B89A4A]/60'
                  : 'bg-[#FAF7F0] text-[#38352F] border-[#DDD4C0]'
              }`}
            >
              <div className="text-[10px] opacity-70 font-bold">
                0{idx + 1}
              </div>
              <div className="font-bold text-xs truncate">
                {step.title}
              </div>
              <p className="text-[10px] font-sans opacity-80 leading-tight">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C734B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by locus or gene..."
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#EFE9DC] border border-[#DDD4C0] text-xs text-[#181715] placeholder:text-[#8C734B] focus:outline-none focus:border-[#B89A4A]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#8C734B]">Type:</span>
            {['ALL', 'SNP', 'INS', 'DEL'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  filterType === t 
                    ? 'bg-[#181715] text-[#FAF7F0] font-bold' 
                    : 'bg-[#EFE9DC] text-[#5C5549] hover:bg-[#EAE2D0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#8C734B]">Min QUAL:</span>
          <select
            value={filterMinQual}
            onChange={(e) => setFilterMinQual(Number(e.target.value))}
            className="bg-[#EFE9DC] border border-[#DDD4C0] rounded px-2 py-1 text-xs text-[#181715]"
          >
            <option value={0}>All QUAL (&ge; 0)</option>
            <option value={70}>QUAL &ge; 70</option>
            <option value={80}>QUAL &ge; 80 (Standard)</option>
            <option value={90}>QUAL &ge; 90 (High Confidence)</option>
          </select>
        </div>
      </div>

      {/* Primary Variant Call Table */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-[#DDD4C0]">
            <thead className="bg-[#EFE9DC] text-[#5C5549] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold">Chromosome &amp; Pos</th>
                <th className="px-5 py-3 font-semibold">REF</th>
                <th className="px-5 py-3 font-semibold">ALT</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Depth</th>
                <th className="px-5 py-3 font-semibold">AF</th>
                <th className="px-5 py-3 font-semibold">Genotype</th>
                <th className="px-5 py-3 font-semibold">Quality</th>
                <th className="px-5 py-3 font-semibold">Quantum Validated</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE5D8] bg-[#FAF7F0] text-[#181715]">
              {filteredVariants.map((v) => (
                <tr 
                  key={v.id} 
                  onClick={() => onSelectVariant(v)}
                  className="hover:bg-[#F2EBDB] transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-bold">
                    <span>{v.chromosome}:{v.position}</span>
                    {v.geneContext && (
                      <div className="text-[10px] text-[#8C734B] font-sans font-normal">
                        {v.geneContext}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#5C5549]">{v.ref}</td>
                  <td className="px-5 py-3.5 font-bold text-[#A33A3A]">{v.alt}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#EFE9DC] text-[#38352F] text-[10px] font-semibold">
                      {v.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">{v.depth}&times;</td>
                  <td className="px-5 py-3.5 font-semibold text-[#8C734B]">
                    {(v.alleleFrequency * 100).toFixed(0)}%
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#EFE9DC] font-bold text-[#181715]">
                      {v.genotype}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#2E6B48]">
                    {v.quality.toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#2E6B48] font-semibold">
                      <Atom size={12} className="text-[#B89A4A]" />
                      <span>{v.quantumValidated ? 'GROUND STATE' : 'PENDING'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVariant(v);
                      }}
                      className="px-2.5 py-1 rounded bg-[#181715] text-[#FAF7F0] group-hover:bg-[#B89A4A] group-hover:text-[#181715] font-semibold transition-colors text-[10px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

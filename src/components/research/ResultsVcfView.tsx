import React, { useState } from 'react';
import { VARIANTS_LIST } from '../../data/mockData';
import { Variant, CandidateRegion, NavigationTab } from '../../types';
import { ScientificBadge } from '../brand/ScientificBadge';
import { VariantDrawer } from './VariantDrawer';
import { 
  TableProperties, 
  Search, 
  Download, 
  Filter, 
  ArrowUpDown, 
  FileText, 
  ExternalLink,
  Atom,
  CheckCircle2
} from 'lucide-react';

interface ResultsVcfViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenInQuantumLab: (region: CandidateRegion) => void;
}

export const ResultsVcfView: React.FC<ResultsVcfViewProps> = ({
  onNavigate,
  onOpenInQuantumLab
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [sortField, setSortField] = useState<'pos' | 'qual' | 'af'>('pos');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredAndSortedVariants = [...VARIANTS_LIST]
    .filter(v => 
      v.chromosome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.position.toString().includes(searchTerm) ||
      v.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.geneContext && v.geneContext.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let valA = a.position;
      let valB = b.position;
      if (sortField === 'qual') {
        valA = a.quality;
        valB = b.quality;
      } else if (sortField === 'af') {
        valA = a.alleleFrequency;
        valB = b.alleleFrequency;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

  const exportCSV = () => {
    const header = "CHROM,POS,REF,ALT,QUAL,DP,AF,GT,STATUS,GENE\n";
    const rows = filteredAndSortedVariants.map(v => 
      `${v.chromosome},${v.position},${v.ref},${v.alt},${v.quality},${v.depth},${v.alleleFrequency},${v.genotype},${v.filter},${v.geneContext || ''}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "quantumgen_variants.csv";
    a.click();
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Research / Results Workspace
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="VCF Format 4.2" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            VCF Results &amp; Variant Workspace
          </h1>
          <p className="text-sm text-[#5C5549]">
            Search, sort, and inspect variant calls resolved through hybrid quantum variational optimization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#FAF7F0] border border-[#DDD4C0] hover:bg-[#EAE2D0] text-[#181715] transition-colors"
          >
            <FileText size={14} className="text-[#8C734B]" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-colors shadow-sm"
          >
            <Download size={14} className="text-[#E8D89A]" />
            <span>Export CSV / VCF</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C734B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by position, ref/alt, or gene..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#EFE9DC] border border-[#DDD4C0] text-xs text-[#181715] placeholder:text-[#8C734B] focus:outline-none focus:border-[#B89A4A]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#8C734B]">Sort:</span>
          <button
            onClick={() => {
              if (sortField === 'pos') setSortAsc(!sortAsc);
              else { setSortField('pos'); setSortAsc(true); }
            }}
            className={`px-2.5 py-1 rounded border text-xs ${
              sortField === 'pos' ? 'bg-[#181715] text-[#FAF7F0] border-[#181715]' : 'bg-[#EFE9DC] border-[#DDD4C0] text-[#5C5549]'
            }`}
          >
            Position {sortField === 'pos' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => {
              if (sortField === 'qual') setSortAsc(!sortAsc);
              else { setSortField('qual'); setSortAsc(false); }
            }}
            className={`px-2.5 py-1 rounded border text-xs ${
              sortField === 'qual' ? 'bg-[#181715] text-[#FAF7F0] border-[#181715]' : 'bg-[#EFE9DC] border-[#DDD4C0] text-[#5C5549]'
            }`}
          >
            QUAL {sortField === 'qual' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => {
              if (sortField === 'af') setSortAsc(!sortAsc);
              else { setSortField('af'); setSortAsc(false); }
            }}
            className={`px-2.5 py-1 rounded border text-xs ${
              sortField === 'af' ? 'bg-[#181715] text-[#FAF7F0] border-[#181715]' : 'bg-[#EFE9DC] border-[#DDD4C0] text-[#5C5549]'
            }`}
          >
            AF {sortField === 'af' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Main VCF Table as formatted in prompt */}
      <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl overflow-hidden shadow-xs font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-[#DDD4C0]">
            <thead className="bg-[#EFE9DC] text-[#5C5549] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold">CHR</th>
                <th className="px-5 py-3 font-semibold">POS</th>
                <th className="px-5 py-3 font-semibold">REF</th>
                <th className="px-5 py-3 font-semibold">ALT</th>
                <th className="px-5 py-3 font-semibold">QUAL</th>
                <th className="px-5 py-3 font-semibold">DP</th>
                <th className="px-5 py-3 font-semibold">AF</th>
                <th className="px-5 py-3 font-semibold">GENOTYPE</th>
                <th className="px-5 py-3 font-semibold">FILTER</th>
                <th className="px-5 py-3 font-semibold">GENE / CONTEXT</th>
                <th className="px-5 py-3 font-semibold">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE5D8] bg-[#FAF7F0] text-[#181715]">
              {filteredAndSortedVariants.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className="hover:bg-[#F2EBDB] transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-bold">{v.chromosome}</td>
                  <td className="px-5 py-3.5 font-bold text-[#8C734B]">{v.position}</td>
                  <td className="px-5 py-3.5 font-bold text-[#5C5549]">{v.ref}</td>
                  <td className="px-5 py-3.5 font-bold text-[#A33A3A]">{v.alt}</td>
                  <td className="px-5 py-3.5 font-bold text-[#2E6B48]">{v.quality.toFixed(1)}</td>
                  <td className="px-5 py-3.5">{v.depth}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#8C734B]">
                    {v.alleleFrequency.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#EFE9DC] text-[#181715] font-bold">
                      {v.genotype}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#2E6B48]/15 text-[#2E6B48] font-bold text-[10px]">
                      {v.filter}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#5C5549] font-sans text-xs">
                    {v.geneContext || 'Intergenic'}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className="text-xs text-[#8C734B] group-hover:text-[#181715] underline"
                    >
                      Inspect Drawer &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Variant Drawer Component */}
      <VariantDrawer 
        variant={selectedVariant}
        onClose={() => setSelectedVariant(null)}
        onOpenInQuantumLab={onOpenInQuantumLab}
      />
    </div>
  );
};

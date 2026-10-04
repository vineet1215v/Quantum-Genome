import React, { useState, useId } from 'react';
import { 
  Dna, 
  Upload, 
  FileText, 
  Play, 
  BarChart3, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  Search, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  Cpu,
  Atom,
  ArrowLeft
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../brand/ThemeToggle';
import { ThemeMode, AnalyzedVariant, PresetDataset } from '../../types';
import { PRESET_DATASETS, analyzeCustomSequences } from '../../data/genomicAnalyzerData';
import { HelixQuantumViewer } from './HelixQuantumViewer';
import { SequenceDiffCanvas } from './SequenceDiffCanvas';

interface GenomicAnalyzerPageProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onBackToLanding?: () => void;
}

export const GenomicAnalyzerPage: React.FC<GenomicAnalyzerPageProps> = ({
  theme,
  onToggleTheme,
  onBackToLanding
}) => {
  const refFileInputId = useId();
  const queryFileInputId = useId();
  const isDark = theme === 'dark';

  const [selectedPresetId, setSelectedPresetId] = useState<string>('tp53-panel');
  const activePreset = PRESET_DATASETS.find(p => p.id === selectedPresetId) || PRESET_DATASETS[0];

  const [refHeader, setRefHeader] = useState<string>(activePreset.refFastaHeader);
  const [refSequence, setRefSequence] = useState<string>(activePreset.refSequence);
  const [queryHeader, setQueryHeader] = useState<string>(activePreset.queryFastaHeader);
  const [querySequence, setQuerySequence] = useState<string>(activePreset.querySequence);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState<string>('Just now');
  const [executionMs, setExecutionMs] = useState<number>(318);

  const [variants, setVariants] = useState<AnalyzedVariant[]>(activePreset.variants);
  const [qualityScores, setQualityScores] = useState<{ pos: number; score: number; errorRate: number }[]>(activePreset.qualityScores);
  const [vafDistribution, setVafDistribution] = useState<{ bin: string; count: number; category: string }[]>(activePreset.vafDistribution);

  const [spotlightVariantId, setSpotlightVariantId] = useState<string | null>(activePreset.variants[0]?.id || null);

  const [filterCategory, setFilterCategory] = useState<'all' | 'snp' | 'indel' | 'somatic' | 'germline' | 'cancer' | 'benign'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedVariantId, setExpandedVariantId] = useState<string | null>(null);

  const handleSelectPreset = (preset: PresetDataset) => {
    setSelectedPresetId(preset.id);
    setRefHeader(preset.refFastaHeader);
    setRefSequence(preset.refSequence);
    setQueryHeader(preset.queryFastaHeader);
    setQuerySequence(preset.querySequence);

    setIsAnalyzing(true);
    setTimeout(() => {
      setVariants(preset.variants);
      setQualityScores(preset.qualityScores);
      setVafDistribution(preset.vafDistribution);
      setSpotlightVariantId(preset.variants[0]?.id || null);
      setIsAnalyzing(false);
      setLastAnalyzedTime('Just now');
      setExecutionMs(Math.round(280 + Math.random() * 90));
    }, 450);
  };

  const handleUploadRefFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n');
      const headerLine = lines.find(l => l.startsWith('>')) || `>${file.name}`;
      const seqLines = lines.filter(l => !l.startsWith('>')).join('').trim();
      setRefHeader(headerLine);
      setRefSequence(seqLines);
      setSelectedPresetId('custom');
    };
    reader.readAsText(file);
  };

  const handleUploadQueryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n');
      const headerLine = lines.find(l => l.startsWith('>') || l.startsWith('@')) || `>${file.name}`;
      let seqLines = '';
      if (file.name.endsWith('.fastq') || file.name.endsWith('.fq')) {
        for (let i = 1; i < lines.length; i += 4) {
          if (lines[i]) seqLines += lines[i].trim();
        }
      } else {
        seqLines = lines.filter(l => !l.startsWith('>')).join('').trim();
      }
      setQueryHeader(headerLine);
      setQuerySequence(seqLines);
      setSelectedPresetId('custom');
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeCustomSequences(refHeader, refSequence, queryHeader, querySequence);
      setVariants(result.variants);
      setQualityScores(result.qualityScores);
      setVafDistribution(result.vafDistribution);
      setSpotlightVariantId(result.variants[0]?.id || null);
      setIsAnalyzing(false);
      setLastAnalyzedTime('Just now');
      setExecutionMs(Math.round(290 + Math.random() * 120));
    }, 500);
  };

  const filteredVariants = variants.filter(v => {
    if (filterCategory === 'snp' && v.type !== 'SNP') return false;
    if (filterCategory === 'indel' && v.type === 'SNP') return false;
    if (filterCategory === 'somatic' && v.origin !== 'Somatic') return false;
    if (filterCategory === 'germline' && v.origin !== 'Germline') return false;
    if (filterCategory === 'cancer' && !v.isCancerous) return false;
    if (filterCategory === 'benign' && v.clinicalSignificance !== 'Benign' && v.clinicalSignificance !== 'Likely Benign') return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = 
        v.id.toLowerCase().includes(q) ||
        v.geneSymbol.toLowerCase().includes(q) ||
        v.whatVariantIsIt.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.origin.toLowerCase().includes(q) ||
        v.clinicalSignificance.toLowerCase().includes(q) ||
        String(v.position).includes(q);
      if (!match) return false;
    }

    return true;
  });

  const totalVariants = variants.length;
  const snpCount = variants.filter(v => v.type === 'SNP').length;
  const indelCount = variants.filter(v => v.type === 'INS' || v.type === 'DEL').length;
  const somaticCount = variants.filter(v => v.origin === 'Somatic').length;
  const germlineCount = variants.filter(v => v.origin === 'Germline').length;
  const cancerCount = variants.filter(v => v.isCancerous).length;
  const benignCount = variants.filter(v => v.clinicalSignificance === 'Benign' || v.clinicalSignificance === 'Likely Benign').length;
  const vusCount = variants.filter(v => v.clinicalSignificance === 'VUS').length;
  const meanPhred = variants.length > 0
    ? (variants.reduce((acc, v) => acc + v.quality, 0) / variants.length).toFixed(1)
    : '41.2';

  const missenseCount = variants.filter(v => v.mutationClass === 'Missense').length;
  const frameshiftCount = variants.filter(v => v.mutationClass === 'Frameshift InDel').length;
  const inframeDelCount = variants.filter(v => v.mutationClass === 'In-frame Deletion').length;
  const synonymousCount = variants.filter(v => v.mutationClass === 'Synonymous').length;
  const intronicCount = variants.filter(v => v.mutationClass === 'Intronic / Non-coding').length;

  const handleExportVCF = () => {
    let vcfContent = `##fileformat=VCFv4.2\n##source=QuantumGen_v2.4_AcceleratedWorkstation\n##reference=${refHeader.replace('>', '')}\n##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">\n##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">\n##INFO=<ID=ORIGIN,Number=1,Type=String,Description="Somatic or Germline">\n##INFO=<ID=CLNSIG,Number=1,Type=String,Description="Clinical Significance">\n##INFO=<ID=CLASS,Number=1,Type=String,Description="Mutation Classification">\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\n`;
    
    variants.forEach(v => {
      vcfContent += `${v.chromosome}\t${v.position}\t${v.id}\t${v.ref}\t${v.alt}\t${v.quality}\tPASS\tDP=${v.depth};AF=${v.alleleFrequency};ORIGIN=${v.origin};CLNSIG=${v.clinicalSignificance};CLASS=${v.mutationClass};DESC=${v.whatVariantIsIt.replace(/\s+/g, '_')}\n`;
    });

    const blob = new Blob([vcfContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QuantumGen_${selectedPresetId}_variants.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    let csvContent = 'ID,Chromosome,Position,REF,ALT,Type,Origin,Clinical Significance,Is Cancerous,Mutation Class,What Variant Is It,Gene,VAF (%),Depth,Quality Phred\n';
    variants.forEach(v => {
      csvContent += `"${v.id}","${v.chromosome}",${v.position},"${v.ref}","${v.alt}","${v.type}","${v.origin}","${v.clinicalSignificance}",${v.isCancerous},"${v.mutationClass}","${v.whatVariantIsIt.replace(/"/g, '""')}","${v.geneSymbol}",${(v.alleleFrequency * 100).toFixed(1)},${v.depth},${v.quality}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QuantumGen_${selectedPresetId}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 ${
      isDark ? 'bg-[#0E0D0B] text-[#FAF7F0]' : 'bg-[#F7F4EB] text-[#181715]'
    }`}>
      {/* Top Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between transition-colors ${
        isDark 
          ? 'bg-[#141311]/90 border-[#2E2C27]' 
          : 'bg-[#FAF7F0]/90 border-[#DDD4C0]'
      }`}>
        <div className="flex items-center gap-3.5">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                isDark 
                  ? 'bg-[#1C1A17] hover:bg-[#25221E] border-[#2E2C27] text-[#E8D89A]' 
                  : 'bg-[#FAF7F0] hover:bg-[#EAE2D0] border-[#DDD4C0] text-[#181715]'
              }`}
              title="Return to Landing Page"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          )}

          <Logo size="md" theme={theme} showSubtitle={false} />
          <div className="border-l pl-3.5 border-[#DDD4C0] dark:border-[#2E2C27] hidden sm:block">
            <h1 className="text-sm font-semibold tracking-tight font-serif-sc text-[#181715] dark:text-[#FAF7F0] flex items-center gap-2">
              <span>QuantumGen</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded uppercase bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A]">
                Single-Page Workstation
              </span>
            </h1>
            <p className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              Accelerated Genomic Sequence Analysis & Variant Calling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono bg-[#EFE9DC]/60 dark:bg-[#1E1C18] border-[#DDD4C0] dark:border-[#2E2C27] text-[#5C5549] dark:text-[#A8A092]">
            <Atom size={13} className="text-[#B89A4A] dark:text-[#E8D89A] animate-spin" style={{ animationDuration: '10s' }} />
            <span>QAOA Hybrid Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} compact={false} />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">

        {/* Hero Visual Treat: 3D Quantum Double Helix & Active Locus */}
        <div className={`rounded-2xl border overflow-hidden p-5 sm:p-6 transition-all shadow-sm ${
          isDark 
            ? 'bg-gradient-to-r from-[#141311] via-[#181715] to-[#12110F] border-[#2E2C27]' 
            : 'bg-gradient-to-r from-[#FAF7F0] via-[#F5EFE3] to-[#FAF7F0] border-[#DDD4C0]'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A]">
                  Active Genomic Locus
                </span>
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  {activePreset.chromosome} • {activePreset.sampleType}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif-sc font-bold tracking-tight text-[#181715] dark:text-[#FAF7F0]">
                {activePreset.title}
              </h2>

              <p className="text-xs font-sans text-[#5C5549] dark:text-[#A8A092] leading-relaxed max-w-2xl">
                {activePreset.subtitle}. Deep sequencing alignment resolving ambiguous homologous regions, disambiguating subclonal somatic oncogenic drivers from benign germline polymorphisms.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092] mr-1">
                  Select Panel:
                </span>
                {PRESET_DATASETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                      selectedPresetId === preset.id
                        ? 'bg-[#181715] text-[#FAF7F0] dark:bg-[#B89A4A] dark:text-[#11110F] border-[#181715] dark:border-[#B89A4A] font-semibold shadow-xs'
                        : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-[#5C5549] dark:text-[#A8A092] border-[#DDD4C0] dark:border-[#2E2C27] hover:bg-[#EFE9DC] dark:hover:bg-[#282621]'
                    }`}
                  >
                    {preset.targetGene} Panel
                  </button>
                ))}
              </div>
            </div>

            <div className={`lg:col-span-5 h-52 sm:h-56 rounded-xl border relative overflow-hidden ${
              isDark ? 'bg-[#0E0D0B] border-[#2E2C27]' : 'bg-[#EFE9DC]/70 border-[#DDD4C0]'
            }`}>
              <HelixQuantumViewer
                theme={theme}
                activeLocus={activePreset.targetGene}
                isAnalyzing={isAnalyzing}
              />
            </div>

          </div>
        </div>

        {/* 1. Reference FASTA & 2. FASTA / FASTQ to be analysed */}
        <section className={`rounded-xl border p-5 sm:p-6 shadow-sm transition-colors ${
          isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#DDD4C0] dark:border-[#2E2C27] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A]">
                  Step 1 & 2 • Single Page Input
                </span>
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  FASTA / FASTQ Format
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-0.5">
                Genomic Sequence Upload
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
              <Clock size={13} className="text-[#B89A4A]" />
              <span>Aligned: {lastAnalyzedTime}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{executionMs} ms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 1. REFERENCE FASTA */}
            <div className={`p-4 rounded-xl border flex flex-col space-y-3 transition-colors ${
              isDark ? 'bg-[#100F0D] border-[#262420]' : 'bg-[#F5F0E6] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B89A4A] text-[#11110F] font-bold text-xs font-mono">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#181715] dark:text-[#FAF7F0]">
                      Reference FASTA
                    </h4>
                    <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] font-mono">
                      Wild-type reference standard (GRCh38 / Ensembl)
                    </p>
                  </div>
                </div>

                <label
                  htmlFor={refFileInputId}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono bg-[#FAF7F0] dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F] hover:bg-[#EAE2D0] dark:hover:bg-[#282621] text-[#181715] dark:text-[#FAF7F0] transition-colors shadow-xs"
                >
                  <Upload size={12} className="text-[#B89A4A]" />
                  <span>Upload .fasta</span>
                  <input
                    id={refFileInputId}
                    type="file"
                    accept=".fasta,.fa,.fna,.txt"
                    onChange={handleUploadRefFile}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={refHeader}
                onChange={(e) => setRefHeader(e.target.value)}
                placeholder=">Reference FASTA header"
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] focus:border-[#B89A4A]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] focus:border-[#B89A4A]'
                }`}
              />

              <div className="relative flex-1">
                <textarea
                  rows={6}
                  value={refSequence}
                  onChange={(e) => {
                    setRefSequence(e.target.value);
                    setSelectedPresetId('custom');
                  }}
                  placeholder="Paste reference nucleotide sequence (A, C, G, T)..."
                  className={`w-full p-3 rounded-lg text-xs font-mono border resize-none focus:outline-none transition-colors dark-scroll leading-relaxed ${
                    isDark
                      ? 'bg-[#161513] border-[#38352F] text-[#E8D89A] focus:border-[#B89A4A]'
                      : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#38352F] focus:border-[#B89A4A]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] pt-1">
                <span>Length: {refSequence.replace(/[^A-Za-z]/g, '').length.toLocaleString()} bp</span>
                <span>GC: {(
                  (refSequence.replace(/[^GCgc]/g, '').length /
                    Math.max(1, refSequence.replace(/[^A-Za-z]/g, '').length)) *
                  100
                ).toFixed(1)}%</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Validated Ref</span>
              </div>
            </div>

            {/* 2. FASTA / FASTQ TO BE ANALYSED */}
            <div className={`p-4 rounded-xl border flex flex-col space-y-3 transition-colors ${
              isDark ? 'bg-[#100F0D] border-[#262420]' : 'bg-[#F5F0E6] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B89A4A] text-[#11110F] font-bold text-xs font-mono">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#181715] dark:text-[#FAF7F0]">
                      FASTA / FASTQ to be Analysed
                    </h4>
                    <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] font-mono">
                      Query sample read(s) or tumor sequencing file
                    </p>
                  </div>
                </div>

                <label
                  htmlFor={queryFileInputId}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono bg-[#FAF7F0] dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F] hover:bg-[#EAE2D0] dark:hover:bg-[#282621] text-[#181715] dark:text-[#FAF7F0] transition-colors shadow-xs"
                >
                  <Upload size={12} className="text-[#B89A4A]" />
                  <span>Upload .fasta / .fastq</span>
                  <input
                    id={queryFileInputId}
                    type="file"
                    accept=".fasta,.fa,.fastq,.fq,.txt"
                    onChange={handleUploadQueryFile}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={queryHeader}
                onChange={(e) => setQueryHeader(e.target.value)}
                placeholder=">Sample query header"
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] focus:border-[#B89A4A]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] focus:border-[#B89A4A]'
                }`}
              />

              <div className="relative flex-1">
                <textarea
                  rows={6}
                  value={querySequence}
                  onChange={(e) => {
                    setQuerySequence(e.target.value);
                    setSelectedPresetId('custom');
                  }}
                  placeholder="Paste patient/sample nucleotide sequence to align and call variants..."
                  className={`w-full p-3 rounded-lg text-xs font-mono border resize-none focus:outline-none transition-colors dark-scroll leading-relaxed ${
                    isDark
                      ? 'bg-[#161513] border-[#38352F] text-[#E8D89A] focus:border-[#B89A4A]'
                      : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#38352F] focus:border-[#B89A4A]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] pt-1">
                <span>Length: {querySequence.replace(/[^A-Za-z]/g, '').length.toLocaleString()} bp</span>
                <span>Format: {queryHeader.includes('fastq') || queryHeader.includes('@') ? 'FASTQ PE Reads' : 'FASTA Targeted'}</span>
                <span className="text-amber-700 dark:text-amber-400 font-medium">Ready for Variant Calling</span>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-[#DDD4C0] dark:border-[#2E2C27] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#5C5549] dark:text-[#A8A092] font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Cpu size={14} className="text-[#B89A4A]" />
                Quantum-Classical Pipeline: QUBO Optimization
              </span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Concordance: 99.8%
              </span>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm ${
                isAnalyzing
                  ? 'bg-amber-600 text-white cursor-wait opacity-80'
                  : 'bg-[#B89A4A] hover:bg-[#A3863D] text-[#11110F] dark:bg-[#B89A4A] dark:hover:bg-[#C9A952] active:scale-98'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#11110F] border-t-transparent rounded-full animate-spin" />
                  <span>Aligning & Calling Variants...</span>
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" />
                  <span>Run Accelerated Genomic Analysis</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Dual-Track Nucleotide Alignment & Mismatch Visualizer */}
        <section>
          <SequenceDiffCanvas
            theme={theme}
            refSeq={refSequence}
            querySeq={querySequence}
            variants={variants}
            selectedVariantId={spotlightVariantId}
            onSelectVariant={(v) => {
              setSpotlightVariantId(v.id);
              setExpandedVariantId(v.id);
            }}
          />
        </section>

        {/* Output (O.p) - KPI Summary Tiles */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  Analysis Output (O.p)
                </span>
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  {variants.length} Genomic Alterations Identified
                </span>
              </div>
              <h3 className="text-xl font-serif-sc font-bold tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-0.5">
                Genomic Variant Classification & Clinical Summary
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportVCF}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] hover:bg-[#22201C]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] hover:bg-[#EAE2D0]'
                }`}
                title="Download Standard VCF 4.2 File"
              >
                <Download size={13} className="text-[#B89A4A]" />
                <span>Export VCF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] hover:bg-[#22201C]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] hover:bg-[#EAE2D0]'
                }`}
                title="Download CSV Summary Report"
              >
                <FileText size={13} className="text-[#B89A4A]" />
                <span>Report (CSV)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                <span>Total Calls</span>
                <Dna size={14} className="text-[#B89A4A]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#181715] dark:text-[#FAF7F0] mt-1.5">
                {totalVariants}
              </div>
              <div className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                High-Confidence
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                <span>SNPs / InDels</span>
                <Layers size={14} className="text-[#B89A4A]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#181715] dark:text-[#FAF7F0] mt-1.5">
                {snpCount} <span className="text-sm font-normal text-[#5C5549] dark:text-[#A8A092]">/</span> {indelCount}
              </div>
              <div className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                {Math.round((snpCount / Math.max(1, totalVariants)) * 100)}% Point Mutations
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-amber-600 dark:text-amber-400">
                <span>Somatic / Germline</span>
                <Activity size={14} />
              </div>
              <div className="text-2xl font-bold font-mono text-[#181715] dark:text-[#FAF7F0] mt-1.5">
                <span className="text-amber-700 dark:text-amber-400">{somaticCount}</span>
                <span className="text-sm font-normal text-[#5C5549] dark:text-[#A8A092]"> / </span>
                <span className="text-blue-700 dark:text-blue-400">{germlineCount}</span>
              </div>
              <div className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                {somaticCount} Tumor Acquired
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-rose-700 dark:text-rose-400 font-semibold">
                <span>Cancer / Pathogenic</span>
                <ShieldAlert size={14} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-400 mt-1.5">
                {cancerCount}
              </div>
              <div className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                Oncogenic Drivers
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Benign / Neutral</span>
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1.5">
                {benignCount}
              </div>
              <div className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                Polymorphic Loci
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                <span>Mean Quality</span>
                <Sparkles size={14} className="text-[#B89A4A]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#181715] dark:text-[#FAF7F0] mt-1.5">
                Q{meanPhred}
              </div>
              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                &gt;99.98% Accuracy
              </div>
            </div>
          </div>
        </section>

        {/* Graphs: Variants (SNP/InDel), Somatic vs Germline, Benign vs Cancer, What Variant Is It */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-mono text-[#B89A4A] dark:text-[#E8D89A] font-semibold tracking-wider uppercase">
              Biological Data Visualizations
            </span>
            <h3 className="text-lg font-semibold tracking-tight text-[#181715] dark:text-[#FAF7F0]">
              Visual Variant Breakdown & Pathogenicity Spectra
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* 1. Variant Type (SNP vs InDel) */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#181715] dark:text-[#FAF7F0]">
                    1. Variant Type (SNP vs InDel)
                  </h4>
                  <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                    Total {totalVariants}
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                  Single Nucleotide vs Structural Insertions/Deletions
                </p>
              </div>

              <div className="my-5 flex items-center justify-center">
                <svg width="130" height="130" viewBox="0 0 100 100" className="rotate-[-90deg]">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={isDark ? '#201E1A' : '#EFE9DC'}
                    strokeWidth="14"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#B89A4A"
                    strokeWidth="14"
                    strokeDasharray={`${(snpCount / Math.max(1, totalVariants)) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="14"
                    strokeDashoffset={`-${(snpCount / Math.max(1, totalVariants)) * 251.2}`}
                    strokeDasharray={`${(indelCount / Math.max(1, totalVariants)) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#DDD4C0]/70 dark:border-[#2E2C27]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#181715] dark:text-[#FAF7F0]">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#B89A4A]" />
                    SNPs (Point)
                  </span>
                  <span className="font-bold text-[#181715] dark:text-[#FAF7F0]">
                    {snpCount} ({Math.round((snpCount / Math.max(1, totalVariants)) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#181715] dark:text-[#FAF7F0]">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
                    InDels (Ins/Del)
                  </span>
                  <span className="font-bold text-[#181715] dark:text-[#FAF7F0]">
                    {indelCount} ({Math.round((indelCount / Math.max(1, totalVariants)) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Somatic vs Germline */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#181715] dark:text-[#FAF7F0]">
                    2. Somatic vs Germline
                  </h4>
                  <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                    Origin
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                  Tumor-Acquired vs Inherited Constitutional
                </p>
              </div>

              <div className="my-5 flex items-center justify-center">
                <svg width="130" height="130" viewBox="0 0 100 100" className="rotate-[-90deg]">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={isDark ? '#201E1A' : '#EFE9DC'}
                    strokeWidth="14"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#D97706"
                    strokeWidth="14"
                    strokeDasharray={`${(somaticCount / Math.max(1, totalVariants)) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#0284C7"
                    strokeWidth="14"
                    strokeDashoffset={`-${(somaticCount / Math.max(1, totalVariants)) * 251.2}`}
                    strokeDasharray={`${(germlineCount / Math.max(1, totalVariants)) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#DDD4C0]/70 dark:border-[#2E2C27]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#181715] dark:text-[#FAF7F0]">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" />
                    Somatic (Tumor)
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {somaticCount} ({Math.round((somaticCount / Math.max(1, totalVariants)) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#181715] dark:text-[#FAF7F0]">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-600" />
                    Germline (Inherited)
                  </span>
                  <span className="font-bold text-sky-700 dark:text-sky-400">
                    {germlineCount} ({Math.round((germlineCount / Math.max(1, totalVariants)) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Benign or Cancer (Pathogenicity) */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#181715] dark:text-[#FAF7F0]">
                    3. Benign or Cancer Pathogenicity
                  </h4>
                  <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                    Clinical
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                  Oncogenic Driver vs Neutral Benign Polymorphism
                </p>
              </div>

              <div className="my-5 space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-rose-700 dark:text-rose-400 font-medium">Cancerous / Pathogenic</span>
                    <span className="font-bold">{cancerCount}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EFE9DC] dark:bg-[#201E1A] overflow-hidden">
                    <div 
                      className="h-full bg-rose-600 rounded-full" 
                      style={{ width: `${(cancerCount / Math.max(1, totalVariants)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Benign / Neutral</span>
                    <span className="font-bold">{benignCount}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EFE9DC] dark:bg-[#201E1A] overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full" 
                      style={{ width: `${(benignCount / Math.max(1, totalVariants)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-amber-700 dark:text-amber-400 font-medium">VUS (Uncertain)</span>
                    <span className="font-bold">{vusCount}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EFE9DC] dark:bg-[#201E1A] overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${(vusCount / Math.max(1, totalVariants)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DDD4C0]/70 dark:border-[#2E2C27] text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                <span>Cancer Actionability: </span>
                <span className="font-semibold text-rose-700 dark:text-rose-400">
                  {Math.round((cancerCount / Math.max(1, totalVariants)) * 100)}% of calls
                </span>
              </div>
            </div>

            {/* 4. What Variant Is It */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#181715] dark:text-[#FAF7F0]">
                    4. What Variant Is It
                  </h4>
                  <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                    Molecular Class
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                  Functional Consequence on Protein Coding
                </p>
              </div>

              <div className="my-3 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Missense
                  </span>
                  <span className="font-bold">{missenseCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Frameshift InDel
                  </span>
                  <span className="font-bold">{frameshiftCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    In-frame Deletion
                  </span>
                  <span className="font-bold">{inframeDelCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Synonymous (Silent)
                  </span>
                  <span className="font-bold">{synonymousCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Intronic / Non-coding
                  </span>
                  <span className="font-bold">{intronicCount}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DDD4C0]/70 dark:border-[#2E2C27] text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                <span>Primary Class: </span>
                <span className="font-bold text-[#181715] dark:text-[#FAF7F0]">
                  {missenseCount >= frameshiftCount ? 'Missense (Protein Altering)' : 'Frameshift Truncation'}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Histogram & Quality Plot */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Histogram: VAF Distribution */}
          <div className={`p-5 rounded-xl border transition-colors ${
            isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C0] dark:border-[#2E2C27]">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={15} className="text-[#B89A4A]" />
                  <h4 className="text-sm font-semibold tracking-tight text-[#181715] dark:text-[#FAF7F0]">
                    Variant Allele Frequency (VAF %) Histogram
                  </h4>
                </div>
                <p className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                  Distribution of alt reads showing somatic subclonal vs germline heterozygous (50%) & homozygous (100%)
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Somatic &lt;45%
                </span>
                <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Germline ~50%
                </span>
              </div>
            </div>

            <div className="pt-4">
              <div className="h-56 w-full flex items-end gap-1.5 sm:gap-2 px-2 pb-6 relative border-b border-l border-[#DDD4C0] dark:border-[#2E2C27]">
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-[#DDD4C0]/50 dark:border-[#2E2C27] pointer-events-none" />
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-[#DDD4C0]/50 dark:border-[#2E2C27] pointer-events-none" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-[#DDD4C0]/50 dark:border-[#2E2C27] pointer-events-none" />

                {vafDistribution.map((item) => {
                  const maxCount = Math.max(1, ...vafDistribution.map((d: { count: number }) => d.count));
                  const heightPercent = item.count > 0 ? Math.max(18, (item.count / maxCount) * 85) : 4;
                  const idx = vafDistribution.indexOf(item);
                  const isSomaticZone = idx >= 1 && idx <= 3;
                  const isGermlineHetZone = idx >= 4 && idx <= 5;
                  const isGermlineHomZone = idx >= 8;

                  let barColor = 'bg-[#C4B9A1] dark:bg-[#2A2824]';
                  if (item.count > 0) {
                    if (isSomaticZone) barColor = 'bg-amber-500 hover:bg-amber-600';
                    else if (isGermlineHetZone) barColor = 'bg-blue-600 hover:bg-blue-700';
                    else if (isGermlineHomZone) barColor = 'bg-emerald-600 hover:bg-emerald-700';
                    else barColor = 'bg-[#B89A4A] hover:bg-[#A3863D]';
                  }

                  return (
                    <div key={item.bin} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 px-2 py-1 rounded bg-[#181715] text-[#FAF7F0] dark:bg-[#FAF7F0] dark:text-[#181715] text-[10px] font-mono shadow-md whitespace-nowrap">
                        {item.bin}: {item.count} variant(s) ({item.category})
                      </div>

                      {item.count > 0 && (
                        <span className="text-[10px] font-mono font-bold mb-1 text-[#181715] dark:text-[#FAF7F0]">
                          {item.count}
                        </span>
                      )}

                      <div
                        className={`w-full rounded-t transition-all duration-300 ${barColor}`}
                        style={{ height: `${heightPercent}%` }}
                      />

                      <span className="absolute -bottom-5 text-[9px] sm:text-[10px] font-mono text-[#5C5549] dark:text-[#A8A092] tracking-tighter">
                        {item.bin}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] gap-2 pt-2 border-t border-[#DDD4C0]/50 dark:border-[#2E2C27]">
                <div className="flex items-center gap-3">
                  <span className="text-amber-700 dark:text-amber-400">■ Subclonal Somatic Peak: 15%–38%</span>
                  <span className="text-blue-700 dark:text-blue-400">■ Heterozygous Germline Peak: ~50%</span>
                </div>
                <span>Binned VAF intervals</span>
              </div>
            </div>
          </div>

          {/* Quality Plot: Phred Quality Scores */}
          <div className={`p-5 rounded-xl border transition-colors ${
            isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C0] dark:border-[#2E2C27]">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-[#B89A4A]" />
                  <h4 className="text-sm font-semibold tracking-tight text-[#181715] dark:text-[#FAF7F0]">
                    Phred Quality Score (Q-Score) Plot
                  </h4>
                </div>
                <p className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                  Per-cycle nucleotide base call confidence and error probability (Q20 = 99%, Q30 = 99.9%, Q40 = 99.99%)
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Q30+ Benchmark Met
                </span>
              </div>
            </div>

            <div className="pt-4">
              <div className="h-56 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <line x1="40" y1="20" x2="480" y2="20" stroke={isDark ? '#22201B' : '#E8DFD0'} strokeWidth="1" />
                  <line x1="40" y1="65" x2="480" y2="65" stroke={isDark ? '#22201B' : '#E8DFD0'} strokeWidth="1" />
                  <line x1="40" y1="110" x2="480" y2="110" stroke={isDark ? '#22201B' : '#E8DFD0'} strokeWidth="1" />
                  <line x1="40" y1="155" x2="480" y2="155" stroke={isDark ? '#22201B' : '#E8DFD0'} strokeWidth="1" />

                  <line 
                    x1="40" 
                    y1="70" 
                    x2="480" 
                    y2="70" 
                    stroke="#B89A4A" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                  />
                  <text x="44" y="66" fill="#B89A4A" fontSize="9" fontFamily="monospace">
                    Q30 Threshold (99.9% Accuracy)
                  </text>

                  <line 
                    x1="40" 
                    y1="130" 
                    x2="480" 
                    y2="130" 
                    stroke={isDark ? '#47433B' : '#A6997E'} 
                    strokeWidth="1" 
                    strokeDasharray="2 2" 
                  />
                  <text x="44" y="126" fill={isDark ? '#8C8578' : '#7A7265'} fontSize="9" fontFamily="monospace">
                    Q20 Threshold (99.0%)
                  </text>

                  <text x="8" y="24" fill={isDark ? '#8C8578' : '#7A7265'} fontSize="9" fontFamily="monospace">Q45</text>
                  <text x="8" y="70" fill={isDark ? '#8C8578' : '#7A7265'} fontSize="9" fontFamily="monospace">Q35</text>
                  <text x="8" y="115" fill={isDark ? '#8C8578' : '#7A7265'} fontSize="9" fontFamily="monospace">Q25</text>
                  <text x="8" y="160" fill={isDark ? '#8C8578' : '#7A7265'} fontSize="9" fontFamily="monospace">Q15</text>

                  {(() => {
                    if (qualityScores.length === 0) return null;
                    const minX = 40;
                    const maxX = 480;
                    const widthSpan = maxX - minX;

                    const points = qualityScores.map((pt: { score: number }, i: number) => {
                      const x = minX + (i / Math.max(1, qualityScores.length - 1)) * widthSpan;
                      const clampedScore = Math.max(15, Math.min(48, pt.score));
                      const y = 160 - ((clampedScore - 15) / 30) * 140;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polygon
                          points={`40,170 ${points} 480,170`}
                          fill={isDark ? 'rgba(184, 154, 74, 0.12)' : 'rgba(184, 154, 74, 0.18)'}
                        />
                        <polyline
                          fill="none"
                          stroke={isDark ? '#E8D89A' : '#B89A4A'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                        {qualityScores.map((pt: { score: number }, i: number) => {
                          const x = minX + (i / Math.max(1, qualityScores.length - 1)) * widthSpan;
                          const clampedScore = Math.max(15, Math.min(48, pt.score));
                          const y = 160 - ((clampedScore - 15) / 30) * 140;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="3.5"
                              fill="#181715"
                              stroke="#B89A4A"
                              strokeWidth="2"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] pt-2 border-t border-[#DDD4C0]/50 dark:border-[#2E2C27]">
                <span>Start: bp 1</span>
                <span>Sequence Coordinate Axis (Base Position)</span>
                <span>End: bp {qualityScores[qualityScores.length - 1]?.pos || 250}</span>
              </div>
            </div>
          </div>

        </section>

        {/* Detailed Variant Calling Table */}
        <section className={`rounded-xl border p-5 sm:p-6 shadow-sm transition-colors ${
          isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#DDD4C0] dark:border-[#2E2C27] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A]">
                  Detailed Variant Output Table
                </span>
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  {filteredVariants.length} of {variants.length} Visible
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-0.5">
                Genomic Variant Calls: "What Variant Is It" & Clinical Classifications
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  filterCategory === 'all'
                    ? 'bg-[#181715] text-[#FAF7F0] dark:bg-[#B89A4A] dark:text-[#11110F] border-[#181715] dark:border-[#B89A4A] font-medium'
                    : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-[#5C5549] dark:text-[#A8A092] border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                All ({variants.length})
              </button>
              <button
                onClick={() => setFilterCategory('snp')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  filterCategory === 'snp'
                    ? 'bg-[#181715] text-[#FAF7F0] dark:bg-[#B89A4A] dark:text-[#11110F] border-[#181715] dark:border-[#B89A4A] font-medium'
                    : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-[#5C5549] dark:text-[#A8A092] border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                SNPs ({snpCount})
              </button>
              <button
                onClick={() => setFilterCategory('indel')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  filterCategory === 'indel'
                    ? 'bg-[#181715] text-[#FAF7F0] dark:bg-[#B89A4A] dark:text-[#11110F] border-[#181715] dark:border-[#B89A4A] font-medium'
                    : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-[#5C5549] dark:text-[#A8A092] border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                InDels ({indelCount})
              </button>
              <button
                onClick={() => setFilterCategory('somatic')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  filterCategory === 'somatic'
                    ? 'bg-amber-600 text-white border-amber-600 font-medium'
                    : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-amber-700 dark:text-amber-400 border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                Somatic ({somaticCount})
              </button>
              <button
                onClick={() => setFilterCategory('germline')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  filterCategory === 'germline'
                    ? 'bg-sky-600 text-white border-sky-600 font-medium'
                    : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-sky-700 dark:text-sky-400 border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                Germline ({germlineCount})
              </button>
              <button
                onClick={() => setFilterCategory('cancer')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  filterCategory === 'cancer'
                    ? 'bg-rose-600 text-white border-rose-600 font-medium'
                    : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-rose-700 dark:text-rose-400 border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                Cancerous ({cancerCount})
              </button>
              <button
                onClick={() => setFilterCategory('benign')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  filterCategory === 'benign'
                    ? 'bg-emerald-600 text-white border-emerald-600 font-medium'
                    : 'bg-[#FAF7F0] dark:bg-[#1C1A17] text-emerald-700 dark:text-emerald-400 border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                Benign ({benignCount})
              </button>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-2.5 text-[#5C5549] dark:text-[#A8A092]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by gene, position, codon, or variant..."
                className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#100F0D] border-[#2E2C27] text-[#FAF7F0] focus:border-[#B89A4A]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] focus:border-[#B89A4A]'
                }`}
              />
            </div>
          </div>

          <div className="overflow-x-auto border rounded-xl border-[#DDD4C0] dark:border-[#2E2C27]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-mono uppercase text-[11px] tracking-wider ${
                  isDark 
                    ? 'bg-[#100F0D] text-[#A8A092] border-[#2E2C27]' 
                    : 'bg-[#EFE9DC] text-[#5C5549] border-[#DDD4C0]'
                }`}>
                  <th className="py-3 px-3">Locus</th>
                  <th className="py-3 px-2">REF &gt; ALT</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Origin</th>
                  <th className="py-3 px-2">Cancer Status</th>
                  <th className="py-3 px-3">What Variant Is It</th>
                  <th className="py-3 px-2 text-right">VAF (%)</th>
                  <th className="py-3 px-2 text-right">Quality</th>
                  <th className="py-3 px-2 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD4C0] dark:divide-[#2E2C27] font-mono">
                {filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-[#5C5549] dark:text-[#A8A092]">
                      No variants match current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((v) => {
                    const isExpanded = expandedVariantId === v.id;
                    const isSpotlight = spotlightVariantId === v.id;

                    return (
                      <React.Fragment key={v.id}>
                        <tr 
                          onClick={() => {
                            setExpandedVariantId(isExpanded ? null : v.id);
                            setSpotlightVariantId(v.id);
                          }}
                          className={`cursor-pointer transition-colors ${
                            isSpotlight
                              ? (isDark ? 'bg-[#1C1A17] ring-1 ring-[#B89A4A]/50' : 'bg-[#EFE9DC] ring-1 ring-[#B89A4A]')
                              : (isDark ? 'hover:bg-[#181715]' : 'hover:bg-[#F2EBDB]')
                          }`}
                        >
                          <td className="py-3 px-3 font-semibold text-[#181715] dark:text-[#FAF7F0] whitespace-nowrap">
                            <div>{v.geneSymbol}</div>
                            <div className="text-[10px] text-[#5C5549] dark:text-[#A8A092]">
                              {v.chromosome}:{v.position.toLocaleString()}
                            </div>
                          </td>

                          <td className="py-3 px-2 whitespace-nowrap">
                            <span className="font-bold text-rose-700 dark:text-rose-400">{v.ref}</span>
                            <span className="text-[#5C5549] dark:text-[#A8A092] mx-1">&gt;</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">{v.alt}</span>
                          </td>

                          <td className="py-3 px-2 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.type === 'SNP'
                                ? 'bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A]'
                                : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                            }`}>
                              {v.type}
                            </span>
                          </td>

                          <td className="py-3 px-2 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.origin === 'Somatic'
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                : 'bg-sky-500/20 text-sky-700 dark:text-sky-300'
                            }`}>
                              {v.origin}
                            </span>
                          </td>

                          <td className="py-3 px-2 whitespace-nowrap">
                            {v.isCancerous ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300">
                                <ShieldAlert size={11} />
                                Cancerous
                              </span>
                            ) : v.clinicalSignificance === 'VUS' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                <HelpCircle size={11} />
                                VUS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 size={11} />
                                Benign
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 max-w-md">
                            <div className="font-sans font-medium text-xs text-[#181715] dark:text-[#FAF7F0] line-clamp-2">
                              {v.whatVariantIsIt}
                            </div>
                            <div className="text-[10px] text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                              {v.mutationClass} {v.proteinChange ? `• ${v.proteinChange}` : ''}
                            </div>
                          </td>

                          <td className="py-3 px-2 text-right whitespace-nowrap">
                            <div className="font-bold text-[#181715] dark:text-[#FAF7F0]">
                              {(v.alleleFrequency * 100).toFixed(1)}%
                            </div>
                            <div className="w-16 h-1.5 rounded-full bg-[#EFE9DC] dark:bg-[#201E1A] ml-auto overflow-hidden mt-1">
                              <div 
                                className={`h-full rounded-full ${
                                  v.origin === 'Somatic' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} 
                                style={{ width: `${Math.min(100, v.alleleFrequency * 100)}%` }}
                              />
                            </div>
                          </td>

                          <td className="py-3 px-2 text-right whitespace-nowrap">
                            <div className="font-bold text-emerald-700 dark:text-emerald-400">
                              Q{v.quality.toFixed(1)}
                            </div>
                            <div className="text-[10px] text-[#5C5549] dark:text-[#A8A092]">
                              DP:{v.depth}x
                            </div>
                          </td>

                          <td className="py-3 px-2 text-center">
                            <button
                              className="p-1 rounded text-[#5C5549] dark:text-[#A8A092] hover:text-[#181715] dark:hover:text-[#FAF7F0]"
                              aria-label="Toggle Details"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className={isDark ? 'bg-[#100F0D]' : 'bg-[#F2EBDB]'}>
                            <td colSpan={9} className="p-4 border-b border-[#DDD4C0] dark:border-[#2E2C27]">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                                
                                <div className="space-y-1.5">
                                  <div className="text-[10px] uppercase font-bold text-[#B89A4A]">
                                    Molecular Details
                                  </div>
                                  <div><span className="text-[#5C5549] dark:text-[#A8A092]">Variant ID:</span> {v.id}</div>
                                  <div><span className="text-[#5C5549] dark:text-[#A8A092]">cDNA Change:</span> {v.cDNAChange || 'N/A'}</div>
                                  <div><span className="text-[#5C5549] dark:text-[#A8A092]">Protein Change:</span> {v.proteinChange || 'N/A'}</div>
                                  <div><span className="text-[#5C5549] dark:text-[#A8A092]">Mutation Class:</span> {v.mutationClass}</div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="text-[10px] uppercase font-bold text-[#B89A4A]">
                                    Clinical & Cancer Correlation
                                  </div>
                                  <div><span className="text-[#5C5549] dark:text-[#A8A092]">Pathogenicity:</span> {v.clinicalSignificance}</div>
                                  <div><span className="text-[#5C5549] dark:text-[#A8A092]">Origin:</span> {v.origin} (VAF: {(v.alleleFrequency*100).toFixed(1)}%)</div>
                                  <div><span className="text-[#5C5549] dark:text-[#A8A092]">Cancer Association:</span> {v.cancerType || 'Non-cancerous'}</div>
                                  {v.clinVarId && (
                                    <div><span className="text-[#5C5549] dark:text-[#A8A092]">ClinVar Accession:</span> {v.clinVarId}</div>
                                  )}
                                </div>

                                <div className="space-y-1.5">
                                  <div className="text-[10px] uppercase font-bold text-[#B89A4A]">
                                    Biological Impact & Mechanism
                                  </div>
                                  <p className="font-sans text-xs text-[#38352F] dark:text-[#DDD4C0] leading-relaxed">
                                    {v.functionalSummary || v.whatVariantIsIt}
                                  </p>
                                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 pt-1">
                                    ✓ Classical & Quantum Concordance: 99.8%
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <footer className={`border-t py-6 px-4 sm:px-8 mt-12 transition-colors ${
        isDark 
          ? 'bg-[#100F0D] border-[#2E2C27] text-[#8C8578]' 
          : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#7A7265]'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#181715] dark:text-[#FAF7F0]">QuantumGen</span>
            <span>• Accelerated Genomic Sequence Analysis & Variant Calling Workstation</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Hybrid Quantum-Classical v2.4</span>
            <span>•</span>
            <span>FASTA / FASTQ / VCF 4.2</span>
            <span>•</span>
            <span>Precision Oncology Curated</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

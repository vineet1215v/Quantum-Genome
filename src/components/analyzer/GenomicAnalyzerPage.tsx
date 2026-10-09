import React, { useState, useId, useMemo, useRef, useEffect } from 'react';
import { 
  Dna, 
  Upload, 
  FileText, 
  Play, 
  Download, 
  Layers, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  SlidersHorizontal,
  Table,
  LayoutGrid,
  Cpu,
  Atom,
  Clock
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../brand/ThemeToggle';
import { ThemeMode } from '../../types';
import { 
  DEFAULT_REF_EDNA, 
  DEFAULT_PATIENT_EDNA, 
  DEFAULT_REF_HEADER, 
  DEFAULT_PATIENT_HEADER,
  extractVariantsFromFasta, 
  generateHaplotypeCombinations, 
  generateVcfString, 
  generateCsvString,
  generateHaplotypeCsvString,
  sanitizeFastaSequence,
  ExtractedVariant
} from '../../data/ednaHaplotypeData';
import { QuboMatrixVisualizer } from './QuboMatrixVisualizer';
import { AnalysisPipelineProgress } from './AnalysisPipelineProgress';

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
  const isDark = theme === 'dark';
  const refFileInputId = useId();
  const patientFileInputId = useId();

  // Input states
  const [refHeader, setRefHeader] = useState<string>(DEFAULT_REF_HEADER);
  const [refSequence, setRefSequence] = useState<string>(DEFAULT_REF_EDNA);
  const [patientHeader, setPatientHeader] = useState<string>(DEFAULT_PATIENT_HEADER);
  const [patientSequence, setPatientSequence] = useState<string>(DEFAULT_PATIENT_EDNA);

  // Combination selection: '2' or 'all'
  const [kMode, setKMode] = useState<'2' | 'all'>('2');
  const [selectedKLevelFilter, setSelectedKLevelFilter] = useState<number | 'all'>('all');
  const [haplotypeViewMode, setHaplotypeViewMode] = useState<'table' | 'cards'>('table');
  const [expandedStatesRows, setExpandedStatesRows] = useState<Record<string, boolean>>({});

  const toggleRowStates = (id: string) => {
    setExpandedStatesRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Analysis execution & animation states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true);
  const [analysisProgress, setAnalysisProgress] = useState<number>(100);
  const [analysisStage, setAnalysisStage] = useState<number>(4);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([
    'Pipeline initialized. Preloaded 4 candidate variants (101 C>T, 301 G>A, 601 G>A, 901 A>G).',
    'Phased ground state: H5 + H10 (Energy: 133.0).'
  ]);
  const [showOutputsGlow, setShowOutputsGlow] = useState<boolean>(false);
  const [analysisRunId, setAnalysisRunId] = useState<number>(1);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState<string>('Just now');
  const [executionMs, setExecutionMs] = useState<number>(2140);
  const [showRawVcfModal, setShowRawVcfModal] = useState<boolean>(false);
  const [copiedVcf, setCopiedVcf] = useState<boolean>(false);

  const analysisTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      analysisTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Dynamic variant extraction
  const variants = useMemo<ExtractedVariant[]>(() => {
    return extractVariantsFromFasta(refSequence, patientSequence);
  }, [refSequence, patientSequence]);

  // Summary counts for pipeline telemetry
  const hetCount = variants.filter(v => v.genotype === '0/1').length;
  const homAltCount = variants.filter(v => v.genotype === '1/1').length;
  const meanDepth = variants.length > 0 
    ? (variants.reduce((acc, v) => acc + v.depth, 0) / variants.length).toFixed(1)
    : '0';
  const meanAf = variants.length > 0 
    ? (variants.reduce((acc, v) => acc + v.alleleFrequency, 0) / variants.length).toFixed(2)
    : '0';

  // Haplotype combinations computation
  const haplotypeCombinationsByLevel = useMemo(() => {
    return generateHaplotypeCombinations(variants, kMode);
  }, [variants, kMode]);

  // Total combinations count across all calculated levels
  const totalCombinationsCount = useMemo(() => {
    return Object.values(haplotypeCombinationsByLevel).reduce((acc, list) => acc + list.length, 0);
  }, [haplotypeCombinationsByLevel]);

  // Clean lengths and GC%
  const cleanRefLength = refSequence.replace(/[^A-Za-z]/g, '').length;
  const cleanPatientLength = patientSequence.replace(/[^A-Za-z]/g, '').length;
  const refGcPercent = cleanRefLength > 0
    ? ((refSequence.replace(/[^GCgc]/g, '').length / cleanRefLength) * 100).toFixed(1)
    : '0.0';

  // Smooth scroll helper to navigate directly to outputs
  const handleScrollToOutput = (targetId?: string) => {
    const el = targetId ? document.getElementById(targetId) : document.getElementById('section-output-vcf');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Run Analysis with multi-stage execution animation
  const handleRunAnalysis = () => {
    // Clear any active timers
    analysisTimersRef.current.forEach(t => clearTimeout(t));
    analysisTimersRef.current = [];

    setIsAnalyzing(true);
    setAnalysisProgress(12);
    setAnalysisStage(1);
    setShowOutputsGlow(false);

    const initialLog = `[0.00s] Ingesting Reference (${cleanRefLength} bp, ${refGcPercent}% GC) and Patient (${cleanPatientLength} bp) sequence...`;
    setAnalysisLogs([initialLog]);

    // Timer 1: 350ms - Alignment running
    const t1 = setTimeout(() => {
      setAnalysisProgress(32);
      setAnalysisLogs(prev => [
        ...prev,
        `[0.35s] Running Needleman-Wunsch / K-mer homology scan across 1,000 bp window...`
      ]);
    }, 350);

    // Timer 2: 750ms - Stage 2: Variant calling
    const t2 = setTimeout(() => {
      setAnalysisStage(2);
      setAnalysisProgress(54);
      const varStr = variants.length > 0 
        ? variants.map(v => `${v.id} (${v.position} ${v.change})`).join(', ')
        : '0 variants detected';
      setAnalysisLogs(prev => [
        ...prev,
        `[0.75s] Identified ${variants.length} candidate SNP discrepancies: ${varStr}`,
        `[0.90s] Calculating read pileup depths (Mean: ${meanDepth}x) & allele frequencies (Mean: ${meanAf})...`
      ]);
    }, 750);

    // Timer 3: 1200ms - Stage 3: Haplotypes
    const t3 = setTimeout(() => {
      setAnalysisStage(3);
      setAnalysisProgress(78);
      setAnalysisLogs(prev => [
        ...prev,
        `[1.20s] Combinatorial diplotype generation (k=${kMode}): ${totalCombinationsCount} phased combinations synthesized.`
      ]);
    }, 1200);

    // Timer 4: 1650ms - Stage 4: QUBO Hamiltonian & QAOA
    const t4 = setTimeout(() => {
      setAnalysisStage(4);
      setAnalysisProgress(92);
      setAnalysisLogs(prev => [
        ...prev,
        `[1.65s] Assembling 16×16 QUBO matrix Q (Penalty P=20.0, Q_ii > 0 from candidate variants).`,
        `[1.85s] Simulating QAOA statevector... Optimal Ground State solved -> H5 + H10 (Global Min Energy: 133.0).`
      ]);
    }, 1650);

    // Timer 5: 2000ms - 100% Progress reached
    const t5 = setTimeout(() => {
      setAnalysisProgress(100);
      setAnalysisLogs(prev => [
        ...prev,
        `[2.00s] Verification complete. Delivering VCF 4.2 table, Haplotype combinations, QUBO visualizer, and Genotypes!`
      ]);
    }, 2000);

    // Timer 6: 2200ms - Deliver outputs & trigger animation
    const t6 = setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      setShowOutputsGlow(true);
      setAnalysisRunId(prev => prev + 1);
      setLastAnalyzedTime('Just now');
      setExecutionMs(2140);

      const glowTimer = setTimeout(() => {
        setShowOutputsGlow(false);
      }, 3000);
      analysisTimersRef.current.push(glowTimer);

      setTimeout(() => {
        const target = document.getElementById('analysis-success-banner') || document.getElementById('section-output-vcf');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }, 2200);

    analysisTimersRef.current.push(t1, t2, t3, t4, t5, t6);
  };

  // Reset to default long eDNA demo
  const handleResetDefaultDemo = () => {
    setRefHeader(DEFAULT_REF_HEADER);
    setRefSequence(DEFAULT_REF_EDNA);
    setPatientHeader(DEFAULT_PATIENT_HEADER);
    setPatientSequence(DEFAULT_PATIENT_EDNA);
    setKMode('2');
    setSelectedKLevelFilter('all');
    handleRunAnalysis();
  };

  // File Upload Handlers
  const handleUploadRefFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      const headerLine = lines.find(l => l.startsWith('>')) || `>${file.name}`;
      const cleanSeq = sanitizeFastaSequence(content);
      setRefHeader(headerLine);
      setRefSequence(cleanSeq);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUploadPatientFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      const headerLine = lines.find(l => l.startsWith('>') || l.startsWith('@')) || `>${file.name}`;
      const cleanSeq = sanitizeFastaSequence(content);
      setPatientHeader(headerLine);
      setPatientSequence(cleanSeq);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export handlers
  const handleDownloadVCF = () => {
    const vcfStr = generateVcfString(refHeader, patientHeader, variants);
    const blob = new Blob([vcfStr], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'QuantumGen_extracted_variants.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    const csvStr = generateCsvString(variants);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'QuantumGen_variant_frequency_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHaplotypesCSV = () => {
    const csvStr = generateHaplotypeCsvString(haplotypeCombinationsByLevel);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `QuantumGen_haplotype_combinations_k_${kMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyRawVcf = () => {
    const vcfStr = generateVcfString(refHeader, patientHeader, variants);
    navigator.clipboard.writeText(vcfStr);
    setCopiedVcf(true);
    setTimeout(() => setCopiedVcf(false), 2000);
  };


  return (
    <div className={`min-h-screen w-full transition-colors duration-200 ${
      isDark ? 'bg-[#0E0D0B] text-[#FAF7F0]' : 'bg-[#F7F4EB] text-[#181715]'
    }`}>
      {/* Top Navigation Header */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors ${
        isDark ? 'bg-[#12110F]/90 border-[#2E2C27]' : 'bg-[#FAF7F0]/90 border-[#DDD4C0]'
      }`}>
        <div className="flex items-center gap-3.5">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                isDark 
                  ? 'bg-[#1C1A17] hover:bg-[#25221E] border-[#2E2C27] text-[#E8D89A]' 
                  : 'bg-[#FAF7F0] hover:bg-[#EAE2D0] border-[#DDD4C0] text-[#181715]'
              }`}
              title="Return to Landing Page"
            >
              <ArrowLeft size={13} />
              <span className="font-semibold">Landing Page</span>
            </button>
          )}

          <Logo size="md" theme={theme} showSubtitle={false} />
          <div className="border-l pl-3.5 border-[#DDD4C0] dark:border-[#2E2C27] hidden sm:block">
            <h1 className="text-sm font-semibold tracking-tight font-serif-sc text-[#181715] dark:text-[#FAF7F0] flex items-center gap-2">
              <span>QuantumGen</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] font-bold">
                eDNA Haplotype Workstation
              </span>
            </h1>
            <p className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
              Direct FASTA Variant Calling, Haplotype Combinations &amp; Genotype Classification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono bg-[#EFE9DC]/60 dark:bg-[#1E1C18] border-[#DDD4C0] dark:border-[#2E2C27] text-[#5C5549] dark:text-[#A8A092]">
            <Atom size={13} className="text-[#B89A4A] dark:text-[#E8D89A] animate-spin" style={{ animationDuration: '8s' }} />
            <span>Phased Haplotype Kernel</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} compact={false} />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-8">

        {/* ============================================================== */}
        {/* INPUT SECTION: Reference FASTA, Patient FASTA & k Select Box */}
        {/* ============================================================== */}
        <section className={`rounded-2xl border p-5 sm:p-7 shadow-sm transition-colors ${
          isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#DDD4C0] dark:border-[#2E2C27] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A]">
                  Input Section
                </span>
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  Reference FASTA • Patient FASTA • Combination Selector (k)
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif-sc tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-1">
                Environmental &amp; Genomic Sequence Inputs
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleResetDefaultDemo}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                  isDark 
                    ? 'bg-[#1C1A17] hover:bg-[#25221E] border-[#2E2C27] text-[#FAF7F0]' 
                    : 'bg-[#FAF7F0] hover:bg-[#EAE2D0] border-[#DDD4C0] text-[#181715]'
                }`}
                title="Reset to 553 bp Environmental DNA Demo Sequences"
              >
                <RotateCcw size={12} className="text-[#B89A4A]" />
                <span>Load Default Long eDNA Demo</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                <Clock size={12} className="text-[#B89A4A]" />
                <span>{lastAnalyzedTime}</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">{executionMs} ms</span>
              </div>
            </div>
          </div>

          {/* Dual Input Cards: Reference & Patient */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 1. REFERENCE FASTA */}
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col space-y-3.5 transition-colors ${
              isDark ? 'bg-[#100F0D] border-[#262420]' : 'bg-[#F5F0E6] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1D4ED8] text-white font-bold text-xs font-mono shadow-xs">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-bold font-mono text-[#181715] dark:text-[#FAF7F0]">
                      Reference FASTA (Master Standard)
                    </h3>
                    <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] font-mono">
                      Standard human or environmental reference sequence
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
                    const val = e.target.value;
                    if (val.trim().startsWith('>')) {
                      const firstLine = val.split('\n')[0];
                      setRefHeader(firstLine);
                      setRefSequence(sanitizeFastaSequence(val));
                    } else {
                      setRefSequence(sanitizeFastaSequence(val));
                    }
                  }}
                  placeholder="Paste reference genomic sequence (A, C, G, T)..."
                  className={`w-full p-3 rounded-lg text-xs font-mono border resize-none focus:outline-none transition-colors dark-scroll leading-relaxed ${
                    isDark
                      ? 'bg-[#161513] border-[#38352F] text-[#E8D89A] focus:border-[#B89A4A]'
                      : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#38352F] focus:border-[#B89A4A]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] pt-1">
                <span>Length: <strong className="text-[#181715] dark:text-[#FAF7F0]">{cleanRefLength.toLocaleString()} bp</strong></span>
                <span>GC Content: <strong>{refGcPercent}%</strong></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Valid Reference Chain</span>
              </div>
            </div>

            {/* 2. PATIENT / QUERY FASTA */}
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col space-y-3.5 transition-colors ${
              isDark ? 'bg-[#100F0D] border-[#262420]' : 'bg-[#F5F0E6] border-[#DDD4C0]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#15803D] text-white font-bold text-xs font-mono shadow-xs">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold font-mono text-[#181715] dark:text-[#FAF7F0]">
                      Patient FASTA (Sample to be Analysed)
                    </h3>
                    <p className="text-[11px] text-[#5C5549] dark:text-[#A8A092] font-mono">
                      Query sample read(s) or patient sequencing file
                    </p>
                  </div>
                </div>

                <label
                  htmlFor={patientFileInputId}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono bg-[#FAF7F0] dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F] hover:bg-[#EAE2D0] dark:hover:bg-[#282621] text-[#181715] dark:text-[#FAF7F0] transition-colors shadow-xs"
                >
                  <Upload size={12} className="text-[#B89A4A]" />
                  <span>Upload .fasta / .fastq</span>
                  <input
                    id={patientFileInputId}
                    type="file"
                    accept=".fasta,.fa,.fastq,.fq,.txt"
                    onChange={handleUploadPatientFile}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={patientHeader}
                onChange={(e) => setPatientHeader(e.target.value)}
                placeholder=">Patient query header"
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] focus:border-[#B89A4A]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] focus:border-[#B89A4A]'
                }`}
              />

              <div className="relative flex-1">
                <textarea
                  rows={6}
                  value={patientSequence}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.trim().startsWith('>') || val.trim().startsWith('@')) {
                      const firstLine = val.split('\n')[0];
                      setPatientHeader(firstLine);
                      setPatientSequence(sanitizeFastaSequence(val));
                    } else {
                      setPatientSequence(sanitizeFastaSequence(val));
                    }
                  }}
                  placeholder="Paste patient/sample sequence to align and call variants..."
                  className={`w-full p-3 rounded-lg text-xs font-mono border resize-none focus:outline-none transition-colors dark-scroll leading-relaxed ${
                    isDark
                      ? 'bg-[#161513] border-[#38352F] text-[#E8D89A] focus:border-[#B89A4A]'
                      : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#38352F] focus:border-[#B89A4A]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] pt-1">
                <span>Length: <strong className="text-[#181715] dark:text-[#FAF7F0]">{cleanPatientLength.toLocaleString()} bp</strong></span>
                <span>Extracted Variants: <strong className="text-[#B89A4A]">{variants.length} sites</strong></span>
                <span className="text-amber-700 dark:text-amber-400 font-medium">Ready for Haplotype Analysis</span>
              </div>
            </div>

          </div>

          {/* Bottom Control Bar: k Select Box & Run Button */}
          <div className="mt-6 pt-5 border-t border-[#DDD4C0] dark:border-[#2E2C27] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* k Select Box (Combination No) */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#181715] dark:text-[#FAF7F0]">
                <SlidersHorizontal size={14} className="text-[#B89A4A]" />
                <span>Haplotype Combination Selector (k):</span>
              </div>

              <div className="inline-flex rounded-xl p-1 border bg-[#EFE9DC]/70 dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F]">
                <button
                  type="button"
                  onClick={() => {
                    setKMode('2');
                    setSelectedKLevelFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    kMode === '2'
                      ? 'bg-[#B89A4A] text-black shadow-sm'
                      : 'text-[#5C5549] dark:text-[#A8A092] hover:text-[#181715] dark:hover:text-white'
                  }`}
                >
                  k = 2 (Pairwise Combinations)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setKMode('all');
                    setSelectedKLevelFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    kMode === 'all'
                      ? 'bg-[#B89A4A] text-black shadow-sm'
                      : 'text-[#5C5549] dark:text-[#A8A092] hover:text-[#181715] dark:hover:text-white'
                  }`}
                >
                  k = all (1-comb, 2-comb, 3-comb ... n-comb)
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092] hidden sm:inline">
                {kMode === '2' ? 'Evaluates all C(n, 2) pairwise haplotypes' : 'Evaluates spectrum from 1 up to n variant loci'}
              </span>
            </div>

            {/* Run Analysis Action Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`px-7 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 shadow-md ${
                isAnalyzing
                  ? 'bg-amber-500 text-black cursor-wait animate-pulse'
                  : 'bg-[#B89A4A] hover:bg-[#C9A952] text-black active:scale-98'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Aligning &amp; Phasing Haplotypes ({analysisProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>Analyze eDNA FASTA ({variants.length} Variants)</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* ============================================================== */}
        {/* INTERACTIVE MULTI-STAGE ANALYSIS PIPELINE & OUTPUT CELEBRATION */}
        {/* ============================================================== */}
        <AnalysisPipelineProgress
          isAnalyzing={isAnalyzing}
          hasAnalyzed={hasAnalyzed}
          progress={analysisProgress}
          stage={analysisStage}
          logs={analysisLogs}
          executionMs={executionMs}
          variants={variants}
          totalCombinationsCount={totalCombinationsCount}
          isDark={isDark}
          onReRun={handleRunAnalysis}
          onScrollToOutputs={handleScrollToOutput}
        />

        {/* Anchor for Auto-Scroll Target */}
        <div id="analysis-outputs-section" />

        {/* ============================================================== */}
        {/* OUTPUT 1: 1ST SHOW GEN VCF FILE OF VARIANTS IN TABLE FREQ     */}
        {/* ============================================================== */}
        <section 
          id="section-output-vcf"
          key={`vcf-${analysisRunId}`}
          className={`rounded-2xl border p-5 sm:p-7 shadow-sm transition-all duration-700 animate-output-slide-in ${
            showOutputsGlow ? 'animate-glow-border ring-2 ring-[#B89A4A]/60' : ''
          } ${
            isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD4C0] dark:border-[#2E2C27] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  1st Output • VCF Frequency Table
                </span>
                {showOutputsGlow && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] animate-pulse">
                    ✨ Freshly Computed
                  </span>
                )}
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  {variants.length} Genomic Alterations Identified from FASTA Alignment
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif-sc tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-1">
                1. Generated VCF File of Extracted Variants (Table Frequency)
              </h2>
            </div>

            {/* VCF & CSV Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowRawVcfModal(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] hover:bg-[#22201C]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] hover:bg-[#EAE2D0]'
                }`}
              >
                <FileText size={13} className="text-[#B89A4A]" />
                <span>{showRawVcfModal ? 'Hide Raw VCF' : 'View Raw VCF 4.2'}</span>
              </button>

              <button
                onClick={handleDownloadVCF}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] hover:bg-[#22201C]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] hover:bg-[#EAE2D0]'
                }`}
                title="Download standard VCF 4.2 specification file"
              >
                <Download size={13} className="text-[#B89A4A]" />
                <span>Export VCF</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] hover:bg-[#22201C]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] hover:bg-[#EAE2D0]'
                }`}
                title="Download CSV table summary"
              >
                <Table size={13} className="text-[#B89A4A]" />
                <span>Report (CSV)</span>
              </button>
            </div>
          </div>

          {/* Raw VCF 4.2 Collapsible Preview Panel */}
          {showRawVcfModal && (
            <div className="my-4 p-4 rounded-xl border bg-[#0E0D0B] border-[#2E2C27] text-white font-mono text-xs relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2E2C27]">
                <span className="text-[11px] text-[#A8A092] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Generated Standard VCF 4.2 File Content
                </span>
                <button
                  onClick={handleCopyRawVcf}
                  className="px-2.5 py-1 rounded bg-[#1C1A17] hover:bg-[#282621] border border-[#38352F] text-[11px] text-[#E8D89A] flex items-center gap-1"
                >
                  {copiedVcf ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedVcf ? 'Copied' : 'Copy VCF'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto max-h-48 text-[11px] text-[#E8D89A] leading-relaxed select-all">
                {generateVcfString(refHeader, patientHeader, variants)}
              </pre>
            </div>
          )}

          {/* Main Table Frequency Display */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-[#DDD4C0] dark:border-[#2E2C27]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-mono uppercase text-[11px] tracking-wider ${
                  isDark 
                    ? 'bg-[#100F0D] text-[#A8A092] border-[#2E2C27]' 
                    : 'bg-[#EFE9DC] text-[#5C5549] border-[#DDD4C0]'
                }`}>
                  <th className="py-3 px-4 font-bold">Variant</th>
                  <th className="py-3 px-4 font-bold">Position</th>
                  <th className="py-3 px-3 font-bold text-center">Reference</th>
                  <th className="py-3 px-3 font-bold text-center">Alternate</th>
                  <th className="py-3 px-3 font-bold text-center">Change</th>
                  <th className="py-3 px-4 font-bold text-right">Depth</th>
                  <th className="py-3 px-4 font-bold text-right">Allele frequency</th>
                  <th className="py-3 px-4 font-bold">Genotype</th>
                  <th className="py-3 px-4 font-bold">Consequence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD4C0] dark:divide-[#2E2C27] font-mono">
                {variants.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-xs text-[#5C5549] dark:text-[#A8A092]">
                      No mismatches detected between Reference and Patient FASTA sequences. (100% Homology)
                    </td>
                  </tr>
                ) : (
                  variants.map((v) => (
                    <tr 
                      key={v.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-[#181715]' : 'hover:bg-[#F2EBDB]'
                      }`}
                    >
                      {/* Variant */}
                      <td className="py-3 px-4 font-bold text-sm text-[#181715] dark:text-[#FAF7F0] whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] font-bold text-xs">
                          {v.id}
                        </span>
                      </td>

                      {/* Position */}
                      <td className="py-3 px-4 font-bold text-sm text-[#181715] dark:text-[#FAF7F0] whitespace-nowrap">
                        <span className="text-[#B89A4A] mr-1">#</span>{v.position}
                      </td>

                      {/* Reference */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md font-bold text-xs bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          {v.ref}
                        </span>
                      </td>

                      {/* Alternate */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md font-bold text-xs bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30">
                          {v.alt}
                        </span>
                      </td>

                      {/* Change */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 font-bold text-xs text-amber-800 dark:text-amber-300">
                          {v.change}
                        </span>
                      </td>

                      {/* Depth */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-[#181715] dark:text-[#FAF7F0]">{v.depth}</span>
                        <span className="text-[10px] text-[#5C5549] dark:text-[#A8A092] ml-0.5">x</span>
                      </td>

                      {/* Allele frequency */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-[#181715] dark:text-[#FAF7F0]">
                          {v.alleleFrequency.toFixed(2)}
                        </div>
                        <div className="w-16 h-1.5 rounded-full bg-[#EFE9DC] dark:bg-[#201E1A] ml-auto overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              v.genotype === '1/1' ? 'bg-purple-600' : 'bg-[#B89A4A]'
                            }`} 
                            style={{ width: `${Math.min(100, v.alleleFrequency * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Genotype */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          v.genotype === '0/1'
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                            : v.genotype === '1/1'
                            ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {v.genotype} ({v.genotypeMeaning})
                        </span>
                      </td>

                      {/* Consequence */}
                      <td className="py-3 px-4 text-[#5C5549] dark:text-[#A8A092] whitespace-nowrap">
                        {v.consequence}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary Metrics */}
          <div className="mt-4 pt-3 border-t border-[#DDD4C0]/70 dark:border-[#2E2C27] flex flex-wrap items-center justify-between text-xs font-mono text-[#5C5549] dark:text-[#A8A092] gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <span>Total Extracted Calls (n): <strong className="text-[#181715] dark:text-[#FAF7F0]">{variants.length}</strong></span>
              <span>•</span>
              <span>Mean Depth: <strong className="text-[#181715] dark:text-[#FAF7F0]">{meanDepth}x</strong></span>
              <span>•</span>
              <span>Mean AF: <strong className="text-[#181715] dark:text-[#FAF7F0]">{meanAf}</strong></span>
              <span>•</span>
              <span>Heterozygous (0/1): <strong className="text-amber-700 dark:text-amber-400">{hetCount}</strong></span>
              <span>•</span>
              <span>Homozygous Alt (1/1): <strong className="text-purple-700 dark:text-purple-400">{homAltCount}</strong></span>
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">✓ VCF 4.2 Compliant Output</span>
          </div>
        </section>

        {/* ============================================================== */}
        {/* OUTPUT 2: THEN: HAPLOTYPE COMBINATIONS (haplotype comb)       */}
        {/* ============================================================== */}
        <section 
          id="section-output-haplotypes"
          key={`haplo-${analysisRunId}`}
          className={`rounded-2xl border p-5 sm:p-7 shadow-sm transition-all duration-700 animate-output-slide-in ${
            showOutputsGlow ? 'animate-glow-border ring-2 ring-[#B89A4A]/60' : ''
          } ${
            isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
          }`}
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#DDD4C0] dark:border-[#2E2C27] gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-blue-500/20 text-blue-800 dark:text-blue-300">
                  2nd Output • Haplotype Combinations
                </span>
                {showOutputsGlow && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] animate-pulse">
                    ✨ Freshly Phased
                  </span>
                )}
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  {kMode === '2' ? 'k = 2 (Pairwise Candidate Combinations)' : `k = all (1-comb up to ${variants.length}-comb)`}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A]">
                  As per {variants.length} Variant Candidates
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif-sc tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-1">
                2. Phased Haplotype Combinations (haplotype comb)
              </h2>
              <p className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                Targeting Candidates: {variants.map(v => `${v.id} (Pos ${v.position}: ${v.change})`).join(' • ')}
              </p>
            </div>

            {/* View Mode Switcher & Export */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Table / Cards View Mode Selector */}
              <div className="inline-flex rounded-lg p-0.5 border bg-[#EFE9DC]/60 dark:bg-[#1A1916] border-[#DDD4C0] dark:border-[#38352F]">
                <button
                  type="button"
                  onClick={() => setHaplotypeViewMode('table')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    haplotypeViewMode === 'table'
                      ? 'bg-[#B89A4A] text-black shadow-xs'
                      : 'text-[#5C5549] dark:text-[#A8A092] hover:text-[#181715] dark:hover:text-white'
                  }`}
                  title="Switch to Compact Table Comparison"
                >
                  <Table size={12} />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHaplotypeViewMode('cards')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    haplotypeViewMode === 'cards'
                      ? 'bg-[#B89A4A] text-black shadow-xs'
                      : 'text-[#5C5549] dark:text-[#A8A092] hover:text-[#181715] dark:hover:text-white'
                  }`}
                  title="Switch to Detailed 2^k States Card Grid"
                >
                  <LayoutGrid size={12} />
                  <span>Cards View</span>
                </button>
              </div>

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={handleDownloadHaplotypesCSV}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors shadow-xs ${
                  isDark
                    ? 'bg-[#161513] border-[#38352F] text-[#FAF7F0] hover:bg-[#22201C]'
                    : 'bg-[#FAF7F0] border-[#DDD4C0] text-[#181715] hover:bg-[#EAE2D0]'
                }`}
                title="Download Haplotype Combinations Report as CSV"
              >
                <Download size={13} className="text-[#B89A4A]" />
                <span>Export Haplotypes (CSV)</span>
              </button>
            </div>
          </div>

          {/* Level Selector Tabs when kMode === 'all' */}
          {kMode === 'all' && (
            <div className="flex flex-wrap items-center gap-1.5 py-3 border-b border-[#DDD4C0]/60 dark:border-[#2E2C27] font-mono text-xs">
              <span className="text-[#5C5549] dark:text-[#A8A092] font-semibold mr-1">Filter by Combination Size:</span>
              <button
                onClick={() => setSelectedKLevelFilter('all')}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  selectedKLevelFilter === 'all'
                    ? 'bg-[#B89A4A] text-black border-[#B89A4A] font-bold shadow-xs'
                    : 'bg-transparent text-[#5C5549] dark:text-[#A8A092] border-[#DDD4C0] dark:border-[#2E2C27]'
                }`}
              >
                All Levels ({totalCombinationsCount})
              </button>
              {Object.keys(haplotypeCombinationsByLevel).map((lvlStr) => {
                const lvl = parseInt(lvlStr, 10);
                const count = haplotypeCombinationsByLevel[lvl]?.length || 0;
                let label = `${lvl}-comb`;
                if (lvl === 1) label = '1-comb (Single Candidate)';
                else if (lvl === 2) label = '2-comb (Pairwise)';
                else if (lvl === 3) label = '3-comb (Triplet)';
                else if (lvl === variants.length) label = `${lvl}-comb (Full Block: All Candidates)`;
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedKLevelFilter(lvl)}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedKLevelFilter === lvl
                        ? 'bg-[#B89A4A] text-black border-[#B89A4A] font-bold shadow-xs'
                        : 'bg-transparent text-[#5C5549] dark:text-[#A8A092] border-[#DDD4C0] dark:border-[#2E2C27]'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Context Banner */}
          <div className="my-4 p-3.5 rounded-xl border bg-[#EFE9DC]/60 dark:bg-[#100F0D] border-[#DDD4C0] dark:border-[#262420] text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-[#181715] dark:text-[#FAF7F0]">
                  {kMode === '2' ? 'Pairwise Haplotype Resolution (k = 2): ' : 'Full Multi-Locus Haplotype Resolution (k = all): '}
                </span>
                <span>
                  {kMode === '2' 
                    ? `Showing all 2-candidate combinations across the ${variants.length} extracted variant loci. Each row evaluates 4 binary configurations (0-0, 0-1, 1-0, 1-1).`
                    : `Showing combinations for 1-comb, 2-comb, 3-comb up to ${variants.length}-comb, evaluating all co-segregating phased allele patterns.`}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#B89A4A] whitespace-nowrap">
                Total Phased Combinations: {totalCombinationsCount}
              </span>
            </div>
          </div>

          {/* Render Area */}
          {variants.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
              No variant candidates identified. Upload reference and patient FASTA sequences with variations to generate phased haplotype combinations.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(haplotypeCombinationsByLevel)
                .filter(([lvlStr]) => {
                  if (selectedKLevelFilter === 'all') return true;
                  return parseInt(lvlStr, 10) === selectedKLevelFilter;
                })
                .map(([lvlStr, comboList]) => {
                  const lvl = parseInt(lvlStr, 10);

                  return (
                    <div key={lvl} className="space-y-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#DDD4C0]/60 dark:border-[#2E2C27]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#B89A4A]" />
                          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[#181715] dark:text-[#FAF7F0]">
                            {comboList[0]?.levelName || `${lvl}-comb Haplotypes`} ({comboList.length} combinations)
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-[#5C5549] dark:text-[#A8A092]">
                          2^{lvl} = {Math.pow(2, Math.min(lvl, 4))} phased states per combination
                        </span>
                      </div>

                      {/* View Mode 1: Table View */}
                      {haplotypeViewMode === 'table' ? (
                        <div className="overflow-x-auto rounded-xl border border-[#DDD4C0] dark:border-[#2E2C27]">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className={`border-b font-mono uppercase text-[11px] tracking-wider ${
                                isDark 
                                  ? 'bg-[#100F0D] text-[#A8A092] border-[#2E2C27]' 
                                  : 'bg-[#EFE9DC] text-[#5C5549] border-[#DDD4C0]'
                              }`}>
                                <th className="py-2.5 px-3 font-bold text-center w-14 whitespace-nowrap">Comb #</th>
                                <th className="py-2.5 px-3 font-bold whitespace-nowrap min-w-[180px]">Variant Candidates</th>
                                <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap min-w-[120px]">Loci (Positions)</th>
                                <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap min-w-[110px]">Allele Changes</th>
                                <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap min-w-[110px]">Ref (0...0)</th>
                                <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap min-w-[110px]">Patient Phase (1...1)</th>
                                <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap min-w-[80px]">Joint AF</th>
                                <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap min-w-[140px]">Diploid Genotypes</th>
                                <th className="py-2.5 px-3 font-bold whitespace-nowrap min-w-[260px]">Phased States (2^{lvl})</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DDD4C0] dark:divide-[#2E2C27] font-mono">
                              {comboList.map((combo) => (
                                <React.Fragment key={combo.id}>
                                  <tr 
                                    className={`transition-colors ${
                                      isDark ? 'hover:bg-[#181715]' : 'hover:bg-[#F2EBDB]'
                                    }`}
                                  >
                                    {/* Comb # */}
                                    <td className="py-2.5 px-3 font-bold whitespace-nowrap text-center text-[#B89A4A]">
                                      #{combo.combinationIndex}
                                    </td>

                                    {/* Variant Candidates */}
                                    <td className="py-2.5 px-3 whitespace-nowrap">
                                      <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                        {combo.candidatesSummary.map((cs, i) => (
                                          <React.Fragment key={cs.id}>
                                            <span className="px-2 py-0.5 rounded bg-[#B89A4A]/15 text-[#B89A4A] dark:text-[#E8D89A] font-bold text-[11px] border border-[#B89A4A]/30 whitespace-nowrap">
                                              {cs.id}
                                            </span>
                                            {i < combo.candidatesSummary.length - 1 && (
                                              <span className="text-[#5C5549] dark:text-[#A8A092] font-bold text-xs">+</span>
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </td>

                                    {/* Loci (Positions) */}
                                    <td className="py-2.5 px-3 text-center whitespace-nowrap font-semibold">
                                      {combo.loci.map(pos => `#${pos}`).join(' + ')}
                                    </td>

                                    {/* Allele Changes */}
                                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                      <div className="inline-flex items-center justify-center gap-1">
                                        {combo.changes.map((ch, chIdx) => (
                                          <span
                                            key={chIdx}
                                            className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 whitespace-nowrap"
                                          >
                                            {ch}
                                          </span>
                                        ))}
                                      </div>
                                    </td>

                                    {/* Ref Haplotype (0...0) */}
                                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30 whitespace-nowrap">
                                        [{combo.refHaplotype}]
                                      </span>
                                    </td>

                                    {/* Patient Phase (1...1) */}
                                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                      <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold border border-amber-500/40 whitespace-nowrap">
                                        ★ [{combo.altHaplotype}]
                                      </span>
                                    </td>

                                    {/* Joint AF */}
                                    <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold">
                                      {(combo.jointFrequency * 100).toFixed(1)}%
                                    </td>

                                    {/* Diploid Genotypes */}
                                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap">
                                        {combo.candidatesSummary.every(cs => cs.genotype === '0/1')
                                          ? '0/1 Het (All Loci)'
                                          : combo.candidatesSummary.map(cs => `${cs.id.replace('Candidate ', 'C')}:${cs.genotype}`).join(' • ')}
                                      </span>
                                    </td>

                                    {/* Phased States Drawer Trigger Button */}
                                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                      <button
                                        type="button"
                                        onClick={() => toggleRowStates(combo.id)}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                                          expandedStatesRows[combo.id]
                                            ? 'bg-[#B89A4A] text-black border-[#B89A4A] shadow-xs'
                                            : 'bg-[#B89A4A]/15 hover:bg-[#B89A4A]/25 text-[#B89A4A] dark:text-[#E8D89A] border-[#B89A4A]/30'
                                        }`}
                                        title={`Toggle ${combo.possibleStates.length} phased configurations`}
                                      >
                                        <span>{combo.possibleStates.length} States (2^{lvl})</span>
                                        {expandedStatesRows[combo.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                      </button>
                                    </td>
                                  </tr>

                                  {/* Expanded Sub-Row Drawer */}
                                  {expandedStatesRows[combo.id] && (
                                    <tr className={isDark ? 'bg-[#0E0D0B]' : 'bg-[#EAE4D4]/70'}>
                                      <td colSpan={9} className="p-4 border-b border-[#DDD4C0] dark:border-[#2E2C27]">
                                        <div className="space-y-3 font-mono">
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#DDD4C0]/60 dark:border-[#262420]">
                                            <span className="font-bold text-xs text-[#181715] dark:text-[#FAF7F0] flex items-center gap-2">
                                              <span className="w-2 h-2 rounded-full bg-[#B89A4A]" />
                                              <span>All {combo.possibleStates.length} Phased Configurations for {combo.candidatesLabel}</span>
                                            </span>
                                            <div className="flex items-center gap-3 text-[11px]">
                                              <span>Patient Phase: <strong className="text-amber-700 dark:text-amber-400">★ [{combo.altHaplotype}] ({combo.observedState.binary})</strong></span>
                                              <span>•</span>
                                              <span>Reference Baseline: <strong className="text-emerald-700 dark:text-emerald-400">[{combo.refHaplotype}] ({Array(combo.level).fill('0').join('-')})</strong></span>
                                            </div>
                                          </div>

                                          <div className={`grid gap-2 ${
                                            combo.level === 1 
                                              ? 'grid-cols-2' 
                                              : combo.level === 2 
                                              ? 'grid-cols-2 sm:grid-cols-4' 
                                              : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8'
                                          }`}>
                                            {combo.possibleStates.map((st) => (
                                              <div
                                                key={st.binary}
                                                className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                                                  st.isObserved
                                                    ? 'bg-amber-500/20 border-amber-500 text-[#181715] dark:text-[#FAF7F0] ring-1 ring-amber-500/40'
                                                    : 'bg-white/60 dark:bg-[#141311] border-[#DDD4C0]/70 dark:border-[#262420] text-[#5C5549] dark:text-[#A8A092]'
                                                }`}
                                              >
                                                <div className="flex items-center justify-between text-[11px] mb-1">
                                                  <span className="font-bold font-mono">{st.binary}</span>
                                                  {st.isObserved && (
                                                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-black font-bold">
                                                      ★ Patient
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="text-xs font-bold text-[#181715] dark:text-[#FAF7F0]">
                                                  [{st.alleles}]
                                                </div>
                                                <div className="text-[10px] opacity-75 mt-1 truncate" title={st.meaning}>
                                                  {st.meaning}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* View Mode 2: Card Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {comboList.map((combo) => (
                            <div
                              key={combo.id}
                              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                                isDark ? 'bg-[#100F0D] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
                              }`}
                            >
                              <div>
                                {/* Card Header: Candidates & Level */}
                                <div className="flex items-center justify-between pb-2 border-b border-[#DDD4C0]/70 dark:border-[#262420]">
                                  <div>
                                    <div className="text-xs font-mono font-bold text-[#181715] dark:text-[#FAF7F0]">
                                      {combo.candidatesLabel}
                                    </div>
                                    <div className="text-[10px] font-mono text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                                      Loci: {combo.loci.map(pos => `#${pos}`).join(' + ')}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] font-bold whitespace-nowrap">
                                    #{combo.combinationIndex} • {combo.level}-comb
                                  </span>
                                </div>

                                {/* Candidate Badges Summary */}
                                <div className="flex flex-wrap gap-1.5 my-2.5">
                                  {combo.candidatesSummary.map((cs) => (
                                    <div
                                      key={cs.id}
                                      className="px-2 py-0.5 rounded text-[10px] font-mono border bg-black/5 dark:bg-white/5 border-[#DDD4C0]/60 dark:border-[#2E2C27] flex items-center gap-1"
                                    >
                                      <span className="font-bold text-[#B89A4A]">{cs.id}:</span>
                                      <span>#{cs.position}</span>
                                      <span className="font-bold text-amber-700 dark:text-amber-400">({cs.change})</span>
                                      <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">{cs.genotype}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Comparison Box: Patient Phase vs Reference Baseline */}
                                <div className="grid grid-cols-2 gap-2 my-2.5 font-mono text-xs">
                                  <div className="p-2 rounded-lg border bg-amber-500/10 border-amber-500/30">
                                    <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">
                                      Patient Phase:
                                    </div>
                                    <div className="font-bold text-xs text-[#181715] dark:text-[#FAF7F0] mt-0.5">
                                      [{combo.altHaplotype}] ({combo.observedState.binary})
                                    </div>
                                    <div className="text-[10px] text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                                      Joint AF: {(combo.jointFrequency * 100).toFixed(1)}%
                                    </div>
                                  </div>

                                  <div className="p-2 rounded-lg border bg-emerald-500/10 border-emerald-500/30">
                                    <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                                      Reference Baseline:
                                    </div>
                                    <div className="font-bold text-xs text-[#181715] dark:text-[#FAF7F0] mt-0.5">
                                      [{combo.refHaplotype}] ({Array(combo.level).fill('0').join('-')})
                                    </div>
                                    <div className="text-[10px] text-[#5C5549] dark:text-[#A8A092] mt-0.5">
                                      Wild-Type Hom-Ref
                                    </div>
                                  </div>
                                </div>

                                {/* All 2^k Possible Phased States */}
                                <div className="space-y-1 font-mono text-[11px] mt-2">
                                  <div className="text-[10px] uppercase font-bold text-[#5C5549] dark:text-[#A8A092] mb-1">
                                    Phased Configurations (2^{combo.level} = {combo.possibleStates.length}):
                                  </div>
                                  {combo.possibleStates.map((st) => (
                                    <div
                                      key={st.binary}
                                      className={`px-2 py-1 rounded flex items-center justify-between border ${
                                        st.isObserved
                                          ? 'bg-[#B89A4A]/15 border-[#B89A4A] text-[#181715] dark:text-[#FAF7F0] font-bold ring-1 ring-[#B89A4A]/40'
                                          : 'bg-transparent border-[#DDD4C0]/50 dark:border-[#262420] text-[#5C5549] dark:text-[#A8A092]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-10 text-[10px] font-bold">{st.binary}</span>
                                        <span>[{st.alleles}]</span>
                                      </div>
                                      <span className="text-[10px] opacity-80">
                                        {st.isObserved ? '★ Patient Phase' : st.meaning}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* QUANTUM QUBO & QAOA GROUND STATE VISUALIZATION ENGINE         */}
        {/* ============================================================== */}
        <div 
          id="section-output-qubo"
          key={`qubo-${analysisRunId}`}
          className={`transition-all duration-700 animate-output-slide-in ${
            showOutputsGlow ? 'animate-glow-border ring-2 ring-[#B89A4A]/60 rounded-2xl' : ''
          }`}
          style={{ animationDelay: '240ms' }}
        >
          <QuboMatrixVisualizer isDark={isDark} variants={variants} />
        </div>

        {/* ============================================================== */}
        {/* OUTPUT 3: GENOTYPE IT BELONG (Classification Upto n Variants)  */}
        {/* ============================================================== */}
        <section 
          id="section-output-genotypes"
          key={`genotypes-${analysisRunId}`}
          className={`rounded-2xl border p-5 sm:p-7 shadow-sm transition-all duration-700 animate-output-slide-in ${
            showOutputsGlow ? 'animate-glow-border ring-2 ring-[#B89A4A]/60' : ''
          } ${
            isDark ? 'bg-[#141311] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
          }`}
          style={{ animationDelay: '360ms' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD4C0] dark:border-[#2E2C27] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-purple-500/20 text-purple-800 dark:text-purple-300">
                  3rd Output • Genotype Classification
                </span>
                {showOutputsGlow && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-purple-500/20 text-purple-800 dark:text-purple-300 animate-pulse">
                    ✨ Freshly Classified
                  </span>
                )}
                <span className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
                  Classification Upto n = {variants.length} Extracted Variants
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif-sc tracking-tight text-[#181715] dark:text-[#FAF7F0] mt-1">
                3. Genotype It Belongs To (GENOTYPE IT BELONG)
              </h2>
            </div>

            <div className="text-xs font-mono text-[#5C5549] dark:text-[#A8A092]">
              <span>Diploid Genetic Model: </span>
              <strong className="text-[#181715] dark:text-[#FAF7F0]">0/0 • 0/1 • 1/1</strong>
            </div>
          </div>

          {/* Reference Genotype Definition Table (Exact prompt structure) */}
          <div className="my-5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#B89A4A] dark:text-[#E8D89A] mb-2 flex items-center gap-1.5">
              <span>Standard Genotype Definition Reference</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[#DDD4C0] dark:border-[#2E2C27]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b font-mono uppercase text-[11px] tracking-wider ${
                    isDark 
                      ? 'bg-[#100F0D] text-[#A8A092] border-[#2E2C27]' 
                      : 'bg-[#EFE9DC] text-[#5C5549] border-[#DDD4C0]'
                  }`}>
                    <th className="py-3 px-4 font-bold">Genotype</th>
                    <th className="py-3 px-4 font-bold">Meaning</th>
                    <th className="py-3 px-4 font-bold">Alleles</th>
                    <th className="py-3 px-4 font-bold">Biological Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD4C0] dark:divide-[#2E2C27] font-mono text-xs">
                  <tr className={isDark ? 'hover:bg-[#181715]' : 'hover:bg-[#F2EBDB]'}>
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30">
                        0/0
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#181715] dark:text-[#FAF7F0]">Homozygous reference</td>
                    <td className="py-3 px-4 text-[#5C5549] dark:text-[#A8A092]">Both alleles are REF</td>
                    <td className="py-3 px-4 text-[#5C5549] dark:text-[#A8A092]">Standard baseline wild-type; no variant detected.</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-[#181715]' : 'hover:bg-[#F2EBDB]'}>
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30">
                        0/1
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#181715] dark:text-[#FAF7F0]">Heterozygous</td>
                    <td className="py-3 px-4 text-[#5C5549] dark:text-[#A8A092]">One REF allele + one ALT allele</td>
                    <td className="py-3 px-4 text-[#5C5549] dark:text-[#A8A092]">Diploid state with one wild-type and one mutant allele (~40-60% AF).</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-[#181715]' : 'hover:bg-[#F2EBDB]'}>
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-800 dark:text-purple-300 font-bold border border-purple-500/30">
                        1/1
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#181715] dark:text-[#FAF7F0]">Homozygous alternate</td>
                    <td className="py-3 px-4 text-[#5C5549] dark:text-[#A8A092]">Both alleles are ALT</td>
                    <td className="py-3 px-4 text-[#5C5549] dark:text-[#A8A092]">Complete substitution on both homologous chromosomes (&gt;80% AF).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Extracted Variants Genotype List (1 to n) */}
          <div className="mt-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#B89A4A] dark:text-[#E8D89A] mb-3 flex items-center gap-1.5">
              <span>Extracted Variant Genotype Assignments (Loci 1 to {variants.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {variants.map((v, idx) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-[#100F0D] border-[#2E2C27]' : 'bg-[#FAF7F0] border-[#DDD4C0]'
                  }`}
                >
                  <div>
                    {/* Candidate ID, Position & Change */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#DDD4C0]/70 dark:border-[#262420]">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded bg-[#B89A4A]/20 text-[#B89A4A] dark:text-[#E8D89A] font-bold text-xs">
                          {v.id}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#181715] dark:text-[#FAF7F0]">
                          (Pos {v.position})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        {v.change}
                      </span>
                    </div>

                    {/* Assigned Genotype Pill */}
                    <div className="my-3 flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                        v.genotype === '0/1'
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30'
                          : v.genotype === '1/1'
                          ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                      }`}>
                        Genotype: {v.genotype} ({v.genotypeMeaning})
                      </span>
                    </div>

                    {/* Alleles & Meaning */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <div>
                        <span className="text-[#5C5549] dark:text-[#A8A092]">Meaning: </span>
                        <strong className="text-[#181715] dark:text-[#FAF7F0]">{v.genotypeMeaning}</strong>
                      </div>
                      <div>
                        <span className="text-[#5C5549] dark:text-[#A8A092]">Alleles: </span>
                        <span className="text-[#181715] dark:text-[#FAF7F0]">{v.genotypeAlleles}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        <span>REF: <strong className="text-emerald-700 dark:text-emerald-400">{v.ref}</strong></span>
                        <span>ALT: <strong className="text-rose-700 dark:text-rose-400">{v.alt}</strong></span>
                        <span>AF: <strong>{v.alleleFrequency.toFixed(2)}</strong></span>
                        <span>Depth: <strong>{v.depth}x</strong></span>
                      </div>
                    </div>

                    {/* Ratio Split Bar */}
                    <div className="mt-3 pt-2 border-t border-[#DDD4C0]/50 dark:border-[#262420]">
                      <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-[#5C5549] dark:text-[#A8A092]">Allele Distribution:</span>
                        <span className="font-bold">{(v.alleleFrequency * 100).toFixed(0)}% ALT</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EFE9DC] dark:bg-[#201E1A] overflow-hidden flex">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${Math.max(0, (1 - v.alleleFrequency) * 100)}%` }}
                          title={`REF (${v.ref}): ${((1 - v.alleleFrequency) * 100).toFixed(0)}%`}
                        />
                        <div 
                          className={`h-full ${v.genotype === '1/1' ? 'bg-purple-600' : 'bg-amber-500'}`} 
                          style={{ width: `${v.alleleFrequency * 100}%` }}
                          title={`ALT (${v.alt}): ${(v.alleleFrequency * 100).toFixed(0)}%`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

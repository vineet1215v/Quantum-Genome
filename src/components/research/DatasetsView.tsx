import React, { useState } from 'react';
import { DATASETS_LIST } from '../../data/mockData';
import { Dataset } from '../../types';
import { ScientificBadge } from '../brand/ScientificBadge';
import { 
  Database, 
  Upload, 
  FileCheck, 
  HardDrive, 
  Layers, 
  CheckCircle2, 
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';

export const DatasetsView: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>(DATASETS_LIST);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess('Sample HG003-WGS-Subset.fastq.gz successfully registered and queued for BWA-MEM indexing.');
      setTimeout(() => setUploadSuccess(null), 6000);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              Research / Dataset Manager
            </span>
            <ScientificBadge status="EXPERIMENTAL" detail="Genomic Provenance" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Genomic Datasets &amp; Reference Repository
          </h1>
          <p className="text-sm text-[#5C5549]">
            Manage sequencing FASTQ/CRAM data files, reference builds, and preprocessed pileup indices.
          </p>
        </div>

        {/* Upload Simulation Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={simulateUpload}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-colors shadow-sm disabled:opacity-50"
          >
            <Upload size={14} className={isUploading ? 'animate-bounce' : 'text-[#E8D89A]'} />
            <span>{isUploading ? 'Validating FASTQ...' : 'Upload FASTQ / Reference'}</span>
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-[#2E6B48]/10 border border-[#2E6B48]/30 text-xs font-mono text-[#2E6B48] flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Dataset Cards Grid as specified in prompt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {datasets.map((ds) => (
          <div 
            key={ds.id}
            className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4 hover:border-[#B89A4A] transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
              <span className="font-bold text-[#8C734B] text-[10px] uppercase">
                {ds.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                ds.status === 'Preprocessed' 
                  ? 'bg-[#2E6B48]/15 text-[#2E6B48]' 
                  : 'bg-[#B46927]/15 text-[#B46927]'
              }`}>
                {ds.status}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-sc text-lg font-bold text-[#181715] font-sans leading-snug">
                {ds.name}
              </h3>
              <p className="text-[11px] text-[#5C5549] font-sans">
                {ds.organism}
              </p>
            </div>

            <div className="space-y-2 py-2 border-y border-[#EBE5D8] text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8C734B]">Reads:</span>
                <span className="font-bold text-[#181715]">{(ds.readsCount / 1000000).toFixed(2)}M reads</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C734B]">Reference Genome:</span>
                <span className="font-bold text-[#181715]">{ds.referenceGenome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C734B]">Candidate Regions:</span>
                <span className="font-bold text-[#181715]">{ds.candidateRegionsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C734B]">Detected Variants:</span>
                <span className="font-bold text-[#2E6B48]">{ds.variantsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C734B]">File Size:</span>
                <span className="font-bold text-[#181715]">{ds.sizeGb} GB</span>
              </div>
            </div>

            <div className="text-[10px] text-[#8C734B] flex items-center justify-between">
              <span>Mean Quality: Q{ds.qualityMean.toFixed(1)}</span>
              <span>GC: {ds.gcContent}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Provenance and Integrity Box */}
      <div className="p-5 rounded-2xl bg-[#EFE9DC] border border-[#DDD4C0] font-mono text-xs space-y-2">
        <div className="flex items-center gap-2 text-[#181715] font-bold">
          <Info size={15} className="text-[#B89A4A]" />
          <span>Data Provenance &amp; Benchmark Standards</span>
        </div>
        <p className="text-[#5C5549] font-sans text-xs leading-relaxed">
          The reference dataset is derived from Genome in a Bottle (GIAB) benchmark specimen HG002 / NA24385 (Son in Ashkenazim Trio). True variant call positions are verified against the NIST GIAB v4.2.1 high-confidence benchmark truth set.
        </p>
      </div>
    </div>
  );
};

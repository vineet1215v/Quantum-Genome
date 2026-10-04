export type NavigationTab = 
  | 'landing'
  | 'dashboard'
  | 'sequence-explorer'
  | 'alignment-lab'
  | 'candidate-regions'
  | 'genome-map'
  | 'variant-calling'
  | 'quantum-lab'
  | 'quantum-circuit'
  | 'qubo-explorer'
  | 'optimization-runs'
  | 'classical-quantum'
  | 'experiments'
  | 'datasets'
  | 'results'
  | 'reports'
  | 'methodology'
  | 'documentation'
  | 'settings';

export type ScientificStatus = 'EXPERIMENTAL' | 'SIMULATED' | 'THEORETICAL' | 'ILLUSTRATIVE';

export type VariantType = 'SNP' | 'INS' | 'DEL';
export type VariantOrigin = 'Somatic' | 'Germline';
export type ClinicalSignificance = 'Cancerous / Pathogenic' | 'Likely Pathogenic' | 'VUS' | 'Likely Benign' | 'Benign';
export type MutationClassification = 
  | 'Missense'
  | 'Nonsense'
  | 'Frameshift InDel'
  | 'In-frame Deletion'
  | 'In-frame Insertion'
  | 'Splice Site'
  | 'Synonymous'
  | 'Intronic / Non-coding';

export interface AnalyzedVariant {
  id: string;
  chromosome: string;
  position: number;
  ref: string;
  alt: string;
  type: VariantType;
  origin: VariantOrigin;
  clinicalSignificance: ClinicalSignificance;
  isCancerous: boolean;
  mutationClass: MutationClassification;
  whatVariantIsIt: string;
  geneSymbol: string;
  proteinChange?: string;
  cDNAChange?: string;
  depth: number;
  altDepth: number;
  alleleFrequency: number;
  quality: number;
  cancerType?: string;
  confidence: number;
  clinVarId?: string;
  cosmicId?: string;
  functionalSummary?: string;
}

export interface PresetDataset {
  id: string;
  title: string;
  subtitle: string;
  targetGene: string;
  chromosome: string;
  refFastaHeader: string;
  refSequence: string;
  queryFastaHeader: string;
  querySequence: string;
  sampleType: string;
  variants: AnalyzedVariant[];
  qualityScores: { pos: number; score: number; errorRate: number }[];
  vafDistribution: { bin: string; count: number; category: string }[];
}

export type ThemeMode = 'light' | 'dark';


export interface Experiment {
  id: string;
  name: string;
  dataset: string;
  referenceGenome: string;
  algorithm: string;
  quantumBackend: string;
  backendType: 'Simulator' | 'Hardware';
  qubits: number;
  layers: number;
  shots: number;
  date: string;
  status: 'Completed' | 'Running' | 'Queued' | 'Failed';
  runtimeClassicalMs: number;
  runtimeQuantumMs: number;
  objectiveValue: number;
  candidateRegions: number;
  variantsDetected: number;
  description: string;
}

export interface CandidateRegion {
  id: string;
  chromosome: string;
  start: number;
  end: number;
  length: number;
  referenceSeq: string;
  alternateEvidence: string;
  readDepth: number;
  altAlleleCount: number;
  alleleFrequency: number;
  baseQuality: number;
  mappingQuality: number;
  confidenceScore: number;
  selectionReason: string;
  quboMapped: boolean;
  qaoaOptimized: boolean;
  detectedVariant?: string;
}

export interface Variant {
  id: string;
  chromosome: string;
  position: number;
  ref: string;
  alt: string;
  type: 'SNP' | 'INS' | 'DEL';
  depth: number;
  altDepth: number;
  alleleFrequency: number;
  quality: number;
  filter: 'PASS' | 'LowQual' | 'Ambiguous';
  genotype: '0/1' | '1/1' | '0/0';
  confidence: number;
  quantumValidated: boolean;
  classicalValidated: boolean;
  candidateRegionId: string;
  geneContext?: string;
  functionalImpact?: 'Missense' | 'Synonymous' | 'Frameshift' | 'Intronic' | 'Regulatory';
}

export interface Dataset {
  id: string;
  name: string;
  organism: string;
  readsCount: number;
  fileFormat: string;
  referenceGenome: string;
  sizeGb: number;
  qualityMean: number;
  gcContent: number;
  dateUploaded: string;
  status: 'Preprocessed' | 'Raw' | 'Processing';
  candidateRegionsCount: number;
  variantsCount: number;
}

export interface QuboVariable {
  index: number;
  label: string;
  biologicalMeaning: string;
  assignedBit?: number;
  energyContribution: number;
}

export interface AlignmentRead {
  id: string;
  name: string;
  strand: '+' | '-';
  startPos: number;
  cigar: string;
  mapQ: number;
  sequence: string;
  qualityScores: string;
  mismatches: number[];
  insertions: number[];
  deletions: number[];
}

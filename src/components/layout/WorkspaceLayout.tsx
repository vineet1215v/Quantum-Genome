import React, { useState } from 'react';
import { CANDIDATE_REGIONS, VARIANTS_LIST } from '../../data/mockData';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardView } from '../genomics/DashboardView';
import { SequenceExplorerView } from '../genomics/SequenceExplorerView';
import { AlignmentLabView } from '../genomics/AlignmentLabView';
import { CandidateRegionsView } from '../genomics/CandidateRegionsView';
import { GenomeMapView } from '../genomics/GenomeMapView';
import { VariantCallingView } from '../genomics/VariantCallingView';
import { QuantumLabView } from '../quantum/QuantumLabView';
import { QuantumCircuitView } from '../quantum/QuantumCircuitView';
import { QuboExplorerView } from '../quantum/QuboExplorerView';
import { OptimizationRunsView } from '../quantum/OptimizationRunsView';
import { ClassicalQuantumView } from '../quantum/ClassicalQuantumView';
import { ExperimentsView } from '../research/ExperimentsView';
import { DatasetsView } from '../research/DatasetsView';
import { ResultsVcfView } from '../research/ResultsVcfView';
import { ReportsView } from '../research/ReportsView';
import { MethodologyView } from '../knowledge/MethodologyView';
import { DocumentationView } from '../knowledge/DocumentationView';
import { SettingsView } from '../settings/SettingsView';
import { VariantDrawer } from '../research/VariantDrawer';

import { NavigationTab, CandidateRegion, Variant, ThemeMode } from '../../types';

interface WorkspaceLayoutProps {
  initialTab?: NavigationTab;
  onOpenLanding: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  initialTab = 'dashboard',
  onOpenLanding,
  reducedMotion,
  onToggleReducedMotion,
  theme,
  onToggleTheme
}) => {

  const [activeTab, setActiveTab] = useState<NavigationTab>(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Shared focal context states
  const [selectedRegion, setSelectedRegion] = useState<CandidateRegion>(CANDIDATE_REGIONS[0]);
  const [inspectedVariant, setInspectedVariant] = useState<Variant | null>(null);

  // Transition handler from Candidate Regions into Quantum Lab
  const handleTransitionToQuantumLab = (region: CandidateRegion) => {
    setSelectedRegion(region);
    setActiveTab('quantum-lab');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F0E6] text-[#181715]">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenLanding={onOpenLanding}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          theme={theme}
          onToggleTheme={onToggleTheme}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={onToggleReducedMotion}
          onSelectExperimentModal={() => setActiveTab('experiments')}
        />


        {/* Scrollable Viewport Content Area */}
        <main className="flex-1 overflow-y-auto bg-paper-grid relative">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectCandidateRegion={(region) => {
                setSelectedRegion(region);
              }}
            />
          )}

          {activeTab === 'sequence-explorer' && (
            <SequenceExplorerView />
          )}

          {activeTab === 'alignment-lab' && (
            <AlignmentLabView />
          )}

          {activeTab === 'candidate-regions' && (
            <CandidateRegionsView
              selectedRegionId={selectedRegion.id}
              onSelectCandidateRegion={(region) => setSelectedRegion(region)}
              onNavigateToQuantumLab={handleTransitionToQuantumLab}
            />
          )}

          {activeTab === 'genome-map' && (
            <GenomeMapView />
          )}

          {activeTab === 'variant-calling' && (
            <VariantCallingView
              onSelectVariant={(variant) => setInspectedVariant(variant)}
            />
          )}

          {activeTab === 'quantum-lab' && (
            <QuantumLabView
              selectedRegion={selectedRegion}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'quantum-circuit' && (
            <QuantumCircuitView />
          )}

          {activeTab === 'qubo-explorer' && (
            <QuboExplorerView />
          )}

          {activeTab === 'optimization-runs' && (
            <OptimizationRunsView />
          )}

          {activeTab === 'classical-quantum' && (
            <ClassicalQuantumView />
          )}

          {activeTab === 'experiments' && (
            <ExperimentsView 
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'datasets' && (
            <DatasetsView />
          )}

          {activeTab === 'results' && (
            <ResultsVcfView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenInQuantumLab={handleTransitionToQuantumLab}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'methodology' && (
            <MethodologyView />
          )}

          {activeTab === 'documentation' && (
            <DocumentationView />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={onToggleTheme}
              reducedMotion={reducedMotion}
              onToggleReducedMotion={onToggleReducedMotion}
            />
          )}

        </main>
      </div>

      {/* Global Variant Inspector Modal Drawer */}
      <VariantDrawer
        variant={inspectedVariant}
        onClose={() => setInspectedVariant(null)}
        onOpenInQuantumLab={handleTransitionToQuantumLab}
      />
    </div>
  );
};

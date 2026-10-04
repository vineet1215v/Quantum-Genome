import React from 'react';
import { 
  LayoutDashboard, 
  Dna, 
  GitCompare, 
  ScanSearch, 
  Map, 
  GitBranch, 
  Atom, 
  CircuitBoard, 
  Grid3X3, 
  Play, 
  ChartNoAxesCombined, 
  FlaskConical, 
  Database, 
  TableProperties, 
  FileText, 
  BookOpen, 
  FileCode, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { Logo } from '../brand/Logo';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenLanding: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  onOpenLanding
}) => {
  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'GENOMIC ANALYSIS',
      items: [
        { id: 'sequence-explorer', label: 'Sequence Explorer', icon: Dna },
        { id: 'alignment-lab', label: 'Alignment Lab', icon: GitCompare },
        { id: 'candidate-regions', label: 'Candidate Regions', icon: ScanSearch, badge: '1,842' },
        { id: 'genome-map', label: 'Genome Map', icon: Map },
        { id: 'variant-calling', label: 'Variant Calling', icon: GitBranch, badge: '327' }
      ]
    },
    {
      title: 'QUANTUM COMPUTING',
      items: [
        { id: 'quantum-lab', label: 'Quantum Lab', icon: Atom, badge: 'HYBRID' },
        { id: 'quantum-circuit', label: 'Quantum Circuit', icon: CircuitBoard },
        { id: 'qubo-explorer', label: 'QUBO Explorer', icon: Grid3X3 },
        { id: 'optimization-runs', label: 'Optimization Runs', icon: Play },
        { id: 'classical-quantum', label: 'Classical vs Quantum', icon: ChartNoAxesCombined }
      ]
    },
    {
      title: 'RESEARCH',
      items: [
        { id: 'experiments', label: 'Experiments', icon: FlaskConical },
        { id: 'datasets', label: 'Datasets', icon: Database },
        { id: 'results', label: 'Results / VCF', icon: TableProperties },
        { id: 'reports', label: 'Research Reports', icon: FileText }
      ]
    },
    {
      title: 'KNOWLEDGE',
      items: [
        { id: 'methodology', label: 'Methodology', icon: BookOpen },
        { id: 'documentation', label: 'Documentation', icon: FileCode }
      ]
    }
  ];

  return (
    <aside 
      className={`relative flex flex-col h-screen shrink-0 border-r border-[#DDD4C0] bg-[#FAF7F0] transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-18' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-18 px-4 flex items-center justify-between border-b border-[#DDD4C0] bg-[#FAF7F0]">
        {!collapsed ? (
          <button 
            onClick={onOpenLanding}
            className="flex items-center text-left hover:opacity-80 transition-opacity group"
            title="Return to 3D Narrative Landing Experience"
          >
            <Logo size="sm" showSubtitle={true} theme="auto" />
          </button>
        ) : (
          <button 
            onClick={onOpenLanding}
            className="mx-auto hover:opacity-80 transition-opacity" 
            title="Return to 3D Narrative Landing Experience"
          >
            <Logo size="sm" showSubtitle={false} theme="auto" />
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-[#EAE2D0] text-[#5C5549] transition-colors border border-[#DDD4C0]"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-mono tracking-wider font-semibold text-[#8C734B] uppercase">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[#181715] text-[#FAF7F0] shadow-sm font-semibold'
                      : 'text-[#38352F] hover:bg-[#EAE2D0] hover:text-[#181715]'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                >
                  <Icon 
                    size={17} 
                    className={`shrink-0 ${
                      isActive ? 'text-[#E8D89A]' : 'text-[#8C734B]'
                    }`} 
                  />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span 
                          className={`ml-2 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                            isActive 
                              ? 'bg-[#E8D89A]/20 text-[#E8D89A] border border-[#E8D89A]/40' 
                              : 'bg-[#DDD4C0]/70 text-[#5C5549]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Narrative Mode Quick Switch */}
      <div className="p-3 border-t border-[#DDD4C0] bg-[#F2EBDB]/60 space-y-2">
        <button
          onClick={onOpenLanding}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#B89A4A]/40 bg-gradient-to-r from-[#FAF7F0] to-[#EAE2D0] hover:to-[#E0D5BE] text-xs font-medium text-[#181715] transition-all shadow-sm ${
            collapsed ? 'justify-center px-1' : ''
          }`}
          title="Launch Immersive 3D Experience"
        >
          <Sparkles size={15} className="text-[#B89A4A] shrink-0 animate-pulse" />
          {!collapsed && (
            <span className="flex-1 text-left flex items-center justify-between">
              <span>3D Narrative Hero</span>
              <ExternalLink size={12} className="text-[#8C734B]" />
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-[#5C5549] hover:bg-[#EAE2D0] hover:text-[#181715] ${
            activeTab === 'settings' ? 'bg-[#DDD4C0] font-semibold text-[#181715]' : ''
          } ${collapsed ? 'justify-center px-2' : ''}`}
          title="Settings"
        >
          <Settings size={16} className="shrink-0 text-[#8C734B]" />
          {!collapsed && <span>Settings &amp; Hardware</span>}
        </button>
      </div>
    </aside>
  );
};

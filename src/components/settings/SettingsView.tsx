import React, { useState } from 'react';
import { ScientificBadge } from '../brand/ScientificBadge';
import { ThemeMode } from '../../types';
import { 
  Settings, 
  Cpu, 
  Atom, 
  Eye, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Key, 
  Sun,
  Moon,
  SlidersHorizontal 
} from 'lucide-react';

interface SettingsViewProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  reducedMotion,
  onToggleReducedMotion,
  theme,
  onToggleTheme
}) => {
  const [backendType, setBackendType] = useState<string>('simulator');
  const [apiToken, setApiToken] = useState<string>('ibmq_mock_token_xxxxxxxxxxxx');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = () => {
    setSaveMessage('Hardware and workspace configuration saved successfully.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8C734B] uppercase tracking-wider">
              System / Settings &amp; Hardware
            </span>
            <ScientificBadge status="SIMULATED" detail="Config v2.4" />
          </div>
          <h1 className="font-serif-sc text-3xl font-normal text-[#181715]">
            Hardware Backends &amp; Platform Preferences
          </h1>
          <p className="text-sm text-[#5C5549]">
            Configure quantum simulation environments, hardware connection APIs, and display theme settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#181715] text-[#FAF7F0] hover:bg-[#24221E] transition-colors shadow-sm"
        >
          <Save size={14} className="text-[#E8D89A]" />
          <span>Save Preferences</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-xl bg-[#2E6B48]/10 border border-[#2E6B48]/30 text-xs font-mono text-[#2E6B48] flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6 font-mono text-xs">
        
        {/* Visual Theme & Appearance Selection */}
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
            <h3 className="font-serif-sc text-lg font-bold text-[#181715]">
              Display Theme &amp; Contrast
            </h3>
            <span className="text-[10px] text-[#8C734B] uppercase">Active: {theme.toUpperCase()} MODE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Mode Card */}
            <div
              onClick={() => { if (theme !== 'light') onToggleTheme(); }}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                theme === 'light'
                  ? 'bg-[#FAF7F0] border-[#B89A4A] ring-2 ring-[#B89A4A]/30 shadow-md'
                  : 'bg-[#FAF7F0] border-[#DDD4C0] opacity-75 hover:opacity-100 hover:bg-[#F2EBDB]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-[#181715]">
                  <Sun size={16} className="text-[#B89A4A]" />
                  <span>Warm Ivory (Light)</span>
                </span>
                {theme === 'light' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#2E6B48]/15 text-[#2E6B48] font-bold">
                    SELECTED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#5C5549] font-sans leading-relaxed">
                Premium archival research paper background (`#F5F0E6`), charcoal typography, and restrained champagne gold accents.
              </p>
            </div>

            {/* Dark Mode Card */}
            <div
              onClick={() => { if (theme !== 'dark') onToggleTheme(); }}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                theme === 'dark'
                  ? 'bg-[#181715] border-[#E8D89A] ring-2 ring-[#B89A4A]/50 shadow-md text-[#FAF7F0]'
                  : 'bg-[#181715] border-[#38352F] text-[#FAF7F0] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-[#FAF7F0]">
                  <Moon size={16} className="text-[#E8D89A]" />
                  <span>Deep Charcoal (Dark)</span>
                </span>
                {theme === 'dark' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8D89A]/20 text-[#E8D89A] border border-[#E8D89A]/40 font-bold">
                    SELECTED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#DDD4C0]/80 font-sans leading-relaxed">
                Futuristic quantum laboratory canvas (`#11110F`), elevated charcoal panels, and luminous golden circuit telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Backend Selection */}
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
            <h3 className="font-serif-sc text-lg font-bold text-[#181715]">
              Quantum Processing Backend
            </h3>
            <span className="text-[10px] text-[#2E6B48] font-bold">SIMULATOR READY</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#DDD4C0] hover:bg-[#EFE9DC] transition-colors cursor-pointer">
              <input
                type="radio"
                name="backend"
                value="simulator"
                checked={backendType === 'simulator'}
                onChange={() => setBackendType('simulator')}
                className="mt-1"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-[#181715]">Local Statevector Simulator (Default)</span>
                <p className="text-[11px] text-[#5C5549] font-sans">
                  High-performance deterministic statevector simulator via PennyLane / Qiskit Aer. Max 16 qubits.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#DDD4C0] hover:bg-[#EFE9DC] transition-colors cursor-pointer">
              <input
                type="radio"
                name="backend"
                value="hardware"
                checked={backendType === 'hardware'}
                onChange={() => setBackendType('hardware')}
                className="mt-1"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-[#181715]">Physical QPU Hardware (Cloud API)</span>
                <p className="text-[11px] text-[#5C5549] font-sans">
                  Submit QAOA jobs to IBM Quantum or AWS Braket QPUs. Requires valid API token and queue allocation.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* API Token Credentials */}
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4">
          <h3 className="font-serif-sc text-lg font-bold text-[#181715] border-b border-[#EBE5D8] pb-3">
            Cloud Provider Authentication
          </h3>

          <div className="space-y-2">
            <label className="text-[#8C734B] flex items-center gap-1.5">
              <Key size={13} />
              <span>Provider Token (IBM Quantum / AWS Braket):</span>
            </label>
            <input
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#EFE9DC] border border-[#DDD4C0] text-[#181715] focus:outline-none focus:border-[#B89A4A]"
            />
            <span className="text-[10px] text-[#8C734B]">Tokens are stored locally and encrypted in memory.</span>
          </div>
        </div>

        {/* Accessibility & Visual FX */}
        <div className="bg-[#FAF7F0] border border-[#DDD4C0] rounded-2xl p-6 space-y-4">
          <h3 className="font-serif-sc text-lg font-bold text-[#181715] border-b border-[#EBE5D8] pb-3">
            Accessibility &amp; Motion Controls
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFE9DC] border border-[#DDD4C0]">
            <div className="space-y-0.5">
              <span className="font-bold text-[#181715] flex items-center gap-1.5">
                <Eye size={14} className="text-[#B89A4A]" />
                <span>Reduced Motion Mode</span>
              </span>
              <p className="text-[11px] text-[#5C5549] font-sans">
                Minimizes 3D WebGL rotation speeds, particle density, and transition animations for vestibular comfort.
              </p>
            </div>

            <button
              onClick={onToggleReducedMotion}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                reducedMotion
                  ? 'bg-[#B46927] text-white'
                  : 'bg-[#181715] text-[#FAF7F0]'
              }`}
            >
              {reducedMotion ? 'Enabled (Min Motion)' : 'Disabled (Full Motion)'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

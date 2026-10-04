import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { NavigationTab, ThemeMode } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [initialWorkspaceTab, setInitialWorkspaceTab] = useState<NavigationTab>('dashboard');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('quantumgen_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('quantumgen_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleEnterWorkspace = (tab: NavigationTab = 'dashboard') => {
    setInitialWorkspaceTab(tab);
    setCurrentView('workspace');
  };

  const handleOpenLanding = () => {
    setCurrentView('landing');
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  return (
    <div className={`min-h-screen w-full font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#11110F] text-[#FAF7F0]' : 'bg-[#F5F0E6] text-[#181715]'
    }`}>
      {currentView === 'landing' ? (
        <LandingPage
          onEnterWorkspace={handleEnterWorkspace}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        <WorkspaceLayout
          initialTab={initialWorkspaceTab}
          onOpenLanding={handleOpenLanding}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}
    </div>
  );
}

export default App;

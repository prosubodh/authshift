import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { PersonaCard } from './components/PersonaCard';
import { CreateModal } from './components/CreateModal';
import { ExportImportModal } from './components/ExportImportModal';
import { SettingsModal } from './components/SettingsModal';
import { Persona, OriginContext, GlobalSettings } from '../types';
import {
  getTabOrigin,
  captureCurrentState,
  applyPersona,
  applyCleanSession,
} from '../lib/engine';
import {
  getPersonasForOrigin,
  getActivePersonaId,
  deletePersona,
  savePersona,
  getGlobalSettings,
  saveGlobalSettings,
} from '../lib/storage';
import { Plus, LogOut, ShieldAlert, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [originContext, setOriginContext] = useState<OriginContext | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [settings, setSettings] = useState<GlobalSettings>({
    autoReload: true,
    showBadges: true,
    isPro: true,
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [exportImportMode, setExportImportMode] = useState<'export' | 'import'>('export');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize data on popup open
  const refreshData = async () => {
    try {
      setLoading(true);
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && tab.url) {
        setCurrentTab(tab);
        const origin = getTabOrigin(tab.url);

        if (origin) {
          const parsed = new URL(tab.url);
          setOriginContext({
            origin,
            url: tab.url,
            hostname: parsed.hostname,
            title: tab.title || '',
            tabId: tab.id,
          });

          const [list, activeId, globalSet] = await Promise.all([
            getPersonasForOrigin(origin),
            getActivePersonaId(origin),
            getGlobalSettings(),
          ]);

          setPersonas(list);
          setActivePersonaId(activeId);
          setSettings(globalSet);
        } else {
          setOriginContext(null);
        }
      }
    } catch (err) {
      console.error('[AuthShift] Error initializing popup:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCreatePersona = async (data: {
    name: string;
    role: string;
    color: string;
    avatarText: string;
    notes?: string;
  }) => {
    if (!currentTab) return;
    try {
      const created = await captureCurrentState(currentTab, data);
      if (created) {
        setIsCreateOpen(false);
        await refreshData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to capture persona');
    }
  };

  const handleApplyPersona = async (persona: Persona) => {
    if (!currentTab) return;
    try {
      await applyPersona(currentTab, persona, settings.autoReload);
      setActivePersonaId(persona.id);
    } catch (err: any) {
      alert(err.message || 'Failed to switch persona');
    }
  };

  const handleCleanSession = async () => {
    if (!currentTab) return;
    try {
      await applyCleanSession(currentTab, settings.autoReload);
      setActivePersonaId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to clean session');
    }
  };

  const handleDeletePersona = async (persona: Persona) => {
    if (!originContext) return;
    if (confirm(`Delete persona "${persona.name}"?`)) {
      await deletePersona(originContext.origin, persona.id);
      await refreshData();
    }
  };

  const handleOpenExport = (persona: Persona) => {
    setSelectedPersona(persona);
    setExportImportMode('export');
    setIsExportImportOpen(true);
  };

  const handleOpenImport = () => {
    setSelectedPersona(null);
    setExportImportMode('import');
    setIsExportImportOpen(true);
  };

  const handleImportSuccess = async (imported: Persona) => {
    await savePersona(imported);
    await refreshData();
  };

  const handleUpdateSettings = async (updated: Partial<GlobalSettings>) => {
    const saved = await saveGlobalSettings(updated);
    setSettings(saved);
  };

  const handleRefreshActiveTab = () => {
    if (currentTab?.id) {
      chrome.tabs.reload(currentTab.id);
    }
  };

  return (
    <div className="flex flex-col min-h-[520px] max-h-[600px] w-full bg-slate-950 text-slate-100 font-sans">
      <Header
        originContext={originContext}
        onRefreshTab={handleRefreshActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenImport={handleOpenImport}
      />

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {!originContext?.origin ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 my-8 space-y-2">
            <ShieldAlert size={36} className="text-amber-500/80 mb-1" />
            <h3 className="font-semibold text-sm text-slate-200">Non-Web Origin</h3>
            <p className="text-xs max-w-[240px]">
              AuthShift operates on web applications (e.g., <code className="text-indigo-400">localhost</code>, staging, or production web apps).
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12 text-xs text-slate-500">
            Scanning session state...
          </div>
        ) : (
          <>
            {/* Personas List */}
            {personas.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2.5 my-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">No Personas Saved Yet</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Log in as an Admin, Editor, or Test User, then click below to snapshot this state.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-semibold uppercase tracking-wider">
                  <span>Saved Personas ({personas.length})</span>
                  <span>1-Click Switch</span>
                </div>
                {personas.map((p, idx) => (
                  <PersonaCard
                    key={p.id}
                    persona={p}
                    index={idx}
                    isActive={activePersonaId === p.id}
                    onApply={handleApplyPersona}
                    onExport={handleOpenExport}
                    onDelete={handleDeletePersona}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Action Bar */}
      {originContext?.origin && (
        <footer className="p-3 bg-slate-900/90 border-t border-slate-800/80 backdrop-blur sticky bottom-0 z-20 flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            <Plus size={14} />
            <span>Save Current Tab</span>
          </button>

          <button
            onClick={handleCleanSession}
            title="Wipe Cookies & LocalStorage (Clean Logged-Out State) [Alt+Shift+0]"
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/15 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 border border-slate-700/80 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </footer>
      )}

      {/* Modals */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreatePersona}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        initialMode={exportImportMode}
        currentOrigin={originContext?.origin || ''}
        selectedPersona={selectedPersona}
        onClose={() => setIsExportImportOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
};

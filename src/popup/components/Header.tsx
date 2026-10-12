import React from 'react';
import { RefreshCw, Settings, Upload, Globe, ShieldCheck } from 'lucide-react';
import { OriginContext } from '../../types';

interface HeaderProps {
  originContext: OriginContext | null;
  onRefreshTab: () => void;
  onOpenSettings: () => void;
  onOpenImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  originContext,
  onRefreshTab,
  onOpenSettings,
  onOpenImport,
}) => {
  return (
    <header className="p-3.5 bg-slate-900/80 backdrop-blur border-b border-slate-800/80 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-xs tracking-wider">
            AS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-slate-100">AuthShift</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenImport}
            title="Import Persona"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Upload size={14} />
          </button>
          <button
            onClick={onRefreshTab}
            title="Reload Active Tab"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings & Shortcuts"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Origin indicator banner */}
      <div className="flex items-center justify-between text-xs bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 text-slate-400 font-mono">
        <div className="flex items-center gap-1.5 truncate max-w-[260px]">
          <Globe size={12} className="text-indigo-400 shrink-0" />
          <span className="truncate text-slate-300 font-medium">
            {originContext?.origin ? originContext.origin : 'No active web page'}
          </span>
        </div>
        {originContext?.origin && (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 shrink-0 font-sans">
            <ShieldCheck size={11} /> Ready
          </span>
        )}
      </div>
    </header>
  );
};

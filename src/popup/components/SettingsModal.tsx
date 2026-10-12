import React from 'react';
import { X, Keyboard, ShieldCheck, Zap } from 'lucide-react';
import { GlobalSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GlobalSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<GlobalSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-200 p-1 rounded-md"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap size={15} />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Settings & Preferences</h2>
            <p className="text-[10px] text-slate-400">Configure behavior & global hotkeys</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Toggles */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="text-xs font-medium text-slate-200">Auto-reload Tab</div>
                <div className="text-[10px] text-slate-400">Automatically refresh page upon persona switch</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoReload}
                onChange={(e) => onUpdateSettings({ autoReload: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="text-xs font-medium text-slate-200">Icon Badge Indicator</div>
                <div className="text-[10px] text-slate-400">Display active persona acronym on toolbar icon</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showBadges}
                onChange={(e) => onUpdateSettings({ showBadges: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
              />
            </label>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              <Keyboard size={13} className="text-indigo-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-sans">Switch to Persona 1</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300">Alt+Shift+1</kbd>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-sans">Switch to Persona 2</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300">Alt+Shift+2</kbd>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-sans">Switch to Persona 3</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300">Alt+Shift+3</kbd>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-sans">Clean Session (Log Out)</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-rose-300">Alt+Shift+0</kbd>
              </div>
            </div>
          </div>

          {/* License Status */}
          <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" />
              <div>
                <div className="text-xs font-semibold text-indigo-200">AuthShift Pro Lifetime</div>
                <div className="text-[10px] text-indigo-300/70">Unlimited personas & team export active</div>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ACTIVE
            </span>
          </div>

          <div className="text-center pt-1 text-[10px] text-slate-500">
            AuthShift v1.0.0 • 100% Local Storage • Zero Tracking
          </div>
        </div>
      </div>
    </div>
  );
};

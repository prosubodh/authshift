import React from 'react';
import { Persona } from '../../types';
import { Check, Download, Trash2, ArrowRightLeft, Cookie, HardDrive } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  isActive: boolean;
  index: number;
  onApply: (persona: Persona) => void;
  onExport: (persona: Persona) => void;
  onDelete: (persona: Persona) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  isActive,
  index,
  onApply,
  onExport,
  onDelete,
}) => {
  const cookieCount = persona.data.cookies.length;
  const storageCount = Object.keys(persona.data.localStorage).length;
  const shortcutHint = index < 3 ? `Alt+Shift+${index + 1}` : null;

  return (
    <div
      className={`group relative rounded-xl p-3 transition-all border ${
        isActive
          ? 'bg-slate-900 border-indigo-500/50 shadow-md shadow-indigo-500/10'
          : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar initial badge with custom color */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-inner"
            style={{ backgroundColor: persona.color || '#4F46E5' }}
          >
            {persona.avatarText || 'P'}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-xs text-slate-100 truncate max-w-[130px]">
                {persona.name}
              </h3>
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${persona.color}15`,
                  borderColor: `${persona.color}35`,
                  color: persona.color,
                }}
              >
                {persona.role}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1" title={`${cookieCount} cookies`}>
                <Cookie size={11} className="text-slate-500" />
                {cookieCount}
              </span>
              <span className="flex items-center gap-1" title={`${storageCount} localStorage keys`}>
                <HardDrive size={11} className="text-slate-500" />
                {storageCount}
              </span>
              {shortcutHint && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {shortcutHint}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-1 shrink-0">
          {isActive ? (
            <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[10px] flex items-center gap-1">
              <Check size={11} /> Active
            </span>
          ) : (
            <button
              onClick={() => onApply(persona)}
              className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] flex items-center gap-1 transition-colors shadow-sm"
            >
              <ArrowRightLeft size={10} /> Switch
            </button>
          )}

          <button
            onClick={() => onExport(persona)}
            title="Export Persona Payload"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors opacity-80 group-hover:opacity-100"
          >
            <Download size={13} />
          </button>
          <button
            onClick={() => onDelete(persona)}
            title="Delete Persona"
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors opacity-80 group-hover:opacity-100"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {persona.notes && (
        <div className="mt-2 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 italic truncate">
          "{persona.notes}"
        </div>
      )}
    </div>
  );
};

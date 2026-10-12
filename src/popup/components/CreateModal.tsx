import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    role: string;
    color: string;
    avatarText: string;
    notes?: string;
  }) => void;
}

const PRESET_ROLES = [
  { label: 'Admin', color: '#EF4444' },      // Red
  { label: 'Editor', color: '#F59E0B' },     // Amber
  { label: 'Member', color: '#10B981' },     // Emerald
  { label: 'Free User', color: '#3B82F6' },  // Blue
  { label: 'Auditor', color: '#8B5CF6' },    // Purple
];

const COLOR_PALETTE = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Admin');
  const [color, setColor] = useState('#EF4444');
  const [avatarText, setAvatarText] = useState('AD');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleRoleSelect = (preset: { label: string; color: string }) => {
    setRole(preset.label);
    setColor(preset.color);
    if (!name || PRESET_ROLES.some((r) => r.label === name)) {
      setName(preset.label);
      setAvatarText(preset.label.slice(0, 2).toUpperCase());
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim()) {
      const parts = val.trim().split(/\s+/);
      if (parts.length > 1) {
        setAvatarText((parts[0][0] + parts[1][0]).toUpperCase());
      } else {
        setAvatarText(val.slice(0, 2).toUpperCase());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      role: role.trim() || 'Custom',
      color,
      avatarText: avatarText.slice(0, 3).toUpperCase() || 'P',
      notes: notes.trim(),
    });
  };

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
            <Sparkles size={15} />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Save Current Persona</h2>
            <p className="text-[10px] text-slate-400">Snapshot cookies, localStorage & sessionStorage</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Quick Preset Roles */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
              Preset Roles
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_ROLES.map((r) => (
                <button
                  type="button"
                  key={r.label}
                  onClick={() => handleRoleSelect(r)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                    role === r.label
                      ? 'border-indigo-500 bg-indigo-500/10 text-white font-medium'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Avatar Preview */}
          <div className="grid grid-cols-[1fr_64px] gap-2">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Persona Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Super Admin"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Badge
              </label>
              <div
                className="h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-inner"
                style={{ backgroundColor: color }}
              >
                {avatarText || '??'}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
              Badge Color
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={10} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
              Test Notes <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Test user with expired Stripe subscription"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-md shadow-indigo-600/20"
            >
              Snapshot Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

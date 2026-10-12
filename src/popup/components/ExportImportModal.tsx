import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, AlertCircle } from 'lucide-react';
import { Persona } from '../../types';
import { exportPersonaPayload, parsePersonaPayload } from '../../lib/storage';

interface ExportImportModalProps {
  isOpen: boolean;
  initialMode: 'export' | 'import';
  currentOrigin: string;
  selectedPersona: Persona | null;
  onClose: () => void;
  onImportSuccess: (imported: Persona) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  initialMode,
  currentOrigin,
  selectedPersona,
  onClose,
  onImportSuccess,
}) => {
  const [mode, setMode] = useState<'export' | 'import'>(initialMode);
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportPayloadString = selectedPersona ? exportPersonaPayload(selectedPersona) : '';

  const handleCopy = () => {
    if (!exportPayloadString) return;
    navigator.clipboard.writeText(exportPayloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedPersona) return;
    const blob = new Blob([exportPayloadString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `authshift-${selectedPersona.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!importText.trim()) {
        setError('Please paste an AuthShift persona JSON string');
        return;
      }

      const parsed = parsePersonaPayload(importText);
      const importedPersona: Persona = {
        ...parsed.persona,
        id: crypto.randomUUID(), // assign fresh ID
        origin: currentOrigin,    // re-bind to current origin!
        updatedAt: Date.now(),
      };

      onImportSuccess(importedPersona);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Invalid persona JSON format');
    }
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

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 mb-3 w-fit">
          <button
            onClick={() => { setMode('export'); setError(null); }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'export'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Export
          </button>
          <button
            onClick={() => { setMode('import'); setError(null); }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'import'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Import
          </button>
        </div>

        {mode === 'export' ? (
          <div>
            <div className="mb-2">
              <h2 className="font-semibold text-sm">Export Persona</h2>
              <p className="text-[10px] text-slate-400">
                Share this session payload with QA or teammates to reproduce auth state
              </p>
            </div>

            {selectedPersona ? (
              <div className="space-y-2.5">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto">
                  <pre>{exportPayloadString}</pre>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied to Clipboard' : 'Copy Payload'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Download size={13} />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Select a persona to export.
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleImportSubmit} className="space-y-2.5">
            <div>
              <h2 className="font-semibold text-sm">Import Persona</h2>
              <p className="text-[10px] text-slate-400">
                Paste an AuthShift payload. It will automatically bind to origin{' '}
                <span className="font-mono text-indigo-400">{currentOrigin || 'current site'}</span>.
              </p>
            </div>

            {error && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-1.5">
                <AlertCircle size={13} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <textarea
              rows={5}
              placeholder="Paste AuthShift JSON payload here..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors"
              >
                <Upload size={13} />
                Import & Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import { Persona, GlobalSettings, ExportedPersonaPayload } from '../types';

const SETTINGS_KEY = 'authshift_global_settings';

const DEFAULT_SETTINGS: GlobalSettings = {
  autoReload: true,
  showBadges: true,
  isPro: true, // Default enabled for developer convenience (can toggle in settings)
};

export function getOriginStorageKey(origin: string): string {
  return `personas_${origin}`;
}

export function getActivePersonaStorageKey(origin: string): string {
  return `active_persona_${origin}`;
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const res = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(res[SETTINGS_KEY] || {}) };
}

export async function saveGlobalSettings(settings: Partial<GlobalSettings>): Promise<GlobalSettings> {
  const current = await getGlobalSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
  return updated;
}

export async function getPersonasForOrigin(origin: string): Promise<Persona[]> {
  const key = getOriginStorageKey(origin);
  const res = await chrome.storage.local.get(key);
  return (res[key] as Persona[]) || [];
}

export async function savePersona(persona: Persona): Promise<void> {
  const key = getOriginStorageKey(persona.origin);
  const existing = await getPersonasForOrigin(persona.origin);
  const index = existing.findIndex((p) => p.id === persona.id);

  let updated: Persona[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = { ...persona, updatedAt: Date.now() };
  } else {
    updated = [...existing, persona];
  }

  await chrome.storage.local.set({ [key]: updated });
}

export async function deletePersona(origin: string, id: string): Promise<void> {
  const key = getOriginStorageKey(origin);
  const existing = await getPersonasForOrigin(origin);
  const updated = existing.filter((p) => p.id !== id);
  await chrome.storage.local.set({ [key]: updated });

  const activeId = await getActivePersonaId(origin);
  if (activeId === id) {
    await setActivePersonaId(origin, null);
  }
}

export async function getActivePersonaId(origin: string): Promise<string | null> {
  const key = getActivePersonaStorageKey(origin);
  const res = await chrome.storage.local.get(key);
  return (res[key] as string) || null;
}

export async function setActivePersonaId(origin: string, id: string | null): Promise<void> {
  const key = getActivePersonaStorageKey(origin);
  if (id) {
    await chrome.storage.local.set({ [key]: id });
  } else {
    await chrome.storage.local.remove(key);
  }
}

export function exportPersonaPayload(persona: Persona): string {
  const payload: ExportedPersonaPayload = {
    version: '1.0.0',
    type: 'authshift_persona_export',
    exportedAt: Date.now(),
    persona,
  };
  return JSON.stringify(payload, null, 2);
}

export function parsePersonaPayload(jsonString: string): ExportedPersonaPayload {
  const data = JSON.parse(jsonString);
  if (!data || data.type !== 'authshift_persona_export' || !data.persona) {
    throw new Error('Invalid AuthShift persona payload format');
  }
  return data as ExportedPersonaPayload;
}

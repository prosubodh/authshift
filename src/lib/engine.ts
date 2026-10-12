import { Persona } from '../types';
import { captureOriginCookies, restoreOriginCookies, clearOriginCookies } from './cookie-utils';
import { captureWebStorage, restoreWebStorage, clearWebStorage } from './dom-storage';
import { savePersona, setActivePersonaId } from './storage';

export function getTabOrigin(url?: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) return '';
    return parsed.origin;
  } catch {
    return '';
  }
}

export function updateExtensionBadge(tabId: number, text: string, color = '#4F46E5') {
  try {
    chrome.action.setBadgeText({ tabId, text });
    chrome.action.setBadgeBackgroundColor({ tabId, color });
  } catch (err) {
    console.warn('[AuthShift] Could not update badge:', err);
  }
}

/**
 * Capture active session across Cookies + WebStorage into a Persona
 */
export async function captureCurrentState(
  tab: chrome.tabs.Tab,
  metadata: {
    name: string;
    role: string;
    color: string;
    avatarText: string;
    shortcut?: string;
    notes?: string;
  }
): Promise<Persona | null> {
  if (!tab.id || !tab.url) return null;
  const origin = getTabOrigin(tab.url);
  if (!origin) throw new Error('Cannot capture auth on non-web origins');

  const [cookies, storage] = await Promise.all([
    captureOriginCookies(tab.url, origin),
    captureWebStorage(tab.id),
  ]);

  const persona: Persona = {
    id: crypto.randomUUID(),
    name: metadata.name.trim(),
    role: metadata.role.trim(),
    color: metadata.color,
    avatarText: metadata.avatarText.toUpperCase().slice(0, 3) || metadata.name.slice(0, 2).toUpperCase(),
    origin,
    shortcut: metadata.shortcut,
    notes: metadata.notes,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    data: {
      cookies,
      localStorage: storage.localStorage,
      sessionStorage: storage.sessionStorage,
    },
  };

  await savePersona(persona);
  await setActivePersonaId(origin, persona.id);
  updateExtensionBadge(tab.id, persona.avatarText, persona.color);

  return persona;
}

/**
 * Atomically apply a saved persona: Cookies + Web Storage + Tab Reload
 */
export async function applyPersona(
  tab: chrome.tabs.Tab,
  persona: Persona,
  autoReload = true
): Promise<void> {
  if (!tab.id || !tab.url) return;
  const origin = getTabOrigin(tab.url);

  // 1. Restore cookies
  await restoreOriginCookies(tab.url, persona.data.cookies);

  // 2. Restore DOM Web Storage
  await restoreWebStorage(tab.id, persona.data.localStorage, persona.data.sessionStorage);

  // 3. Mark active persona
  await setActivePersonaId(origin, persona.id);

  // 4. Update badge
  updateExtensionBadge(tab.id, persona.avatarText, persona.color);

  // 5. Reload tab if enabled (bypass cache to defeat Next.js client router cache)
  if (autoReload) {
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  }
}

/**
 * Reset to clean, logged-out state: wipe cookies + storage
 */
export async function applyCleanSession(
  tab: chrome.tabs.Tab,
  autoReload = true
): Promise<void> {
  if (!tab.id || !tab.url) return;
  const origin = getTabOrigin(tab.url);

  // 1. Wipe cookies
  await clearOriginCookies(tab.url);

  // 2. Wipe DOM storage
  await clearWebStorage(tab.id);

  // 3. Clear active persona
  await setActivePersonaId(origin, null);

  // 4. Reset badge
  updateExtensionBadge(tab.id, 'OUT', '#64748B');

  // 5. Reload tab
  if (autoReload) {
    await chrome.tabs.reload(tab.id, { bypassCache: true });
  }
}

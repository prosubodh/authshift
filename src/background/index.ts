import { getTabOrigin, applyPersona, applyCleanSession, updateExtensionBadge } from '../lib/engine';
import { getPersonasForOrigin, getActivePersonaId, getGlobalSettings } from '../lib/storage';

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[AuthShift] Service worker initialized.');
});

// Update badge when user switches active tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    await syncBadgeForTab(tab);
  } catch (err) {
    console.warn('[AuthShift] Failed to sync badge on tab activated:', err);
  }
});

// Update badge when tab finishes loading
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    await syncBadgeForTab(tab);
  }
});

async function syncBadgeForTab(tab: chrome.tabs.Tab) {
  if (!tab.id || !tab.url) return;
  const origin = getTabOrigin(tab.url);
  if (!origin) {
    updateExtensionBadge(tab.id, '', '#000000');
    return;
  }

  const settings = await getGlobalSettings();
  if (!settings.showBadges) {
    updateExtensionBadge(tab.id, '', '#000000');
    return;
  }

  const activeId = await getActivePersonaId(origin);
  if (!activeId) {
    updateExtensionBadge(tab.id, '', '#000000');
    return;
  }

  const personas = await getPersonasForOrigin(origin);
  const activePersona = personas.find((p) => p.id === activeId);
  if (activePersona) {
    updateExtensionBadge(tab.id, activePersona.avatarText, activePersona.color);
  } else {
    updateExtensionBadge(tab.id, '', '#000000');
  }
}

// Handle global keyboard shortcuts (Alt+Shift+1, 2, 3, 0)
chrome.commands.onCommand.addListener(async (command) => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) return;

    const origin = getTabOrigin(tab.url);
    if (!origin) return;

    const settings = await getGlobalSettings();

    if (command === 'clean_session') {
      await applyCleanSession(tab, settings.autoReload);
      return;
    }

    const personas = await getPersonasForOrigin(origin);
    let targetIndex = -1;

    if (command === 'switch_persona_1') targetIndex = 0;
    if (command === 'switch_persona_2') targetIndex = 1;
    if (command === 'switch_persona_3') targetIndex = 2;

    if (targetIndex >= 0 && personas[targetIndex]) {
      await applyPersona(tab, personas[targetIndex], settings.autoReload);
    }
  } catch (err) {
    console.error('[AuthShift] Error handling command:', err);
  }
});

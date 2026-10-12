/**
 * Interacts with DOM Web Storage (localStorage & sessionStorage) via chrome.scripting.executeScript
 */

export async function captureWebStorage(tabId: number): Promise<{
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}> {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const localData: Record<string, string> = {};
        const sessionData: Record<string, string> = {};

        try {
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key !== null) {
              localData[key] = window.localStorage.getItem(key) ?? '';
            }
          }
        } catch (e) {
          console.warn('[AuthShift] Error reading localStorage', e);
        }

        try {
          for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            if (key !== null) {
              sessionData[key] = window.sessionStorage.getItem(key) ?? '';
            }
          }
        } catch (e) {
          console.warn('[AuthShift] Error reading sessionStorage', e);
        }

        return { localStorage: localData, sessionStorage: sessionData };
      },
    });

    if (results && results[0] && results[0].result) {
      return results[0].result;
    }
  } catch (err) {
    console.warn('[AuthShift] Cannot capture web storage on this tab:', err);
  }

  return { localStorage: {}, sessionStorage: {} };
}

export async function restoreWebStorage(
  tabId: number,
  localData: Record<string, string>,
  sessionData: Record<string, string>
): Promise<void> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (incomingLocal: Record<string, string>, incomingSession: Record<string, string>) => {
        try {
          window.localStorage.clear();
          for (const [k, v] of Object.entries(incomingLocal)) {
            window.localStorage.setItem(k, v);
          }
        } catch (e) {
          console.warn('[AuthShift] Error restoring localStorage', e);
        }

        try {
          window.sessionStorage.clear();
          for (const [k, v] of Object.entries(incomingSession)) {
            window.sessionStorage.setItem(k, v);
          }
        } catch (e) {
          console.warn('[AuthShift] Error restoring sessionStorage', e);
        }
      },
      args: [localData, sessionData],
    });
  } catch (err) {
    console.warn('[AuthShift] Cannot restore web storage on this tab:', err);
  }
}

export async function clearWebStorage(tabId: number): Promise<void> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        try {
          window.localStorage.clear();
        } catch {}
        try {
          window.sessionStorage.clear();
        } catch {}
      },
    });
  } catch (err) {
    console.warn('[AuthShift] Cannot clear web storage on this tab:', err);
  }
}

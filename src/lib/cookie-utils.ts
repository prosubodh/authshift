import { CookieSnapshot } from '../types';

/**
 * Extracts the registrable root domain (e.g., "app.company.com" -> "company.com")
 */
export function getRootDomain(hostname: string): string {
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  ) {
    return hostname;
  }

  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;

  // Handle common compound TLDs (.co.uk, .com.au, .org.np, etc.)
  const secondLast = parts[parts.length - 2];
  if (['co', 'com', 'org', 'net', 'edu', 'gov'].includes(secondLast) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }

  return parts.slice(-2).join('.');
}

/**
 * Clean domain string: removes leading dots required by chrome.cookies.set
 */
export function cleanDomainString(domain: string): string {
  return domain.startsWith('.') ? domain.slice(1) : domain;
}

/**
 * Constructs a valid URL for chrome.cookies operations based on cookie domain & secure flag
 */
export function getCookieUrl(cookie: { domain: string; path: string; secure: boolean }, currentUrl: string): string {
  try {
    const currentParsed = new URL(currentUrl);
    const isSecure = cookie.secure || currentParsed.protocol === 'https:';
    const protocol = isSecure ? 'https:' : 'http:';
    
    let domain = cleanDomainString(cookie.domain);
    
    // If it's localhost or IP, maintain port from current tab
    if ((domain === 'localhost' || domain === '127.0.0.1') && currentParsed.port) {
      domain = `${domain}:${currentParsed.port}`;
    }

    const path = cookie.path.startsWith('/') ? cookie.path : `/${cookie.path}`;
    return `${protocol}//${domain}${path}`;
  } catch {
    return currentUrl;
  }
}

/**
 * Capture all cookies associated with the current URL, root domain, and auth subdomains (Clerk, Supabase, Auth0)
 */
export async function captureOriginCookies(url: string, origin: string): Promise<CookieSnapshot[]> {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    const rootDomain = getRootDomain(hostname);

    const queryPromises = [
      chrome.cookies.getAll({ url }),
      chrome.cookies.getAll({ domain: hostname }),
    ];

    // If not localhost, query root domain (captures .root.com, clerk.root.com, auth.root.com, etc.)
    if (rootDomain !== hostname) {
      queryPromises.push(chrome.cookies.getAll({ domain: rootDomain }));
    }

    // Also check for Clerk's accounts.dev if present in dev/staging instances
    queryPromises.push(chrome.cookies.getAll({ domain: 'clerk.accounts.dev' }).catch(() => []));

    const results = await Promise.all(queryPromises);
    const cookieMap = new Map<string, chrome.cookies.Cookie>();

    for (const cookieList of results) {
      for (const c of cookieList) {
        // Only keep cookies related to our root domain or Clerk auth
        const cDomainClean = cleanDomainString(c.domain);
        const isRelated =
          cDomainClean === hostname ||
          cDomainClean.endsWith(`.${rootDomain}`) ||
          cDomainClean === rootDomain ||
          c.name.startsWith('__clerk') ||
          c.name === '__session' ||
          c.name === '__client' ||
          c.name === '__client_uat';

        if (isRelated) {
          const key = `${c.name}@${c.domain}${c.path}`;
          cookieMap.set(key, c);
        }
      }
    }

    return Array.from(cookieMap.values()).map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      secure: c.secure,
      httpOnly: c.httpOnly,
      sameSite: c.sameSite,
      expirationDate: c.expirationDate,
    }));
  } catch (err) {
    console.error('[AuthShift] Failed to capture cookies:', err);
    return [];
  }
}

/**
 * Clears all existing cookies for the given domain and auth subdomains
 */
export async function clearOriginCookies(url: string): Promise<void> {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    const rootDomain = getRootDomain(hostname);

    const queryPromises = [
      chrome.cookies.getAll({ url }),
      chrome.cookies.getAll({ domain: hostname }),
    ];

    if (rootDomain !== hostname) {
      queryPromises.push(chrome.cookies.getAll({ domain: rootDomain }));
    }

    const results = await Promise.all(queryPromises);
    const cookieMap = new Map<string, chrome.cookies.Cookie>();

    for (const cookieList of results) {
      for (const c of cookieList) {
        const cDomainClean = cleanDomainString(c.domain);
        const isRelated =
          cDomainClean === hostname ||
          cDomainClean.endsWith(`.${rootDomain}`) ||
          cDomainClean === rootDomain ||
          c.name.startsWith('__clerk') ||
          c.name === '__session' ||
          c.name === '__client' ||
          c.name === '__client_uat';

        if (isRelated) {
          const key = `${c.name}@${c.domain}${c.path}`;
          cookieMap.set(key, c);
        }
      }
    }

    for (const c of cookieMap.values()) {
      const cookieUrl = getCookieUrl(c, url);
      await chrome.cookies.remove({
        url: cookieUrl,
        name: c.name,
        storeId: c.storeId,
      }).catch(() => {
        chrome.cookies.remove({ url, name: c.name });
      });
    }
  } catch (err) {
    console.error('[AuthShift] Error clearing cookies:', err);
  }
}

/**
 * Restores a snapshot of cookies with leading-dot stripping and SameSite enforcement
 */
export async function restoreOriginCookies(currentUrl: string, cookies: CookieSnapshot[]): Promise<void> {
  await clearOriginCookies(currentUrl);

  for (const c of cookies) {
    try {
      const cleanDomain = cleanDomainString(c.domain);
      const isSameSiteNone = c.sameSite === 'no_restriction';
      const isSecure = c.secure || isSameSiteNone;
      const targetUrl = getCookieUrl({ ...c, secure: isSecure }, currentUrl);

      const setDetails: chrome.cookies.SetDetails = {
        url: targetUrl,
        name: c.name,
        value: c.value,
        path: c.path || '/',
        secure: isSecure,
        httpOnly: c.httpOnly,
      };

      // Set domain without leading dot (modern Chrome requirement)
      if (!cleanDomain.startsWith('localhost') && cleanDomain.includes('.')) {
        setDetails.domain = cleanDomain;
      }

      if (c.sameSite && c.sameSite !== 'unspecified') {
        setDetails.sameSite = c.sameSite;
      }

      // If cookie has a future expiration date, retain it; otherwise leave as session cookie
      if (c.expirationDate && c.expirationDate > Date.now() / 1000) {
        setDetails.expirationDate = c.expirationDate;
      }

      const res = await chrome.cookies.set(setDetails);
      if (!res && chrome.runtime.lastError) {
        console.warn(`[AuthShift] Warning setting cookie ${c.name}:`, chrome.runtime.lastError.message);
      }
    } catch (err) {
      console.warn(`[AuthShift] Failed to set cookie ${c.name}:`, err);
    }
  }
}

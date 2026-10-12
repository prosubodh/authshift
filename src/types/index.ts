export interface CookieSnapshot {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite?: 'unspecified' | 'no_restriction' | 'lax' | 'strict';
  expirationDate?: number;
}

export interface PersonaData {
  cookies: CookieSnapshot[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  color: string;
  avatarText: string;
  origin: string;
  shortcut?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  data: PersonaData;
}

export interface OriginContext {
  origin: string;
  url: string;
  hostname: string;
  title: string;
  tabId: number;
}

export interface GlobalSettings {
  autoReload: boolean;
  showBadges: boolean;
  isPro: boolean;
}

export interface ExportedPersonaPayload {
  version: string;
  type: 'authshift_persona_export';
  exportedAt: number;
  persona: Persona;
}

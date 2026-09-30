import { PlayHistoryMap, UserProfile, ThemeId } from '../types';

export const STORAGE_KEYS = {
  PLAY_HISTORY: 'tussen_ons_play_history',
  USER_PROFILE: 'tussen_ons_user_profile',
  FAVORITES: 'tussen_ons_global_favorites',
  THEME: 'tussen_ons_active_theme',
  PREMIUM: 'tussen_ons_is_premium',
  ONBOARDED: 'tussen_ons_onboarded'
} as const;

/**
 * Validates whether an unknown value conforms to PlayHistoryMap
 */
export function validatePlayHistory(data: unknown): PlayHistoryMap {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {};
  }

  const result: PlayHistoryMap = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      'lastPlayedAt' in value &&
      'timesPlayed' in value &&
      typeof (value as { lastPlayedAt: unknown }).lastPlayedAt === 'number' &&
      typeof (value as { timesPlayed: unknown }).timesPlayed === 'number'
    ) {
      result[key] = {
        lastPlayedAt: (value as { lastPlayedAt: number }).lastPlayedAt,
        timesPlayed: Math.max(0, (value as { timesPlayed: number }).timesPlayed)
      };
    }
  }

  return result;
}

export function safeGetPlayHistory(): PlayHistoryMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAY_HISTORY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return validatePlayHistory(parsed);
  } catch {
    return {};
  }
}

export function safeSavePlayHistory(history: PlayHistoryMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAY_HISTORY, JSON.stringify(history));
  } catch {
    // Storage quota or disabled storage - fail gracefully
  }
}

/**
 * Validates UserProfile schema
 */
export function validateUserProfile(data: unknown): UserProfile {
  const fallback: UserProfile = { name: 'Jij', avatar: '✨' };
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fallback;
  }

  const obj = data as Record<string, unknown>;
  const name = typeof obj.name === 'string' && obj.name.trim().length > 0
    ? obj.name.trim().slice(0, 25)
    : fallback.name;
  const avatar = typeof obj.avatar === 'string' && obj.avatar.trim().length > 0
    ? obj.avatar.trim().slice(0, 4)
    : fallback.avatar;

  return { name, avatar };
}

export function safeGetUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return { name: 'Jij', avatar: '✨' };
    const parsed = JSON.parse(raw);
    return validateUserProfile(parsed);
  } catch {
    return { name: 'Jij', avatar: '✨' };
  }
}

export function safeSaveUserProfile(profile: UserProfile): void {
  try {
    const valid = validateUserProfile(profile);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(valid));
  } catch {
    // fail gracefully
  }
}

/**
 * Validates an array of favorite prompt IDs
 */
export function validateFavorites(data: unknown): string[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

export function safeGetFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return validateFavorites(parsed);
  } catch {
    return [];
  }
}

export function safeSaveFavorites(favorites: string[]): void {
  try {
    const valid = validateFavorites(favorites);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(valid));
  } catch {
    // fail gracefully
  }
}

/**
 * Validates Theme ID
 */
export function validateTheme(data: unknown, fallback: ThemeId = 'linnen'): ThemeId {
  const validThemes: ThemeId[] = ['linnen', 'salie', 'blush', 'espresso'];
  if (typeof data === 'string' && validThemes.includes(data as ThemeId)) {
    return data as ThemeId;
  }
  return fallback;
}

export function safeGetTheme(fallback: ThemeId = 'linnen'): ThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    return validateTheme(raw, fallback);
  } catch {
    return fallback;
  }
}

export function safeSaveTheme(theme: ThemeId): void {
  try {
    const valid = validateTheme(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, valid);
  } catch {
    // fail gracefully
  }
}

/**
 * Validates Premium Status
 */
export function safeGetPremium(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.PREMIUM) === 'true';
  } catch {
    return false;
  }
}

export function safeSavePremium(isPremium: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREMIUM, isPremium ? 'true' : 'false');
  } catch {
    // fail gracefully
  }
}

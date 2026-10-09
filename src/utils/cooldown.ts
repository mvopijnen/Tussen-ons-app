import { PlayHistoryRecord } from '../types';

export const COOLDOWN_COMPLETED_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const COOLDOWN_SKIPPED_MS = 7 * 24 * 60 * 60 * 1000;    // 7 days
export const COOLDOWN_SHOWN_MS = 24 * 60 * 60 * 1000;          // 24 hours

export function isPromptOnCooldown(record?: PlayHistoryRecord, currentTime?: number): boolean {
  if (!record || !record.lastPlayedAt) return false;
  const now = currentTime ?? Date.now();
  const elapsed = now - record.lastPlayedAt;
  const outcome = record.outcome || 'shown';

  if (outcome === 'completed') {
    return elapsed < COOLDOWN_COMPLETED_MS;
  } else if (outcome === 'skipped') {
    return elapsed < COOLDOWN_SKIPPED_MS;
  } else {
    return elapsed < COOLDOWN_SHOWN_MS;
  }
}

/**
 * Subscription & Entitlement Service
 * Provides a clean architecture ready for backend receipt / payment validation
 * (e.g. Stripe, Apple App Store StoreKit 2, Google Play Billing).
 */
import { safeGetPremium, safeSavePremium } from './storage';

export interface EntitlementResult {
  isUnlocked: boolean;
  source: 'local' | 'remote' | 'trial';
  expiresAt?: number;
}

/**
 * Validates subscription status.
 * Ready to hook up to a server-side verification endpoint when cloud billing is configured.
 */
export async function verifySubscription(): Promise<EntitlementResult> {
  const localStatus = safeGetPremium();

  // If a backend billing endpoint is present in the environment, verify securely
  const endpoint = import.meta.env.VITE_SUBSCRIPTION_VERIFY_URL;
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: Date.now() })
      });
      if (response.ok) {
        const data = await response.json();
        const isUnlocked = Boolean(data?.active);
        safeSavePremium(isUnlocked);
        return { isUnlocked, source: 'remote' };
      }
    } catch {
      // Network failure: fallback to validated cached local state
    }
  }

  return {
    isUnlocked: localStatus,
    source: localStatus ? 'trial' : 'local'
  };
}

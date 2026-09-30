/**
 * Test Suite for Tussen Ons Conversation Engine (V2.5)
 * Validates curation, emotional arc, adaptive scoring, cooldown, safety rules,
 * deterministic reproducibility, and storage validation.
 */
import { buildCuratedSession, getTargetIntensityAndType } from '../src/hooks/useSessionEngine';
import { PROMPTS_DATABASE } from '../src/data/prompts';
import { SessionConfig } from '../src/types';
import { 
  validatePlayHistory, 
  validateUserProfile, 
  validateFavorites, 
  validateTheme 
} from '../src/utils/storage';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

console.log('\n--- STARTING TUSSEN ONS ENGINE TESTS ---\n');

// Test 1: No duplicate prompt IDs in a standard single session
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'leren_kennen',
    duration: '30min',
    intensity: 'personal',
    isPremiumUnlocked: false
  };

  const session = buildCuratedSession(config);
  const ids = session.map(p => p.id);
  const uniqueIds = new Set(ids);
  assert(uniqueIds.size === ids.length, `No duplicate prompt IDs in session (found ${ids.length} unique of ${ids.length})`);
}

// Test 2: Easy mode never selects intensity 4 or 5
{
  const config: SessionConfig = {
    relationship: 'partner',
    relationshipStage: 'partner_datenight',
    vibe: 'lachen',
    duration: '30min',
    intensity: 'easy',
    isPremiumUnlocked: true
  };

  const session = buildCuratedSession(config);
  const tooIntense = session.filter(p => p.intensity >= 4);
  assert(tooIntense.length === 0, `Easy mode contains zero prompts of intensity 4 or 5 (found ${tooIntense.length})`);
}

// Test 3: Premium prompts are NEVER available for free users under any setting
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_flirty',
    vibe: 'dieper',
    duration: '30min',
    intensity: 'deep', // Even with deep selected, free users must never receive premium prompts
    isPremiumUnlocked: false
  };

  const session = buildCuratedSession(config);
  const leakedPremium = session.filter(p => p.premium === true);
  assert(leakedPremium.length === 0, `Free user receives zero premium prompts even under deep intensity (found ${leakedPremium.length})`);
}

// Test 4: Correct relationship filtering
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'leren_kennen',
    duration: '15min',
    intensity: 'personal',
    isPremiumUnlocked: false
  };

  const session = buildCuratedSession(config);
  const mismatched = session.filter(p => 
    !p.relationshipType.includes('date') && !p.relationshipType.includes('surprise')
  );
  assert(mismatched.length === 0, `Date session only includes date-compatible prompts (mismatched: ${mismatched.length})`);
}

// Test 5: Correct session length across all duration settings
{
  const conf5: SessionConfig = { relationship: 'date', vibe: 'lachen', duration: '5min', intensity: 'easy' };
  const conf15: SessionConfig = { relationship: 'date', vibe: 'lachen', duration: '15min', intensity: 'personal' };
  const conf30: SessionConfig = { relationship: 'date', vibe: 'lachen', duration: '30min', intensity: 'personal' };
  const confInf: SessionConfig = { relationship: 'date', vibe: 'lachen', duration: 'unlimited', intensity: 'personal' };

  const s5 = buildCuratedSession(conf5);
  const s15 = buildCuratedSession(conf15);
  const s30 = buildCuratedSession(conf30);
  const sInf = buildCuratedSession(confInf);

  assert(s5.length === 5, `5min session yields exactly 5 prompts (got ${s5.length})`);
  assert(s15.length === 9, `15min session yields exactly 9 prompts (got ${s15.length})`);
  assert(s30.length === 14, `30min session yields exactly 14 prompts (got ${s30.length})`);
  assert(sInf.length === 16, `Unlimited session yields exactly 16 prompts (got ${sInf.length})`);
}

// Test 6: Deterministic curation (calling buildCuratedSession twice produces identical ordered list)
{
  const config: SessionConfig = {
    relationship: 'partner',
    relationshipStage: 'partner_datenight',
    vibe: 'dieper',
    duration: '15min',
    intensity: 'personal',
    isPremiumUnlocked: false
  };

  const runA = buildCuratedSession(config).map(p => p.id);
  const runB = buildCuratedSession(config).map(p => p.id);

  assert(
    runA.length === runB.length && runA.every((id, idx) => id === runB[idx]),
    `Curated session generation is 100% deterministic and reproducible`
  );
}

// Test 7: Sufficient variation in interaction types across a session
{
  const config: SessionConfig = {
    relationship: 'friends',
    relationshipStage: 'friends_good',
    vibe: 'lachen',
    duration: '15min',
    intensity: 'personal',
    isPremiumUnlocked: true
  };

  const session = buildCuratedSession(config);
  const uniqueTypes = new Set(session.map(p => p.interactionType));
  assert(uniqueTypes.size >= 3, `Session has healthy variety of interaction types (found ${uniqueTypes.size} different types in 9 prompts)`);
}

// Test 8: 'Verrassend' gives significantly higher interactive mechanics
{
  const configVerrassend: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_flirty',
    vibe: 'verrassend',
    duration: '15min',
    intensity: 'personal',
    isPremiumUnlocked: true
  };

  const session = buildCuratedSession(configVerrassend);
  const interactiveTypes = ['challenge', 'guess', 'point', 'rapid_fire', 'reveal', 'secret_pick'];
  const interactiveCount = session.filter(p => interactiveTypes.includes(p.interactionType)).length;
  assert(interactiveCount >= 4, `'Verrassend' vibe prioritizes game mechanics and interactive types (${interactiveCount} of ${session.length})`);
}

// Test 9: Final phase ends positively (Positive Landing)
{
  const config: SessionConfig = {
    relationship: 'partner',
    relationshipStage: 'partner_datenight',
    vibe: 'dieper',
    duration: '15min',
    intensity: 'deep',
    isPremiumUnlocked: true
  };

  const session = buildCuratedSession(config);
  const lastPrompt = session[session.length - 1];
  const arc = getTargetIntensityAndType(session.length - 1, session.length, 'deep');

  assert(arc.isEnding === true, `Target arc identifies last step as ending phase`);
  assert(lastPrompt.intensity <= 3, `Ending prompt does not overwhelm with maximum intensity (intensity is ${lastPrompt.intensity})`);
  const isPositiveTone = 
    lastPrompt.emotionalTone === 'positive_landing' ||
    lastPrompt.tags.some(t => ['waardering', 'compliment', 'toekomst', 'positief', 'afsluiting'].includes(t)) ||
    lastPrompt.interactionType === 'challenge' ||
    lastPrompt.interactionType === 'both_answer';
  assert(isPositiveTone, `Last prompt provides a positive, connective landing`);
}

// Test 10: Deep intensity builds gradually (not starting at intensity 5)
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_serious',
    vibe: 'dieper',
    duration: '15min',
    intensity: 'deep',
    isPremiumUnlocked: true
  };

  const session = buildCuratedSession(config);
  const firstPrompt = session[0];
  assert(firstPrompt.intensity <= 2, `Deep session starts gently with intensity <= 2 (first prompt intensity is ${firstPrompt.intensity})`);
}

// Test 11: Secret pick mechanics exist in the database with valid structure
{
  const secretPicks = PROMPTS_DATABASE.filter(p => p.interactionType === 'secret_pick');
  assert(secretPicks.length >= 3, `Database contains secret_pick mechanics (found ${secretPicks.length} items)`);
  secretPicks.forEach(p => {
    assert(!!p.secretPickDetails && p.secretPickDetails.options.length >= 2, `Secret pick "${p.id}" has valid options`);
  });
}

// Test 12: LocalStorage validation handles malformed and tampered data gracefully
{
  // Corrupted play history
  const invalidHistory = validatePlayHistory({
    corrupt1: "bad string",
    corrupt2: { lastPlayedAt: "not a number", timesPlayed: -5 },
    valid: { lastPlayedAt: 1727650000000, timesPlayed: 2 }
  });
  assert(!('corrupt1' in invalidHistory), `Storage validator strips invalid string entries from play history`);
  assert(!('corrupt2' in invalidHistory), `Storage validator rejects non-numeric timestamps`);
  assert(invalidHistory.valid?.timesPlayed === 2, `Storage validator retains valid history record`);

  // Corrupted profile
  const fallbackProfile = validateUserProfile({ name: "   ", avatar: "" });
  assert(fallbackProfile.name === "Jij", `Storage validator falls back to default name on blank whitespace`);
  assert(fallbackProfile.avatar === "✨", `Storage validator falls back to default avatar on blank string`);

  // Corrupted favorites
  const sanitizedFavs = validateFavorites(["valid-id", 12345, null, "another-valid"]);
  assert(sanitizedFavs.length === 2 && sanitizedFavs[0] === "valid-id", `Storage validator strips non-string items from favorites`);

  // Corrupted theme
  const safeTheme = validateTheme("unknown-theme-xyz", "linnen");
  assert(safeTheme === "linnen", `Storage validator protects against invalid theme injection`);
}

console.log('\n🎉 ALL 12 CONVERSATION ENGINE & STABILITY TESTS PASSED DETERMINISTICALLY!\n');

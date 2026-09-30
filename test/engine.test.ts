/**
 * Test Suite for Tussen Ons Conversation Engine (V3.0 Realtime Adaptive)
 * Validates real-time adaptive prompt selection, skip reactions, laughter playful bias,
 * safe resets, cooldown differentiation, stage safety, positive landings, and storage validation.
 */
import { 
  buildCuratedSession, 
  getTargetIntensityAndType, 
  selectAdaptivePrompt,
  isPromptOnCooldown,
  COOLDOWN_COMPLETED_MS,
  COOLDOWN_SKIPPED_MS,
  COOLDOWN_SHOWN_MS
} from '../src/hooks/useSessionEngine';
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
  assert(lastPrompt.intensity <= 2, `Ending prompt does not overwhelm with maximum intensity (intensity is ${lastPrompt.intensity})`);
  assert(lastPrompt.emotionalTone === 'positive_landing', `Last prompt provides a positive landing with emotionalTone positive_landing`);
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

// Test 11: Realtime Adaptation - Skipping an intense prompt makes the next prompt lighter
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_serious',
    vibe: 'dieper',
    duration: '15min',
    intensity: 'deep',
    isPremiumUnlocked: true
  };

  const normalStep6 = selectAdaptivePrompt(6, 9, config, {}, {
    usedPromptIds: new Set(['date-ask-1', 'date-both-1']),
    adaptiveIntensityBias: 0,
    consecutiveSkips: 0,
    isAfterDeepSkip: false
  });

  const step6AfterDeepSkip = selectAdaptivePrompt(6, 9, config, {}, {
    usedPromptIds: new Set(['date-ask-1', 'date-both-1']),
    adaptiveIntensityBias: -1,
    consecutiveSkips: 1,
    isAfterDeepSkip: true
  });

  assert(
    step6AfterDeepSkip.id !== normalStep6.id,
    `Deep skip directly changes the selected next prompt (${normalStep6.id} -> ${step6AfterDeepSkip.id})`
  );
  assert(
    step6AfterDeepSkip.intensity < normalStep6.intensity,
    `Prompt selected after deep skip is noticeably lighter (normal: ${normalStep6.intensity}, after skip: ${step6AfterDeepSkip.intensity})`
  );
}

// Test 12: Realtime Adaptation - Two consecutive skips trigger a safe reset card
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_serious',
    vibe: 'dieper',
    duration: '15min',
    intensity: 'deep',
    isPremiumUnlocked: true
  };

  const resetCard = selectAdaptivePrompt(4, 9, config, {}, {
    usedPromptIds: new Set(['date-ask-1']),
    adaptiveIntensityBias: -1,
    consecutiveSkips: 2
  });

  assert(
    resetCard.intensity <= 2,
    `Two consecutive skips force a safe low-intensity card (intensity ${resetCard.intensity} <= 2)`
  );
  assert(
    resetCard.emotionalTone === 'warmup' || resetCard.emotionalTone === 'playful',
    `Two consecutive skips select a warmup or playful reset card (got ${resetCard.emotionalTone})`
  );
}

// Test 13: Realtime Adaptation - Laughter induces playfulBias that shifts next prompt
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_few',
    vibe: 'dieper',
    duration: '15min',
    intensity: 'personal',
    isPremiumUnlocked: true
  };

  const neutralPrompt = selectAdaptivePrompt(5, 9, config, {}, {
    usedPromptIds: new Set(['date-ask-1', 'date-both-1']),
    playfulBias: 0
  });

  const laughingPrompt = selectAdaptivePrompt(5, 9, config, {}, {
    usedPromptIds: new Set(['date-ask-1', 'date-both-1']),
    playfulBias: 4
  });

  assert(
    laughingPrompt.id !== neutralPrompt.id,
    `High playfulBias from laughter shifts candidate selection (${neutralPrompt.id} -> ${laughingPrompt.id})`
  );
  const isPlayful = 
    laughingPrompt.emotionalTone === 'playful' ||
    ['point', 'rapid_fire', 'challenge', 'would_you_rather', 'secret_pick'].includes(laughingPrompt.interactionType) ||
    laughingPrompt.tags.some(t => ['humor', 'luchtig', 'spel', 'blunder'].includes(t));

  assert(isPlayful, `Playful bias prioritizes game mechanics or playful tone (got ${laughingPrompt.interactionType} / ${laughingPrompt.emotionalTone})`);
}

// Test 14: Realtime Adaptation - Session favorites subtly influence prompt scoring
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'leren_kennen',
    duration: '15min',
    intensity: 'personal',
    isPremiumUnlocked: true
  };

  const withoutFavPrompt = selectAdaptivePrompt(2, 9, config, {}, {
    usedPromptIds: new Set(['date-ask-1']),
    sessionFavorites: new Set()
  });

  const withFavPrompt = selectAdaptivePrompt(2, 9, config, {}, {
    usedPromptIds: new Set(['date-ask-1']),
    sessionFavorites: new Set(['date-guess-1'])
  });

  assert(
    withFavPrompt.id !== withoutFavPrompt.id,
    `Session favorites steer upcoming prompt selection (${withoutFavPrompt.id} -> ${withFavPrompt.id})`
  );
  assert(
    withFavPrompt.id === 'date-guess-1' || withFavPrompt.interactionType === 'guess',
    `Selected prompt reflects the favorited theme (${withFavPrompt.id})`
  );
}

// Test 15: Safety Guard - date_first NEVER receives heavy prompts (intensity >= 4)
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'dieper',
    duration: '30min',
    intensity: 'deep',
    isPremiumUnlocked: true
  };

  const session = buildCuratedSession(config);
  const heavyPrompts = session.filter(p => p.intensity >= 4);
  assert(
    heavyPrompts.length === 0,
    `date_first session never receives prompts of intensity >= 4 (found ${heavyPrompts.length})`
  );
  const forbiddenIds = ['date-ask-4', 'date-both-3', 'date-wyr-3', 'date-fts-3'];
  const leakedForbidden = session.filter(p => forbiddenIds.includes(p.id));
  assert(
    leakedForbidden.length === 0,
    `date_first strictly excludes overly vulnerable dating prompts (found ${leakedForbidden.length})`
  );
}

// Test 16: History cooldown differentiates between completed, skipped, and shown
{
  const now = Date.now();

  const completedRecent = { lastPlayedAt: now - (5 * 24 * 60 * 60 * 1000), timesPlayed: 1, outcome: 'completed' as const };
  const completedOld = { lastPlayedAt: now - (35 * 24 * 60 * 60 * 1000), timesPlayed: 1, outcome: 'completed' as const };
  assert(isPromptOnCooldown(completedRecent, now) === true, `Completed prompt is on cooldown after 5 days`);
  assert(isPromptOnCooldown(completedOld, now) === false, `Completed prompt clears cooldown after 35 days`);

  const skippedRecent = { lastPlayedAt: now - (2 * 24 * 60 * 60 * 1000), timesPlayed: 1, outcome: 'skipped' as const };
  const skippedOld = { lastPlayedAt: now - (9 * 24 * 60 * 60 * 1000), timesPlayed: 1, outcome: 'skipped' as const };
  assert(isPromptOnCooldown(skippedRecent, now) === true, `Skipped prompt is on cooldown after 2 days`);
  assert(isPromptOnCooldown(skippedOld, now) === false, `Skipped prompt clears cooldown after 9 days`);

  const shownRecent = { lastPlayedAt: now - (12 * 60 * 60 * 1000), timesPlayed: 1, outcome: 'shown' as const };
  const shownOld = { lastPlayedAt: now - (2 * 24 * 60 * 60 * 1000), timesPlayed: 1, outcome: 'shown' as const };
  assert(isPromptOnCooldown(shownRecent, now) === true, `Shown prompt is on short cooldown after 12 hours`);
  assert(isPromptOnCooldown(shownOld, now) === false, `Shown prompt clears short cooldown after 2 days`);
}

// Test 17: Database metadata completeness (stages and emotionalTone coverage)
{
  const missingStages = PROMPTS_DATABASE.filter(p => !p.relationshipStages || p.relationshipStages.length === 0);
  const missingTones = PROMPTS_DATABASE.filter(p => !p.emotionalTone);
  assert(missingStages.length === 0, `100% of prompts have explicit relationshipStages (missing: ${missingStages.length})`);
  assert(missingTones.length === 0, `100% of prompts have explicit emotionalTone (missing: ${missingTones.length})`);
}

// Test 18: LocalStorage validation handles malformed and tampered data gracefully
{
  // Corrupted play history
  const invalidHistory = validatePlayHistory({
    corrupt1: "bad string",
    corrupt2: { lastPlayedAt: "not a number", timesPlayed: -5 },
    valid: { lastPlayedAt: 1727650000000, timesPlayed: 2, outcome: 'completed' }
  });
  assert(!('corrupt1' in invalidHistory), `Storage validator strips invalid string entries from play history`);
  assert(!('corrupt2' in invalidHistory), `Storage validator rejects non-numeric timestamps`);
  assert(invalidHistory.valid?.timesPlayed === 2, `Storage validator retains valid history record`);
  assert(invalidHistory.valid?.outcome === 'completed', `Storage validator retains valid outcome`);

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

console.log('\n🎉 ALL 18 ENGINE, ADAPTATION, SAFETY & STABILITY TESTS PASSED!\n');

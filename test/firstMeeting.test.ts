/**
 * Comprehensive Validation Test Suite for:
 * Tussen Ons — Eerste Ontmoeting 2.0
 * 
 * Verifies all required tests:
 * 1. Every sphere × 5 minutes (5 items)
 * 2. Every sphere × 15 minutes (9 items)
 * 3. Every sphere × 30 minutes (14 items)
 * 4. Unlimited mode across at least 3 rounds (5 items per round)
 * 5. Two consecutive sessions with same settings (no unwanted duplicates, history tracking)
 * 6. Refresh / restart session reproducibility
 * 7. Zero exact content duplication in any session
 * 8. Zero repeat_group duplication within the same session
 * 9. Correct follow-up per card (word-for-word fidelity)
 * 10. Zero AI-generated fallback content (strictly from the 200 approved items)
 */

import { 
  buildFirstMeetingSession, 
  getFirstMeetingBlueprint, 
  APPROVED_EERSTE_ONTMOETING_ITEMS, 
  APPROVED_EERSTE_ONTMOETING_PROMPTS,
  vibeToSphere 
} from '../src/data/firstMeetingEngine';
import { SessionConfig, VibeType, DurationType } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

console.log('\n--- STARTING EERSTE ONTMOETING 2.0 VALIDATION TESTS ---\n');

const allSpheres: VibeType[] = ['lachen', 'leren_kennen', 'flirten', 'dieper', 'verrassend'];
const allApprovedIds = new Set(APPROVED_EERSTE_ONTMOETING_ITEMS.map(i => i.id));

// Test 1: Library completeness & integrity (exactly 200 approved items, exactly 40 per sphere)
{
  assert(APPROVED_EERSTE_ONTMOETING_ITEMS.length === 200, `Library contains exactly 200 approved items (got ${APPROVED_EERSTE_ONTMOETING_ITEMS.length})`);
  assert(APPROVED_EERSTE_ONTMOETING_PROMPTS.length === 200, `Mapped prompts contain exactly 200 items (got ${APPROVED_EERSTE_ONTMOETING_PROMPTS.length})`);

  for (const vibe of allSpheres) {
    const sphere = vibeToSphere(vibe);
    const count = APPROVED_EERSTE_ONTMOETING_ITEMS.filter(i => i.primary_sphere === sphere).length;
    assert(count === 40, `Sphere '${sphere}' contains exactly 40 items (got ${count})`);
  }

  // Verify all items are active & approved
  const allActive = APPROVED_EERSTE_ONTMOETING_ITEMS.every(i => i.active === true && i.quality_status === 'approved');
  assert(allActive, `100% of items have quality_status = 'approved' and active = true`);
}

// Test 2: Every sphere × 5 minutes (exactly 5 items, zero repeat_group duplicate)
for (const vibe of allSpheres) {
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe,
    duration: '5min',
    intensity: 'personal'
  };

  const session = buildFirstMeetingSession(config, {});
  assert(session.length === 5, `Sphere '${vibe}' × 5 min produces exactly 5 items (got ${session.length})`);

  // Check unique IDs
  const ids = session.map(p => p.id);
  assert(new Set(ids).size === 5, `Sphere '${vibe}' × 5 min has zero exact content duplicates`);

  // Check zero repeat_group duplicates
  const repeatGroups = session.map(p => p.repeat_group).filter(Boolean);
  assert(new Set(repeatGroups).size === repeatGroups.length, `Sphere '${vibe}' × 5 min has zero repeat_group duplicates`);

  // Check all IDs come strictly from the 200 approved library
  const allFromLibrary = ids.every(id => allApprovedIds.has(id));
  assert(allFromLibrary, `Sphere '${vibe}' × 5 min contains zero AI-generated content`);

  // Check blueprint order: opener, dilemma, interactive, safe_personal, closure
  const types = session.map(p => p.content_type);
  assert(types[0] === 'opener', `First item is opener (got ${types[0]})`);
  assert(types[types.length - 1] === 'closure', `Last item is closure (got ${types[types.length - 1]})`);
}

// Test 3: Every sphere × 15 minutes (exactly 9 items, zero repeat_group duplicate)
for (const vibe of allSpheres) {
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe,
    duration: '15min',
    intensity: 'personal'
  };

  const session = buildFirstMeetingSession(config, {});
  assert(session.length === 9, `Sphere '${vibe}' × 15 min produces exactly 9 items (got ${session.length})`);

  const ids = session.map(p => p.id);
  assert(new Set(ids).size === 9, `Sphere '${vibe}' × 15 min has zero exact content duplicates`);

  const repeatGroups = session.map(p => p.repeat_group).filter(Boolean);
  assert(new Set(repeatGroups).size === repeatGroups.length, `Sphere '${vibe}' × 15 min has zero repeat_group duplicates`);

  const allFromLibrary = ids.every(id => allApprovedIds.has(id));
  assert(allFromLibrary, `Sphere '${vibe}' × 15 min contains zero AI-generated content`);
}

// Test 4: Every sphere × 30 minutes (exactly 14 items, zero repeat_group duplicate)
for (const vibe of allSpheres) {
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe,
    duration: '30min',
    intensity: 'personal'
  };

  const session = buildFirstMeetingSession(config, {});
  assert(session.length === 14, `Sphere '${vibe}' × 30 min produces exactly 14 items (got ${session.length})`);

  const ids = session.map(p => p.id);
  assert(new Set(ids).size === 14, `Sphere '${vibe}' × 30 min has zero exact content duplicates`);

  const repeatGroups = session.map(p => p.repeat_group).filter(Boolean);
  assert(new Set(repeatGroups).size === repeatGroups.length, `Sphere '${vibe}' × 30 min has zero repeat_group duplicates`);

  const allFromLibrary = ids.every(id => allApprovedIds.has(id));
  assert(allFromLibrary, `Sphere '${vibe}' × 30 min contains zero AI-generated content`);
}

// Test 5: Unlimited mode across at least 3 rounds (5 items per round, cross-round freshness)
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'leren_kennen',
    duration: 'unlimited',
    intensity: 'personal'
  };

  const seenIds = new Set<string>();
  const seenRepeatGroups = new Set<string>();

  const round1 = buildFirstMeetingSession(config, {}, 0, seenRepeatGroups, seenIds);
  round1.forEach(p => { seenIds.add(p.id); if (p.repeat_group) seenRepeatGroups.add(p.repeat_group); });
  assert(round1.length === 5, `Unlimited Round 1 produces exactly 5 items`);

  const round2 = buildFirstMeetingSession(config, {}, 1, seenRepeatGroups, seenIds);
  round2.forEach(p => { seenIds.add(p.id); if (p.repeat_group) seenRepeatGroups.add(p.repeat_group); });
  assert(round2.length === 5, `Unlimited Round 2 produces exactly 5 items`);

  const round3 = buildFirstMeetingSession(config, {}, 2, seenRepeatGroups, seenIds);
  round3.forEach(p => { seenIds.add(p.id); if (p.repeat_group) seenRepeatGroups.add(p.repeat_group); });
  assert(round3.length === 5, `Unlimited Round 3 produces exactly 5 items`);

  // Verify all 15 prompts across the 3 rounds are completely unique!
  assert(seenIds.size === 15, `Across 3 unlimited rounds, all 15 prompts are 100% unique (found ${seenIds.size})`);
  assert(seenRepeatGroups.size === 15, `Across 3 unlimited rounds, all 15 repeat_groups are 100% unique`);
}

// Test 6: Two consecutive sessions with same settings + history update
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'flirten',
    duration: '15min',
    intensity: 'personal'
  };

  const sessionA = buildFirstMeetingSession(config, {});
  const history: Record<string, { lastPlayedAt: number; timesPlayed: number; outcome: 'completed' }> = {};
  
  // Record sessionA as played
  const now = Date.now();
  for (const p of sessionA) {
    history[p.id] = { lastPlayedAt: now, timesPlayed: 1, outcome: 'completed' };
  }

  // Session B with history awareness
  const sessionB = buildFirstMeetingSession(config, history);
  
  // Session B should prioritize fresh items that were not in session A
  const overlap = sessionB.filter(p => sessionA.some(a => a.id === p.id));
  assert(overlap.length <= 1, `Second session avoids recently played cards (overlap: ${overlap.length} of 9)`);
  assert(sessionB.length === 9, `Second session has full length of 9 items`);
}

// Test 7: Deterministic restart / refresh produces identical reproducible session
{
  const config: SessionConfig = {
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'dieper',
    duration: '15min',
    intensity: 'personal'
  };

  const run1 = buildFirstMeetingSession(config, {}).map(p => p.id);
  const run2 = buildFirstMeetingSession(config, {}).map(p => p.id);

  assert(
    run1.length === run2.length && run1.every((id, idx) => id === run2[idx]),
    `Session selection is 100% deterministic and reproducible on refresh/restart`
  );
}

// Test 8: Follow-up fidelity check
{
  const itemsWithFollowUp = APPROVED_EERSTE_ONTMOETING_ITEMS.filter(i => i.follow_up && i.follow_up.length > 0);
  assert(itemsWithFollowUp.length > 0, `Library has ${itemsWithFollowUp.length} items with follow-up prompts`);

  for (const raw of itemsWithFollowUp) {
    const prompt = APPROVED_EERSTE_ONTMOETING_PROMPTS.find(p => p.id === raw.id);
    assert(prompt !== undefined, `Prompt ${raw.id} found in mapped library`);
    assert(prompt!.subtitle === raw.follow_up, `Follow-up text for ${raw.id} is 100% identical without modification`);
  }
}

// Test 9: Dilemma choices fidelity check
{
  const dilemmaItems = APPROVED_EERSTE_ONTMOETING_ITEMS.filter(i => i.type === 'dilemma');
  assert(dilemmaItems.length === 40, `Library contains exactly 40 dilemma items (8 per sphere × 5)`);

  for (const raw of dilemmaItems) {
    const prompt = APPROVED_EERSTE_ONTMOETING_PROMPTS.find(p => p.id === raw.id);
    assert(prompt !== undefined, `Dilemma ${raw.id} found in mapped library`);
    assert(prompt!.options !== undefined && prompt!.options.length === 2, `Dilemma ${raw.id} has exactly 2 options`);
    assert(prompt!.options![0].text === raw.options![0], `Option A matches raw options[0]`);
    assert(prompt!.options![1].text === raw.options![1], `Option B matches raw options[1]`);
  }
}

console.log('\n🎉 ALL EERSTE ONTMOETING 2.0 VALIDATION TESTS PASSED!\n');

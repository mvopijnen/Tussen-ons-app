/**
 * Tussen Ons — Eerste Ontmoeting 2.0 Engine
 * 
 * Strict Content Rule:
 * Sole source of content is `tussen_ons_eerste_ontmoeting_2_0_200_approved.json`.
 * Only items with quality_status = 'approved' and active = true.
 * No AI generation, no rewriting, no shortening, no alternative wordings.
 * 
 * Spheres:
 * - laughing_light (lachen)
 * - learning_wonder (leren_kennen)
 * - flirting_tension (flirten)
 * - deeper_connection (dieper)
 * - unexpected_surprising (verrassend)
 * 
 * Durations:
 * - 5 min: circa 5 items
 * - 15 min: circa 9 items
 * - 30 min: circa 14 items
 * - unlimited: rounds of 5 items with natural stopping points
 */

import rawItems from './tussen_ons_eerste_ontmoeting_2_0_200_approved.json';
import { PromptItem, SessionConfig, VibeType, InteractionType, PlayHistoryRecord } from '../types';
import { isPromptOnCooldown } from '../utils/cooldown';

export type PlayHistoryMap = Record<string, PlayHistoryRecord>;

export interface RawEersteOntmoetingItem {
  id: string;
  dating_stage: string;
  primary_sphere: string;
  compatible_spheres: string[];
  type: string;
  text: string;
  options?: string[];
  psychological_goal: string;
  secondary_goal?: string;
  intensity: 'light' | 'light_medium';
  energy: string;
  topic: string;
  repeat_group: string;
  durations: string[];
  follow_up?: string;
  follow_up_allowed: boolean;
  active: boolean;
  quality_status: string;
  content_version: number;
}

// Convert VibeType from UI to primary_sphere
export function vibeToSphere(vibe: VibeType): string {
  switch (vibe) {
    case 'lachen':
      return 'laughing_light';
    case 'leren_kennen':
      return 'learning_wonder';
    case 'flirten':
      return 'flirting_tension';
    case 'dieper':
      return 'deeper_connection';
    case 'verrassend':
      return 'unexpected_surprising';
    default:
      return 'learning_wonder';
  }
}

// Map energy to emotionalTone for UI display
function mapEnergyToTone(type: string, energy: string): 'warmup' | 'playful' | 'curious' | 'vulnerable' | 'positive_landing' {
  if (type === 'closure') return 'positive_landing';
  switch (energy) {
    case 'playful':
    case 'flirty':
      return 'playful';
    case 'warm':
      return 'warmup';
    case 'curious':
    case 'surprising':
      return 'curious';
    case 'reflective':
      return 'vulnerable';
    default:
      return 'warmup';
  }
}

// Map raw item to PromptItem without modifying text or wording
export function rawItemToPromptItem(item: RawEersteOntmoetingItem): PromptItem {
  let interactionType: InteractionType = 'both_answer';
  if (item.type === 'dilemma') {
    interactionType = 'would_you_rather';
  } else if (item.type === 'interactive') {
    const lower = item.text.toLowerCase();
    if (lower.includes('wijs tegelijk') || lower.includes('kies tegelijk') || lower.includes('kijk elkaar aan')) {
      interactionType = 'point';
    } else {
      interactionType = 'challenge';
    }
  } else if (item.type === 'perspective') {
    interactionType = 'guess';
  } else if (item.type === 'safe_personal') {
    interactionType = 'ask';
  } else if (item.type === 'closure') {
    interactionType = 'ask';
  } else if (item.type === 'opener') {
    interactionType = 'both_answer';
  } else if (item.type === 'scenario') {
    interactionType = 'both_answer';
  }

  // Options for dilemma
  const options = item.options && item.options.length >= 2 ? [
    { id: 'a', text: item.options[0] },
    { id: 'b', text: item.options[1] }
  ] : undefined;

  let subcategory = 'Eerste Ontmoeting';
  if (item.type === 'opener') subcategory = 'Openingsvragen';
  else if (item.type === 'scenario') subcategory = 'Situationele Vragen';
  else if (item.type === 'dilemma') subcategory = "Dilemma's";
  else if (item.type === 'safe_personal') subcategory = 'Persoonlijk & Veilig';
  else if (item.type === 'interactive') subcategory = 'Interactief';
  else if (item.type === 'perspective') subcategory = 'Perspective-taking';
  else if (item.type === 'closure') subcategory = 'Afsluiting';

  return {
    id: item.id,
    category: 'Eerste Date',
    subcategory,
    interactionType,
    intensity: item.intensity === 'light_medium' ? 2 : 1,
    relationshipType: ['date', 'surprise'],
    relationshipStages: ['date_first'],
    emotionalTone: mapEnergyToTone(item.type, item.energy),
    tags: [item.topic, item.repeat_group, item.type, item.energy, item.primary_sphere],
    premium: false,
    prompt: item.text,
    subtitle: item.follow_up || undefined,
    options,
    challengeAction: item.type === 'interactive' ? (item.follow_up || 'Voer de opdracht samen uit.') : undefined,
    guessDetails: item.type === 'perspective' ? {
      targetPrompt: item.follow_up || 'Raad het antwoord van de ander...',
      hint: 'Let op de lichaamstaal en spontane reactie.'
    } : undefined,
    repeat_group: item.repeat_group,
    topic: item.topic,
    primary_sphere: item.primary_sphere,
    compatible_spheres: item.compatible_spheres,
    content_type: item.type,
    follow_up: item.follow_up,
    energy: item.energy,
    psychological_goal: item.psychological_goal,
    secondary_goal: item.secondary_goal
  };
}

// Approved and active pool
export const APPROVED_EERSTE_ONTMOETING_ITEMS: RawEersteOntmoetingItem[] = (rawItems as RawEersteOntmoetingItem[]).filter(
  (item) => item.quality_status === 'approved' && item.active === true && item.dating_stage === 'first_meeting'
);

export const APPROVED_EERSTE_ONTMOETING_PROMPTS: PromptItem[] = APPROVED_EERSTE_ONTMOETING_ITEMS.map(rawItemToPromptItem);

// Session blueprints per duration
const BLUEPRINT_5 = ['opener', 'dilemma', 'interactive', 'safe_personal', 'closure'];
const BLUEPRINT_15 = ['opener', 'dilemma', 'scenario', 'interactive', 'safe_personal', 'dilemma', 'perspective', 'safe_personal', 'closure'];
const BLUEPRINT_30 = [
  'opener',
  'scenario',
  'dilemma',
  'scenario',
  'interactive',
  'safe_personal',
  'dilemma',
  'perspective',
  'safe_personal',
  'interactive',
  'scenario',
  'dilemma',
  'safe_personal',
  'closure'
];

export function getFirstMeetingBlueprint(duration: string, roundIndex: number = 0): string[] {
  if (duration === '5min') return BLUEPRINT_5;
  if (duration === '15min') return BLUEPRINT_15;
  if (duration === '30min') return BLUEPRINT_30;
  
  // Unlimited rounds of 5 items
  if (roundIndex === 0) {
    return ['opener', 'dilemma', 'interactive', 'safe_personal', 'closure'];
  } else if (roundIndex % 3 === 1) {
    return ['scenario', 'dilemma', 'perspective', 'safe_personal', 'closure'];
  } else if (roundIndex % 3 === 2) {
    return ['scenario', 'interactive', 'dilemma', 'safe_personal', 'closure'];
  } else {
    return ['opener', 'scenario', 'interactive', 'perspective', 'closure'];
  }
}

/**
 * Score a candidate item for a specific blueprint slot.
 * 
 * Strict selection order:
 * dating_stage
 * → primary_sphere / compatible_spheres
 * → duration_fit
 * → passend session blueprint
 * → vereist contenttype
 * → session_position
 * → intensity
 * → energy
 * → topic-diversiteit
 * → repeat_group
 * → pair/user history
 */
function scoreItemForSlot(
  item: RawEersteOntmoetingItem,
  requiredType: string,
  targetSphere: string,
  durationStr: string,
  slotIndex: number,
  totalSlots: number,
  sessionIds: Set<string>,
  sessionRepeatGroups: Set<string>,
  recentTopics: string[],
  history: PlayHistoryMap
): number {
  let score = 0;

  // 1. Primary sphere (+100) vs Compatible sphere (+35)
  if (item.primary_sphere === targetSphere) {
    score += 100;
  } else if (item.compatible_spheres.includes(targetSphere)) {
    score += 35;
  } else {
    score += 5;
  }

  // 2. Duration fit (+20)
  if (item.durations.includes(durationStr) || item.durations.includes('unlimited')) {
    score += 20;
  }

  // 3. User & Pair History Priority
  const historyRecord = history[item.id];
  if (!historyRecord) {
    score += 50; // Brand new, never seen by this duo
  } else {
    if (isPromptOnCooldown(historyRecord)) {
      score -= 30; // On cooldown
    } else {
      score -= Math.min(15, historyRecord.timesPlayed * 3);
    }
  }

  // 4. Topic Diversity
  if (recentTopics.includes(item.topic)) {
    const distFromEnd = recentTopics.length - 1 - recentTopics.lastIndexOf(item.topic);
    if (distFromEnd === 0) {
      score -= 25; // Don't repeat the exact same topic back to back
    } else {
      score -= 10;
    }
  } else {
    score += 20; // New topic for this session
  }

  // 5. Repeat Group Safety
  if (sessionRepeatGroups.has(item.repeat_group)) {
    score -= 100; // Heavily penalize duplicate repeat_group in same session
  }

  // 6. Intensity Curve according to session position
  const progress = slotIndex / (totalSlots - 1 || 1);
  if (progress <= 0.25) {
    // Early session: prefer light
    if (item.intensity === 'light') score += 15;
  } else if (progress <= 0.8) {
    // Mid session: light_medium is welcome
    if (item.intensity === 'light_medium') score += 10;
    else score += 5;
  } else {
    // Ending: prefer light warm closure
    if (item.intensity === 'light') score += 15;
  }

  // 7. Energy Tone Alignment
  if (targetSphere === 'laughing_light' && item.energy === 'playful') score += 15;
  if (targetSphere === 'learning_wonder' && (item.energy === 'curious' || item.energy === 'warm')) score += 15;
  if (targetSphere === 'flirting_tension' && (item.energy === 'flirty' || item.energy === 'playful')) score += 15;
  if (targetSphere === 'deeper_connection' && (item.energy === 'reflective' || item.energy === 'warm')) score += 15;
  if (targetSphere === 'unexpected_surprising' && (item.energy === 'surprising' || item.energy === 'playful')) score += 15;

  return score;
}

/**
 * Builds a curated session for `first_meeting` with strict blueprint adherence,
 * zero AI generation, exact repeat_group isolation, and history tracking.
 */
export function buildFirstMeetingSession(
  config: SessionConfig,
  history: PlayHistoryMap,
  roundIndex: number = 0,
  priorSessionRepeatGroups: Set<string> = new Set(),
  priorSessionIds: Set<string> = new Set()
): PromptItem[] {
  const durationStr = config.duration === '5min' ? '5' : config.duration === '15min' ? '15' : config.duration === '30min' ? '30' : 'unlimited';
  const blueprint = getFirstMeetingBlueprint(config.duration, roundIndex);
  const targetSphere = vibeToSphere(config.vibe);

  const selectedRawItems: RawEersteOntmoetingItem[] = [];
  const sessionIds = new Set<string>(priorSessionIds);
  const sessionRepeatGroups = new Set<string>(priorSessionRepeatGroups);
  const recentTopics: string[] = [];

  for (let slotIdx = 0; slotIdx < blueprint.length; slotIdx++) {
    const requiredType = blueprint[slotIdx];

    // Filter candidate pool by required content type
    let candidates = APPROVED_EERSTE_ONTMOETING_ITEMS.filter((item) => {
      if (item.type !== requiredType) return false;
      if (sessionIds.has(item.id)) return false;
      // Repeat group must not be duplicated in the same session
      if (sessionRepeatGroups.has(item.repeat_group)) return false;
      return true;
    });

    // Fallback 1: If all repeat groups for this type are used, allow unseen item IDs
    if (candidates.length === 0) {
      candidates = APPROVED_EERSTE_ONTMOETING_ITEMS.filter((item) => {
        if (item.type !== requiredType) return false;
        if (sessionIds.has(item.id)) return false;
        return true;
      });
    }

    // Fallback 2: If all items of this type have been seen in this session, fallback to any item of this type
    if (candidates.length === 0) {
      candidates = APPROVED_EERSTE_ONTMOETING_ITEMS.filter((item) => item.type === requiredType);
    }

    // Score and rank candidates
    const scoredCandidates = candidates.map((item) => ({
      item,
      score: scoreItemForSlot(
        item,
        requiredType,
        targetSphere,
        durationStr,
        slotIdx,
        blueprint.length,
        sessionIds,
        sessionRepeatGroups,
        recentTopics,
        history
      )
    }));

    // Deterministic sort: highest score, tie-break by ID
    scoredCandidates.sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));

    const chosen = scoredCandidates[0].item;
    selectedRawItems.push(chosen);
    sessionIds.add(chosen.id);
    sessionRepeatGroups.add(chosen.repeat_group);
    recentTopics.push(chosen.topic);
  }

  return selectedRawItems.map(rawItemToPromptItem);
}

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  PromptItem, 
  SessionConfig, 
  SessionStats, 
  InteractionType, 
  PlayHistoryMap,
  PlayHistoryRecord,
  HistoryOutcome
} from '../types';
import { PROMPTS_DATABASE } from '../data/prompts';
import { safeGetPlayHistory, safeSavePlayHistory } from '../utils/storage';

export const COOLDOWN_COMPLETED_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const COOLDOWN_SKIPPED_MS = 7 * 24 * 60 * 60 * 1000;    // 7 days
export const COOLDOWN_SHOWN_MS = 24 * 60 * 60 * 1000;          // 1 day

/**
 * Load local play history map with validated schema
 */
export function getPlayHistory(): PlayHistoryMap {
  return safeGetPlayHistory();
}

/**
 * Check if a prompt record is still within its outcome-specific cooldown window
 */
export function isPromptOnCooldown(record?: PlayHistoryRecord, now: number = Date.now()): boolean {
  if (!record || !record.lastPlayedAt) return false;
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

/**
 * Record a prompt as played with timestamp and outcome (shown, completed, skipped)
 */
export function recordPromptPlayed(promptId: string, outcome: HistoryOutcome = 'shown'): void {
  const history = safeGetPlayHistory();
  const existing = history[promptId] || { lastPlayedAt: 0, timesPlayed: 0 };
  history[promptId] = {
    lastPlayedAt: Date.now(),
    timesPlayed: existing.timesPlayed + 1,
    outcome
  };
  safeSavePlayHistory(history);
}

/**
 * Deterministic string hash to replace Math.random() for reproducible testing and stable ordering
 */
export function getPromptStableHash(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTargetStepCount(duration: string): number {
  if (duration === '5min') return 5;
  if (duration === '15min') return 9;
  if (duration === '30min') return 14;
  if (duration === 'unlimited') return 16;
  return 9;
}

export interface ArcTarget {
  minIntensity: number;
  maxIntensity: number;
  preferredTypes: InteractionType[];
  stageName: string;
  isEnding: boolean;
}

/**
 * Refined 6-phase emotional arc:
 * 1. Warm-up
 * 2. Luchtig & Speels
 * 3. Nieuwsgierigheid
 * 4. Persoonlijke Connectie
 * 5. Piekmoment
 * 6. Positieve Landing (always end warm, grounded and positive!)
 */
export function getTargetIntensityAndType(
  stepIndex: number,
  totalSteps: number,
  intensitySetting: string,
  adaptiveIntensityBias: number = 0
): ArcTarget {
  const progress = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;

  let baseMax = 3;
  if (intensitySetting === 'easy') baseMax = 2;
  if (intensitySetting === 'deep') baseMax = 5;

  // Apply adaptive intensity bias (-1, 0, +1)
  const maxAllowed = Math.max(1, Math.min(5, baseMax + adaptiveIntensityBias));

  if (progress <= 0.18) {
    // Phase 1: Warm-up
    return {
      minIntensity: 1,
      maxIntensity: Math.min(2, maxAllowed),
      preferredTypes: ['ask', 'rapid_fire', 'point'],
      stageName: 'Warm-up',
      isEnding: false
    };
  } else if (progress <= 0.38) {
    // Phase 2: Luchtig & Speels
    return {
      minIntensity: 1,
      maxIntensity: Math.min(2, maxAllowed),
      preferredTypes: ['both_answer', 'point', 'would_you_rather', 'secret_pick'],
      stageName: 'Luchtig & Speels',
      isEnding: false
    };
  } else if (progress <= 0.58) {
    // Phase 3: Nieuwsgierigheid
    return {
      minIntensity: Math.min(2, maxAllowed),
      maxIntensity: Math.min(3, maxAllowed),
      preferredTypes: ['guess', 'ask', 'finish_the_sentence', 'secret_pick'],
      stageName: 'Nieuwsgierigheid',
      isEnding: false
    };
  } else if (progress <= 0.75) {
    // Phase 4: Persoonlijke Connectie
    return {
      minIntensity: Math.min(2, maxAllowed),
      maxIntensity: maxAllowed,
      preferredTypes: ['ask', 'both_answer', 'reveal', 'finish_the_sentence'],
      stageName: 'Persoonlijke Connectie',
      isEnding: false
    };
  } else if (progress < 0.90) {
    // Phase 5: Piekmoment (chemie / betekenisvolle uitdaging)
    return {
      minIntensity: Math.min(2, maxAllowed),
      maxIntensity: maxAllowed,
      preferredTypes: ['reveal', 'challenge', 'would_you_rather', 'ask'],
      stageName: 'Piekmoment',
      isEnding: false
    };
  } else {
    // Phase 6: Positieve Landing (warmte, compliment, toast, mooie blik vooruit)
    return {
      minIntensity: 1,
      maxIntensity: Math.min(2, maxAllowed),
      preferredTypes: ['ask', 'challenge', 'both_answer'],
      stageName: 'Positieve Landing',
      isEnding: true
    };
  }
}

export interface AdaptiveScoringContext {
  lastInteractionType?: InteractionType;
  usedInteractionTypes?: InteractionType[];
  adaptiveIntensityBias?: number;
  consecutiveSkips?: number;
  isAfterDeepSkip?: boolean;
  laughedCount?: number;
  playfulBias?: number;
  sessionFavorites?: Set<string>;
}

/**
 * Score candidate prompt deterministically based on emotional arc, active state,
 * playfulBias (laughter), skip history, relationship stage, vibe, cooldown and favorites.
 */
export function scoreCandidatePrompt(
  prompt: PromptItem,
  arc: ArcTarget,
  config: SessionConfig,
  history: PlayHistoryMap,
  context: AdaptiveScoringContext = {}
): number {
  let score = 20;
  const {
    lastInteractionType,
    consecutiveSkips = 0,
    isAfterDeepSkip = false,
    playfulBias = 0,
    sessionFavorites
  } = context;

  // 1. Preferred interaction type bonus
  if (arc.preferredTypes.includes(prompt.interactionType)) {
    score += 8;
  }

  // Avoid repeating the exact same interaction type consecutively
  if (lastInteractionType && prompt.interactionType === lastInteractionType) {
    score -= 12;
  }

  // 2. Intensity match
  if (prompt.intensity >= arc.minIntensity && prompt.intensity <= arc.maxIntensity) {
    score += 10;
  } else {
    const targetMid = (arc.minIntensity + arc.maxIntensity) / 2;
    score -= Math.abs(prompt.intensity - targetMid) * 5;
  }

  // 3. Skip Direct Effect (Requirement 4)
  // When an intense prompt was skipped, heavily penalize high intensity on the immediate next prompt
  if (isAfterDeepSkip && prompt.intensity >= 3) {
    score -= 30;
  }

  // After two consecutive skips, trigger safe reset: heavily prioritize warmup or playful card (intensity <= 2)
  if (consecutiveSkips >= 2) {
    if (prompt.emotionalTone === 'warmup' || prompt.emotionalTone === 'playful') {
      score += 35;
    }
    if (prompt.intensity > 2) {
      score -= 30;
    }
  }

  // 4. Laughter / Playful Bias (Requirement 3)
  if (playfulBias > 0) {
    const playfulTypes: InteractionType[] = ['point', 'rapid_fire', 'challenge', 'would_you_rather', 'secret_pick'];
    if (playfulTypes.includes(prompt.interactionType)) {
      score += playfulBias * 4;
    }
    const playfulTags = ['humor', 'luchtig', 'spel', 'blunder'];
    if (prompt.tags.some(t => playfulTags.includes(t)) || prompt.emotionalTone === 'playful') {
      score += playfulBias * 4;
    }
  }

  // 5. Emotional Tone active scoring (Requirement 6)
  if (arc.isEnding) {
    if (prompt.emotionalTone === 'positive_landing' || prompt.tags.includes('afsluiting') || prompt.tags.includes('waardering') || prompt.tags.includes('compliment')) {
      score += 35;
    }
    // Strongly penalize super heavy vulnerability at the very end
    if (prompt.intensity >= 4 || prompt.emotionalTone === 'vulnerable' || prompt.tags.includes('eenzaamheid') || prompt.tags.includes('verdriet')) {
      score -= 40;
    }
  } else {
    switch (arc.stageName) {
      case 'Warm-up':
        if (prompt.emotionalTone === 'warmup') score += 14;
        else if (prompt.emotionalTone === 'playful') score += 8;
        break;
      case 'Luchtig & Speels':
        if (prompt.emotionalTone === 'playful') score += 15;
        else if (prompt.emotionalTone === 'warmup') score += 6;
        break;
      case 'Nieuwsgierigheid':
        if (prompt.emotionalTone === 'curious') score += 14;
        else if (prompt.emotionalTone === 'playful') score += 6;
        break;
      case 'Persoonlijke Connectie':
        if (prompt.emotionalTone === 'curious' || prompt.emotionalTone === 'vulnerable') score += 12;
        break;
      case 'Piekmoment':
        if (prompt.emotionalTone === 'peak') score += 16;
        else if (prompt.emotionalTone === 'vulnerable') score += 8;
        break;
    }
  }

  // 6. Relationship Stage Matching & Date First Guard (Requirement 5)
  if (config.relationshipStage && config.relationshipStage !== 'any') {
    if (prompt.relationshipStages?.includes(config.relationshipStage)) {
      score += 14;
    } else if (prompt.relationshipStages?.includes('any')) {
      score += 4;
    } else if (prompt.relationshipStages && prompt.relationshipStages.length > 0) {
      score -= 10;
    }

    // Safety guard: first date must never receive inappropriate heavy prompts
    if (config.relationshipStage === 'date_first' && prompt.intensity >= 4) {
      score -= 50;
    }
  }

  // 7. Explicit Vibe Differentiation
  switch (config.vibe) {
    case 'lachen':
      if (['point', 'rapid_fire', 'would_you_rather', 'secret_pick'].includes(prompt.interactionType)) score += 9;
      if (prompt.tags.some(t => ['humor', 'blunder', 'luchtig', 'spel'].includes(t))) score += 7;
      break;

    case 'leren_kennen':
      if (['ask', 'guess', 'both_answer'].includes(prompt.interactionType)) score += 8;
      if (prompt.tags.some(t => ['ijsbreker', 'persoonlijkheid', 'gewoontes', 'dromen', 'interesses'].includes(t))) score += 6;
      break;

    case 'flirten':
      if (['guess', 'reveal', 'point', 'challenge', 'secret_pick'].includes(prompt.interactionType)) score += 8;
      if (prompt.tags.some(t => ['flirten', 'chemie', 'romantiek', 'aantrekkingskracht', 'eerste-indruk'].includes(t))) score += 8;
      break;

    case 'dieper':
      if (['ask', 'finish_the_sentence', 'both_answer', 'reveal'].includes(prompt.interactionType)) score += 8;
      if (prompt.tags.some(t => ['diepgang', 'emotie', 'waarden', 'verbinding', 'herinnering'].includes(t))) score += 8;
      break;

    case 'verrassend':
      if (['challenge', 'guess', 'point', 'rapid_fire', 'reveal', 'secret_pick'].includes(prompt.interactionType)) score += 10;
      if (prompt.tags.some(t => ['verrassend', 'spel', 'onverwacht', 'keuze'].includes(t))) score += 6;
      break;
  }

  // 8. Session Favorites subtle influence (Requirement 8)
  if (sessionFavorites && sessionFavorites.size > 0) {
    const favoritedPrompts = PROMPTS_DATABASE.filter(p => sessionFavorites.has(p.id));
    const favTags = new Set(favoritedPrompts.flatMap(p => p.tags));
    const favTypes = new Set(favoritedPrompts.map(p => p.interactionType));
    if (favTypes.has(prompt.interactionType)) {
      score += 4;
    }
    if (prompt.tags.some(t => favTags.has(t))) {
      score += 3;
    }
  }

  // 9. Play History Cooldown (Requirement 7)
  const playedRecord = history[prompt.id];
  if (playedRecord) {
    if (isPromptOnCooldown(playedRecord)) {
      score -= 30;
    } else {
      score -= Math.min(10, playedRecord.timesPlayed * 2);
    }
  }

  // Deterministic fractional tie-breaker based on ID hash
  score += (getPromptStableHash(prompt.id) % 100) * 0.01;

  return score;
}

/**
 * Select a single adaptive prompt using realtime session state, preventing duplicates
 * and applying all emotional arc, skip, laughter, stage, and cooldown criteria.
 */
export function selectAdaptivePrompt(
  stepIndex: number,
  totalSteps: number,
  config: SessionConfig,
  history: PlayHistoryMap,
  context: {
    usedPromptIds: Set<string>;
    usedInteractionTypes?: InteractionType[];
    lastPrompt?: PromptItem;
    adaptiveIntensityBias?: number;
    consecutiveSkips?: number;
    isAfterDeepSkip?: boolean;
    laughedCount?: number;
    playfulBias?: number;
    sessionFavorites?: Set<string>;
  }
): PromptItem {
  const arc = getTargetIntensityAndType(
    stepIndex,
    totalSteps,
    config.intensity,
    context.adaptiveIntensityBias ?? 0
  );

  // Filter candidate pool strictly
  let candidatePool = PROMPTS_DATABASE.filter((item) => {
    // 1. Relationship match
    const relMatch =
      config.relationship === 'surprise' ||
      item.relationshipType.includes(config.relationship);

    if (!relMatch) return false;

    // 2. Strictly enforce Premium Lock (NEVER allow free users to access premium)
    if (item.premium && !config.isPremiumUnlocked) {
      return false;
    }

    // 3. Easy mode safeguard: never allow intensity 4 or 5
    if (config.intensity === 'easy' && item.intensity >= 4) {
      return false;
    }

    // 4. Date first safeguard: never allow intensity 4 or 5
    if (config.relationshipStage === 'date_first' && item.intensity >= 4) {
      return false;
    }

    return true;
  });

  // Emergency safe fallback pool if candidatePool is empty
  if (candidatePool.length === 0) {
    candidatePool = PROMPTS_DATABASE.filter((item) => {
      if (item.premium && !config.isPremiumUnlocked) return false;
      if (config.intensity === 'easy' && item.intensity >= 4) return false;
      if (config.relationshipStage === 'date_first' && item.intensity >= 4) return false;
      return !item.premium && item.intensity <= 2;
    });
  }

  // Filter out prompts already used in this session to prevent duplicates
  let available = candidatePool.filter((p) => !context.usedPromptIds.has(p.id));

  // If available unique prompts exhausted, recycle safely without breaking premium/intensity rules
  if (available.length === 0) {
    available = candidatePool;
  }

  // Separate cooldown candidates from fresh candidates if possible
  const freshCandidates = available.filter((p) => !isPromptOnCooldown(history[p.id]));
  const poolToScore = freshCandidates.length >= 2 ? freshCandidates : available;

  const scoringContext: AdaptiveScoringContext = {
    lastInteractionType: context.lastPrompt?.interactionType,
    usedInteractionTypes: context.usedInteractionTypes,
    adaptiveIntensityBias: context.adaptiveIntensityBias ?? 0,
    consecutiveSkips: context.consecutiveSkips ?? 0,
    isAfterDeepSkip: context.isAfterDeepSkip ?? false,
    playfulBias: context.playfulBias ?? 0,
    laughedCount: context.laughedCount ?? 0,
    sessionFavorites: context.sessionFavorites
  };

  const scored = poolToScore.map((p) => ({
    prompt: p,
    score: scoreCandidatePrompt(p, arc, config, history, scoringContext)
  }));

  // Deterministic sort: primary by score, secondary by prompt id
  scored.sort((a, b) => (b.score - a.score) || a.prompt.id.localeCompare(b.prompt.id));

  return scored[0].prompt;
}

/**
 * Curate full session sequentially using selectAdaptivePrompt.
 * Guarantees zero premium leakage, strict safety in easy mode, and full targetCount.
 */
export function buildCuratedSession(config: SessionConfig): PromptItem[] {
  const targetCount = getTargetStepCount(config.duration);
  const history = getPlayHistory();
  const selectedPrompts: PromptItem[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < targetCount; i++) {
    const prompt = selectAdaptivePrompt(i, targetCount, config, history, {
      usedPromptIds: usedIds,
      lastPrompt: selectedPrompts[selectedPrompts.length - 1],
      adaptiveIntensityBias: 0,
      consecutiveSkips: 0,
      playfulBias: 0
    });
    selectedPrompts.push(prompt);
    usedIds.add(prompt.id);
  }

  return selectedPrompts;
}

interface SessionEngineState {
  currentPromptIndex: number;
  targetCount: number;
  prompts: PromptItem[];
  globalFavorites: Set<string>;
  sessionFavorites: Set<string>;
  laughedCount: number;
  skippedCount: number;
  completedPromptIds: string[];
  elapsedSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  interactionData: Record<string, unknown>;
  // Adaptive in-session tuning
  adaptiveIntensityBias: number; // -1 to +1
  consecutiveSkips: number;
  isAfterDeepSkip: boolean;
  playfulBias: number;
}

export function useSessionEngine(
  config: SessionConfig,
  options?: {
    initialFavorites?: string[];
    onToggleGlobalFavorite?: (id: string) => void;
  }
) {
  const [state, setState] = useState<SessionEngineState>(() => {
    const target = getTargetStepCount(config.duration);
    const history = getPlayHistory();
    const firstPrompt = selectAdaptivePrompt(0, target, config, history, {
      usedPromptIds: new Set<string>()
    });

    return {
      currentPromptIndex: 0,
      targetCount: target,
      prompts: [firstPrompt],
      globalFavorites: new Set<string>(options?.initialFavorites || []),
      sessionFavorites: new Set<string>(),
      laughedCount: 0,
      skippedCount: 0,
      completedPromptIds: [],
      elapsedSeconds: 0,
      isPaused: false,
      isCompleted: false,
      interactionData: {},
      adaptiveIntensityBias: 0,
      consecutiveSkips: 0,
      isAfterDeepSkip: false,
      playfulBias: 0
    };
  });

  // Reset engine when config changes (e.g. user restarts with new duration or settings)
  useEffect(() => {
    const target = getTargetStepCount(config.duration);
    const history = getPlayHistory();
    const firstPrompt = selectAdaptivePrompt(0, target, config, history, {
      usedPromptIds: new Set<string>()
    });

    setState((prev) => ({
      ...prev,
      targetCount: target,
      prompts: [firstPrompt],
      currentPromptIndex: 0,
      sessionFavorites: new Set<string>(),
      completedPromptIds: [],
      isCompleted: false,
      isPaused: false,
      adaptiveIntensityBias: 0,
      consecutiveSkips: 0,
      isAfterDeepSkip: false,
      playfulBias: 0
    }));
  }, [config]);

  // Sync global favorites if updated from outside
  useEffect(() => {
    if (options?.initialFavorites) {
      setState((prev) => ({
        ...prev,
        globalFavorites: new Set<string>(options.initialFavorites)
      }));
    }
  }, [options?.initialFavorites]);

  // Record prompt played in local cooldown history upon encountering it
  const currentPrompt = state.prompts[state.currentPromptIndex] || null;
  const recordedPromptIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (currentPrompt && !recordedPromptIdsRef.current.has(currentPrompt.id)) {
      recordedPromptIdsRef.current.add(currentPrompt.id);
      recordPromptPlayed(currentPrompt.id, 'shown');
    }
  }, [currentPrompt]);

  // Elapsed timer
  useEffect(() => {
    if (state.isPaused || state.isCompleted) return;

    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isPaused, state.isCompleted]);

  // Current phase name based on emotional arc
  const currentPhase = useMemo(() => {
    if (!state.prompts.length) return 'Start';
    const info = getTargetIntensityAndType(
      state.currentPromptIndex,
      state.targetCount,
      config.intensity,
      state.adaptiveIntensityBias
    );
    return info.stageName;
  }, [state.currentPromptIndex, state.targetCount, config.intensity, state.adaptiveIntensityBias]);

  // Realtime Adaptive Next prompt
  const nextPrompt = useCallback(() => {
    setState((prev) => {
      const cur = prev.prompts[prev.currentPromptIndex];
      if (cur) {
        recordPromptPlayed(cur.id, 'completed');
      }

      const completedIds = cur ? [...prev.completedPromptIds, cur.id] : prev.completedPromptIds;
      const nextIndex = prev.currentPromptIndex + 1;

      if (nextIndex >= prev.targetCount) {
        return {
          ...prev,
          completedPromptIds: completedIds,
          isCompleted: true
        };
      }

      // Decay playfulBias gradually upon next prompt
      const nextPlayfulBias = Math.max(0, prev.playfulBias - 1);

      // If next prompt was already chosen (e.g. user clicked Previous earlier and now clicks Next), use it
      if (prev.prompts[nextIndex]) {
        return {
          ...prev,
          currentPromptIndex: nextIndex,
          completedPromptIds: completedIds,
          consecutiveSkips: 0,
          isAfterDeepSkip: false,
          playfulBias: nextPlayfulBias
        };
      }

      // Dynamically select the next prompt using current realtime state
      const usedIds = new Set(prev.prompts.map((p) => p.id));
      const usedTypes = prev.prompts.map((p) => p.interactionType);
      const history = getPlayHistory();

      const nextItem = selectAdaptivePrompt(nextIndex, prev.targetCount, config, history, {
        usedPromptIds: usedIds,
        usedInteractionTypes: usedTypes,
        lastPrompt: cur,
        adaptiveIntensityBias: prev.adaptiveIntensityBias,
        consecutiveSkips: 0,
        isAfterDeepSkip: false,
        playfulBias: nextPlayfulBias,
        sessionFavorites: prev.sessionFavorites
      });

      return {
        ...prev,
        prompts: [...prev.prompts, nextItem],
        currentPromptIndex: nextIndex,
        completedPromptIds: completedIds,
        consecutiveSkips: 0,
        isAfterDeepSkip: false,
        playfulBias: nextPlayfulBias
      };
    });
  }, [config]);

  // Realtime Adaptive Skip prompt
  const skipPrompt = useCallback(() => {
    setState((prev) => {
      const cur = prev.prompts[prev.currentPromptIndex];
      if (cur) {
        recordPromptPlayed(cur.id, 'skipped');
      }

      const isDeep = cur ? cur.intensity >= 3 : false;
      const nextConsecutiveSkips = prev.consecutiveSkips + 1;
      const nextIndex = prev.currentPromptIndex + 1;

      // Adaptively reduce intensity if skipped repeatedly or if a deep question was skipped
      let nextBias = prev.adaptiveIntensityBias;
      if (nextConsecutiveSkips >= 2 || isDeep) {
        nextBias = Math.max(-1, prev.adaptiveIntensityBias - 1);
      }

      const nextPlayfulBias = Math.max(0, prev.playfulBias - 1);

      if (nextIndex >= prev.targetCount) {
        return {
          ...prev,
          skippedCount: prev.skippedCount + 1,
          isCompleted: true,
          consecutiveSkips: nextConsecutiveSkips,
          adaptiveIntensityBias: nextBias,
          isAfterDeepSkip: isDeep,
          playfulBias: nextPlayfulBias
        };
      }

      // Dynamically select next prompt with immediate adaptation for deep skip and consecutive skips
      const usedIds = new Set(prev.prompts.map((p) => p.id));
      const usedTypes = prev.prompts.map((p) => p.interactionType);
      const history = getPlayHistory();

      const nextItem = selectAdaptivePrompt(nextIndex, prev.targetCount, config, history, {
        usedPromptIds: usedIds,
        usedInteractionTypes: usedTypes,
        lastPrompt: cur,
        adaptiveIntensityBias: nextBias,
        consecutiveSkips: nextConsecutiveSkips,
        isAfterDeepSkip: isDeep,
        playfulBias: nextPlayfulBias,
        sessionFavorites: prev.sessionFavorites
      });

      return {
        ...prev,
        prompts: [...prev.prompts.slice(0, nextIndex), nextItem],
        skippedCount: prev.skippedCount + 1,
        currentPromptIndex: nextIndex,
        consecutiveSkips: nextConsecutiveSkips,
        adaptiveIntensityBias: nextBias,
        isAfterDeepSkip: isDeep,
        playfulBias: nextPlayfulBias
      };
    });
  }, [config]);

  const previousPrompt = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPromptIndex: Math.max(0, prev.currentPromptIndex - 1)
    }));
  }, []);

  // Toggle favorite: Keep session favorites and global favorites cleanly separated
  const toggleFavorite = useCallback((promptId: string) => {
    setState((prev) => {
      const nextGlobal = new Set(prev.globalFavorites);
      const nextSession = new Set(prev.sessionFavorites);

      if (nextGlobal.has(promptId)) {
        nextGlobal.delete(promptId);
        nextSession.delete(promptId);
      } else {
        nextGlobal.add(promptId);
        nextSession.add(promptId);
      }

      const curPrompt = prev.prompts.find((p) => p.id === promptId);
      let nextBias = prev.adaptiveIntensityBias;
      if (curPrompt && curPrompt.intensity >= 3 && nextSession.has(promptId)) {
        nextBias = Math.min(1, prev.adaptiveIntensityBias + 1);
      }

      return { 
        ...prev, 
        globalFavorites: nextGlobal, 
        sessionFavorites: nextSession,
        adaptiveIntensityBias: nextBias
      };
    });

    options?.onToggleGlobalFavorite?.(promptId);
  }, [options]);

  // Record laugh: Introduces immediate playful bias to influence subsequent selections
  const recordLaugh = useCallback(() => {
    setState((prev) => ({
      ...prev,
      laughedCount: prev.laughedCount + 1,
      playfulBias: Math.min(4, prev.playfulBias + 2)
    }));
  }, []);

  const recordInteraction = useCallback((promptId: string, data: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      interactionData: {
        ...prev.interactionData,
        [promptId]: data
      }
    }));
  }, []);

  const togglePause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  const finishSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isCompleted: true
    }));
  }, []);

  const startCustomSession = useCallback((customPrompts: PromptItem[]) => {
    setState({
      currentPromptIndex: 0,
      targetCount: customPrompts.length,
      prompts: customPrompts,
      globalFavorites: new Set<string>(options?.initialFavorites || []),
      sessionFavorites: new Set<string>(),
      laughedCount: 0,
      skippedCount: 0,
      completedPromptIds: [],
      elapsedSeconds: 0,
      isPaused: false,
      isCompleted: false,
      interactionData: {},
      adaptiveIntensityBias: 0,
      consecutiveSkips: 0,
      isAfterDeepSkip: false,
      playfulBias: 0
    });
  }, [options?.initialFavorites]);

  const restartSession = useCallback(() => {
    const target = getTargetStepCount(config.duration);
    const history = getPlayHistory();
    const firstPrompt = selectAdaptivePrompt(0, target, config, history, {
      usedPromptIds: new Set<string>()
    });

    setState({
      currentPromptIndex: 0,
      targetCount: target,
      prompts: [firstPrompt],
      globalFavorites: new Set<string>(options?.initialFavorites || []),
      sessionFavorites: new Set<string>(),
      laughedCount: 0,
      skippedCount: 0,
      completedPromptIds: [],
      elapsedSeconds: 0,
      isPaused: false,
      isCompleted: false,
      interactionData: {},
      adaptiveIntensityBias: 0,
      consecutiveSkips: 0,
      isAfterDeepSkip: false,
      playfulBias: 0
    });
  }, [config, options?.initialFavorites]);

  // Session Stats correctly distinguishes items favorited during THIS session vs historical
  const stats: SessionStats = useMemo(
    () => ({
      promptsCompleted: state.completedPromptIds.length,
      laughedCount: state.laughedCount,
      favoritesCount: state.sessionFavorites.size,
      durationSeconds: state.elapsedSeconds,
      favoritePromptIds: Array.from(state.sessionFavorites),
      sessionFavoriteIds: Array.from(state.sessionFavorites)
    }),
    [state.completedPromptIds.length, state.laughedCount, state.sessionFavorites, state.elapsedSeconds]
  );

  return {
    currentPrompt,
    currentPromptIndex: state.currentPromptIndex,
    totalPrompts: state.targetCount,
    currentPhase,
    isFavorite: currentPrompt ? state.globalFavorites.has(currentPrompt.id) : false,
    favoritesList: Array.from(state.globalFavorites),
    sessionFavoritesList: Array.from(state.sessionFavorites),
    isPaused: state.isPaused,
    isCompleted: state.isCompleted,
    elapsedSeconds: state.elapsedSeconds,
    laughedCount: state.laughedCount,
    interactionData: state.interactionData,
    stats,
    // Actions
    nextPrompt,
    skipPrompt,
    previousPrompt,
    toggleFavorite,
    recordLaugh,
    recordInteraction,
    togglePause,
    finishSession,
    restartSession,
    startCustomSession
  };
}

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  PromptItem, 
  SessionConfig, 
  SessionStats, 
  InteractionType, 
  PlayHistoryMap 
} from '../types';
import { PROMPTS_DATABASE } from '../data/prompts';
import { safeGetPlayHistory, safeSavePlayHistory } from '../utils/storage';

const COOLDOWN_DAYS = 30;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

/**
 * Load local play history map with validated schema
 */
export function getPlayHistory(): PlayHistoryMap {
  return safeGetPlayHistory();
}

/**
 * Record a prompt as played with timestamp
 */
export function recordPromptPlayed(promptId: string): void {
  const history = safeGetPlayHistory();
  const existing = history[promptId] || { lastPlayedAt: 0, timesPlayed: 0 };
  history[promptId] = {
    lastPlayedAt: Date.now(),
    timesPlayed: existing.timesPlayed + 1
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

interface ArcTarget {
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

/**
 * Score candidate prompt deterministically based on relationship stage, vibe, intensity, cooldown and variety
 */
function scoreCandidatePrompt(
  prompt: PromptItem,
  arc: ArcTarget,
  config: SessionConfig,
  history: PlayHistoryMap,
  lastInteractionType?: InteractionType
): number {
  let score = 20;

  // 1. Preferred interaction type bonus
  if (arc.preferredTypes.includes(prompt.interactionType)) {
    score += 8;
  }

  // Avoid repeating the exact same interaction type consecutively
  if (lastInteractionType && prompt.interactionType === lastInteractionType) {
    score -= 10;
  }

  // 2. Intensity match
  if (prompt.intensity >= arc.minIntensity && prompt.intensity <= arc.maxIntensity) {
    score += 10;
  } else {
    const targetMid = (arc.minIntensity + arc.maxIntensity) / 2;
    score -= Math.abs(prompt.intensity - targetMid) * 4;
  }

  // 3. Positieve Landing bonus in final step
  if (arc.isEnding) {
    if (prompt.emotionalTone === 'positive_landing' || prompt.tags.includes('afsluiting') || prompt.tags.includes('waardering') || prompt.tags.includes('compliment')) {
      score += 25;
    }
    // Strongly penalize super heavy vulnerability at the very end
    if (prompt.intensity >= 4 || prompt.tags.includes('eenzaamheid') || prompt.tags.includes('verdriet')) {
      score -= 30;
    }
  }

  // 4. Relationship Stage Matching
  if (config.relationshipStage && config.relationshipStage !== 'any') {
    if (prompt.relationshipStages?.includes(config.relationshipStage)) {
      score += 12;
    } else if (prompt.relationshipStages?.includes('any')) {
      score += 4;
    } else if (prompt.relationshipStages && prompt.relationshipStages.length > 0) {
      score -= 8;
    }
  }

  // 5. Explicit Vibe Differentiation
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

  // 6. Play History Cooldown
  const playedRecord = history[prompt.id];
  if (playedRecord) {
    const elapsed = Date.now() - playedRecord.lastPlayedAt;
    if (elapsed < COOLDOWN_MS) {
      score -= 25;
    } else {
      score -= Math.min(10, playedRecord.timesPlayed * 2);
    }
  }

  // Deterministic fractional tie-breaker based on ID hash
  score += (getPromptStableHash(prompt.id) % 100) * 0.01;

  return score;
}

/**
 * Curate session prompts based on configuration, stage, emotional arc and cooldown
 * Guarantees zero premium leakage, strict safety in easy mode, and full targetCount.
 */
export function buildCuratedSession(config: SessionConfig): PromptItem[] {
  // Determine target length
  let targetCount = 9;
  if (config.duration === '5min') targetCount = 5;
  else if (config.duration === '15min') targetCount = 9;
  else if (config.duration === '30min') targetCount = 14;
  else if (config.duration === 'unlimited') targetCount = 16;

  const history = getPlayHistory();

  // Filter candidate pool strictly
  let candidatePool = PROMPTS_DATABASE.filter((item) => {
    // 1. Relationship match
    const relMatch =
      config.relationship === 'surprise' ||
      item.relationshipType.includes(config.relationship) ||
      item.relationshipType.includes('surprise');

    if (!relMatch) return false;

    // 2. Strictly enforce Premium Lock (NEVER allow free users to access premium)
    if (item.premium && !config.isPremiumUnlocked) {
      return false;
    }

    // 3. Easy mode safeguard: never allow intensity 4 or 5
    if (config.intensity === 'easy' && item.intensity >= 4) {
      return false;
    }

    return true;
  });

  // Emergency safe fallback pool if candidatePool is empty: NEVER leak premium, NEVER exceed intensity 2
  if (candidatePool.length === 0) {
    candidatePool = PROMPTS_DATABASE.filter((item) => {
      if (item.premium && !config.isPremiumUnlocked) return false;
      if (config.intensity === 'easy' && item.intensity >= 4) return false;
      return !item.premium && item.intensity <= 2;
    });
  }

  const selectedPrompts: PromptItem[] = [];
  const usedIds = new Set<string>();
  let lastType: InteractionType | undefined = undefined;

  for (let i = 0; i < targetCount; i++) {
    const arc = getTargetIntensityAndType(i, targetCount, config.intensity);

    let available = candidatePool.filter((p) => !usedIds.has(p.id));

    // If available unique prompts exhausted but we haven't reached targetCount yet:
    // Safely reset usedIds to recycle candidatePool without ever leaking premium prompts
    if (available.length === 0) {
      usedIds.clear();
      available = candidatePool;
    }

    if (available.length === 0) break; // Theoretical absolute empty DB guard

    // Separate cooldown candidates from fresh candidates if possible
    const freshCandidates = available.filter((p) => {
      const rec = history[p.id];
      return !rec || Date.now() - rec.lastPlayedAt >= COOLDOWN_MS;
    });

    const poolToScore = freshCandidates.length >= 2 ? freshCandidates : available;

    const scored = poolToScore.map((p) => ({
      prompt: p,
      score: scoreCandidatePrompt(p, arc, config, history, lastType)
    }));

    // Deterministic sort: primary by score, secondary by prompt id
    scored.sort((a, b) => (b.score - a.score) || a.prompt.id.localeCompare(b.prompt.id));
    const chosen = scored[0].prompt;

    selectedPrompts.push(chosen);
    usedIds.add(chosen.id);
    lastType = chosen.interactionType;
  }

  return selectedPrompts;
}

interface SessionEngineState {
  currentPromptIndex: number;
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
}

export function useSessionEngine(
  config: SessionConfig,
  options?: {
    initialFavorites?: string[];
    onToggleGlobalFavorite?: (id: string) => void;
  }
) {
  const [state, setState] = useState<SessionEngineState>(() => {
    const initialPrompts = buildCuratedSession(config);
    return {
      currentPromptIndex: 0,
      prompts: initialPrompts,
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
      consecutiveSkips: 0
    };
  });

  // Track initial config changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      prompts: buildCuratedSession(config),
      currentPromptIndex: 0,
      sessionFavorites: new Set<string>(),
      completedPromptIds: [],
      isCompleted: false,
      isPaused: false,
      adaptiveIntensityBias: 0,
      consecutiveSkips: 0
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
      recordPromptPlayed(currentPrompt.id);
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
      state.prompts.length,
      config.intensity,
      state.adaptiveIntensityBias
    );
    return info.stageName;
  }, [state.currentPromptIndex, state.prompts.length, config.intensity, state.adaptiveIntensityBias]);

  // Next prompt
  const nextPrompt = useCallback(() => {
    setState((prev) => {
      const cur = prev.prompts[prev.currentPromptIndex];
      const completedIds = cur ? [...prev.completedPromptIds, cur.id] : prev.completedPromptIds;

      if (prev.currentPromptIndex + 1 >= prev.prompts.length) {
        return {
          ...prev,
          completedPromptIds: completedIds,
          isCompleted: true
        };
      }

      return {
        ...prev,
        currentPromptIndex: prev.currentPromptIndex + 1,
        completedPromptIds: completedIds,
        consecutiveSkips: 0
      };
    });
  }, []);

  // Adaptive Skip: If user skips multiple questions or deep questions, gracefully dial down upcoming intensity
  const skipPrompt = useCallback(() => {
    setState((prev) => {
      const cur = prev.prompts[prev.currentPromptIndex];
      const isDeep = cur && cur.intensity >= 3;
      const nextConsecutiveSkips = prev.consecutiveSkips + 1;

      // Adaptively reduce intensity if skipped repeatedly or if a deep question was skipped
      let nextBias = prev.adaptiveIntensityBias;
      if (nextConsecutiveSkips >= 2 || isDeep) {
        nextBias = Math.max(-1, prev.adaptiveIntensityBias - 1);
      }

      if (prev.currentPromptIndex + 1 >= prev.prompts.length) {
        return {
          ...prev,
          skippedCount: prev.skippedCount + 1,
          isCompleted: true,
          consecutiveSkips: nextConsecutiveSkips,
          adaptiveIntensityBias: nextBias
        };
      }

      return {
        ...prev,
        skippedCount: prev.skippedCount + 1,
        currentPromptIndex: prev.currentPromptIndex + 1,
        consecutiveSkips: nextConsecutiveSkips,
        adaptiveIntensityBias: nextBias
      };
    });
  }, []);

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

      const curPrompt = prev.prompts.find(p => p.id === promptId);
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

  // Record laugh: Adaptive engine remembers laughter for playful atmosphere
  const recordLaugh = useCallback(() => {
    setState((prev) => ({
      ...prev,
      laughedCount: prev.laughedCount + 1
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
      consecutiveSkips: 0
    });
  }, [options?.initialFavorites]);

  const restartSession = useCallback(() => {
    setState({
      currentPromptIndex: 0,
      prompts: buildCuratedSession(config),
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
      consecutiveSkips: 0
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
    totalPrompts: state.prompts.length,
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

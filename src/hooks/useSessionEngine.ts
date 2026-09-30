import { useState, useEffect, useCallback, useMemo } from 'react';
import { PromptItem, SessionConfig, SessionStats, InteractionType } from '../types';
import { PROMPTS_DATABASE } from '../data/prompts';

interface SessionEngineState {
  currentPromptIndex: number;
  prompts: PromptItem[];
  favorites: Set<string>;
  laughedCount: number;
  skippedCount: number;
  completedPromptIds: string[];
  elapsedSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  interactionData: Record<string, any>;
}

// Ideal arc mapping based on step percentage in a session
function getTargetIntensityAndType(
  stepIndex: number,
  totalSteps: number,
  intensitySetting: string
): { minIntensity: number; maxIntensity: number; preferredTypes: InteractionType[]; stageName: string } {
  const progress = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;

  let maxAllowed = 3;
  if (intensitySetting === 'easy') maxAllowed = 2;
  if (intensitySetting === 'deep') maxAllowed = 5;

  if (progress <= 0.2) {
    // Phase 1: Warm-up
    return {
      minIntensity: 1,
      maxIntensity: Math.min(2, maxAllowed),
      preferredTypes: ['ask', 'rapid_fire', 'point'],
      stageName: 'Warm-up'
    };
  } else if (progress <= 0.4) {
    // Phase 2: Humor & Luchtig
    return {
      minIntensity: 1,
      maxIntensity: Math.min(2, maxAllowed),
      preferredTypes: ['both_answer', 'point', 'would_you_rather'],
      stageName: 'Luchtig & Speels'
    };
  } else if (progress <= 0.6) {
    // Phase 3: Persoonlijk & Nieuwsgierig
    return {
      minIntensity: 2,
      maxIntensity: Math.min(3, maxAllowed),
      preferredTypes: ['guess', 'finish_the_sentence', 'ask'],
      stageName: 'Persoonlijk'
    };
  } else if (progress <= 0.8) {
    // Phase 4: Dilemma & Uitdaging
    return {
      minIntensity: 2,
      maxIntensity: Math.min(4, maxAllowed),
      preferredTypes: ['would_you_rather', 'challenge', 'reveal'],
      stageName: 'Dilemma & Chemie'
    };
  } else {
    // Phase 5: Verdieping & Positieve Afsluiting
    return {
      minIntensity: Math.min(2, maxAllowed),
      maxIntensity: maxAllowed,
      preferredTypes: ['ask', 'challenge', 'reveal', 'finish_the_sentence'],
      stageName: 'Verdieping & Afsluiting'
    };
  }
}

export function buildCuratedSession(config: SessionConfig): PromptItem[] {
  // Determine target length
  let targetCount = 10;
  if (config.duration === '5min') targetCount = 5;
  else if (config.duration === '15min') targetCount = 9;
  else if (config.duration === '30min') targetCount = 14;
  else if (config.duration === 'unlimited') targetCount = 16;

  // Filter candidate pool
  const candidatePool = PROMPTS_DATABASE.filter((item) => {
    // Relationship match
    const relMatch =
      config.relationship === 'surprise' ||
      item.relationshipType.includes(config.relationship) ||
      item.relationshipType.includes('surprise');

    if (!relMatch) return false;

    // Premium gate: allow if unlocked or if prompt isn't premium
    if (item.premium && !config.isPremiumUnlocked && config.intensity !== 'deep') {
      return false;
    }

    return true;
  });

  const selectedPrompts: PromptItem[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < targetCount; i++) {
    const { minIntensity, maxIntensity, preferredTypes } = getTargetIntensityAndType(
      i,
      targetCount,
      config.intensity
    );

    // Score candidates based on match
    const available = candidatePool.filter((p) => !usedIds.has(p.id));
    if (available.length === 0) break;

    // Sort available by ideal fit
    const scored = available.map((p) => {
      let score = 0;
      // Preferred interaction type bonus
      if (preferredTypes.includes(p.interactionType)) score += 5;
      // Intensity match
      if (p.intensity >= minIntensity && p.intensity <= maxIntensity) {
        score += 8;
      } else {
        score -= Math.abs(p.intensity - ((minIntensity + maxIntensity) / 2)) * 3;
      }
      // Vibe bonus
      if (config.vibe === 'lachen' && (p.tags.includes('humor') || p.interactionType === 'point')) score += 3;
      if (config.vibe === 'dieper' && (p.tags.includes('diepgang') || p.intensity >= 3)) score += 3;
      if (config.vibe === 'flirten' && (p.tags.includes('flirten') || p.tags.includes('romantiek'))) score += 4;
      if (config.vibe === 'leren_kennen' && (p.tags.includes('ijsbreker') || p.tags.includes('persoonlijkheid'))) score += 3;

      return { prompt: p, score: score + Math.random() * 2 };
    });

    scored.sort((a, b) => b.score - a.score);
    const chosen = scored[0].prompt;
    selectedPrompts.push(chosen);
    usedIds.add(chosen.id);
  }

  // Fallback if none matched
  if (selectedPrompts.length === 0) {
    return PROMPTS_DATABASE.slice(0, targetCount);
  }

  return selectedPrompts;
}

export function useSessionEngine(
  config: SessionConfig,
  options?: {
    initialFavorites?: string[];
    onToggleGlobalFavorite?: (id: string) => void;
  }
) {
  const initialPrompts = useMemo(() => buildCuratedSession(config), [config]);

  const [state, setState] = useState<SessionEngineState>(() => ({
    currentPromptIndex: 0,
    prompts: initialPrompts,
    favorites: new Set<string>(options?.initialFavorites || []),
    laughedCount: 0,
    skippedCount: 0,
    completedPromptIds: [],
    elapsedSeconds: 0,
    isPaused: false,
    isCompleted: false,
    interactionData: {}
  }));

  // Sync favorites if options.initialFavorites changes from outside
  useEffect(() => {
    if (options?.initialFavorites) {
      setState((prev) => ({
        ...prev,
        favorites: new Set<string>(options.initialFavorites)
      }));
    }
  }, [options?.initialFavorites]);

  // Re-generate if config completely changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      prompts: buildCuratedSession(config),
      currentPromptIndex: 0,
      completedPromptIds: [],
      isCompleted: false,
      isPaused: false
    }));
  }, [config]);

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

  const currentPrompt = state.prompts[state.currentPromptIndex] || null;

  const currentPhase = useMemo(() => {
    if (!state.prompts.length) return 'Start';
    const info = getTargetIntensityAndType(
      state.currentPromptIndex,
      state.prompts.length,
      config.intensity
    );
    return info.stageName;
  }, [state.currentPromptIndex, state.prompts.length, config.intensity]);

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
        completedPromptIds: completedIds
      };
    });
  }, []);

  const skipPrompt = useCallback(() => {
    setState((prev) => {
      if (prev.currentPromptIndex + 1 >= prev.prompts.length) {
        return {
          ...prev,
          skippedCount: prev.skippedCount + 1,
          isCompleted: true
        };
      }
      return {
        ...prev,
        skippedCount: prev.skippedCount + 1,
        currentPromptIndex: prev.currentPromptIndex + 1
      };
    });
  }, []);

  const previousPrompt = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPromptIndex: Math.max(0, prev.currentPromptIndex - 1)
    }));
  }, []);

  const toggleFavorite = useCallback((promptId: string) => {
    setState((prev) => {
      const nextFavorites = new Set(prev.favorites);
      if (nextFavorites.has(promptId)) {
        nextFavorites.delete(promptId);
      } else {
        nextFavorites.add(promptId);
      }
      return { ...prev, favorites: nextFavorites };
    });
    options?.onToggleGlobalFavorite?.(promptId);
  }, [options]);

  const recordLaugh = useCallback(() => {
    setState((prev) => ({
      ...prev,
      laughedCount: prev.laughedCount + 1
    }));
  }, []);

  const recordInteraction = useCallback((promptId: string, data: any) => {
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
      favorites: new Set<string>(options?.initialFavorites || []),
      laughedCount: 0,
      skippedCount: 0,
      completedPromptIds: [],
      elapsedSeconds: 0,
      isPaused: false,
      isCompleted: false,
      interactionData: {}
    });
  }, [options?.initialFavorites]);

  const restartSession = useCallback(() => {
    setState({
      currentPromptIndex: 0,
      prompts: buildCuratedSession(config),
      favorites: new Set<string>(options?.initialFavorites || []),
      laughedCount: 0,
      skippedCount: 0,
      completedPromptIds: [],
      elapsedSeconds: 0,
      isPaused: false,
      isCompleted: false,
      interactionData: {}
    });
  }, [config, options?.initialFavorites]);

  const stats: SessionStats = useMemo(
    () => ({
      promptsCompleted: state.completedPromptIds.length,
      laughedCount: state.laughedCount,
      favoritesCount: state.favorites.size,
      durationSeconds: state.elapsedSeconds,
      favoritePromptIds: Array.from(state.favorites)
    }),
    [state.completedPromptIds.length, state.laughedCount, state.favorites, state.elapsedSeconds]
  );

  return {
    currentPrompt,
    currentPromptIndex: state.currentPromptIndex,
    totalPrompts: state.prompts.length,
    currentPhase,
    isFavorite: currentPrompt ? state.favorites.has(currentPrompt.id) : false,
    favoritesList: Array.from(state.favorites),
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

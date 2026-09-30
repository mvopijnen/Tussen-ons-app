export type InteractionType =
  | 'ask'
  | 'both_answer'
  | 'guess'
  | 'point'
  | 'would_you_rather'
  | 'challenge'
  | 'finish_the_sentence'
  | 'rapid_fire'
  | 'reveal';

export type RelationshipType =
  | 'date'
  | 'partner'
  | 'friends'
  | 'family'
  | 'surprise'
  | 'work'
  | 'group';

export type VibeType =
  | 'lachen'
  | 'leren_kennen'
  | 'dieper'
  | 'flirten'
  | 'verrassend';

export type DurationType = '5min' | '15min' | '30min' | 'unlimited';

export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export type IntensitySetting = 'easy' | 'personal' | 'deep';

export interface PromptOption {
  id: string;
  text: string;
  subtext?: string;
}

export interface RapidFirePair {
  id: string;
  optionA: string;
  optionB: string;
}

export interface PromptItem {
  id: string;
  category: string;
  subcategory: string;
  interactionType: InteractionType;
  intensity: IntensityLevel;
  relationshipType: RelationshipType[];
  tags: string[];
  premium: boolean;
  prompt: string;
  subtitle?: string;
  tip?: string;
  options?: PromptOption[];
  challengeAction?: string;
  challengeDurationSec?: number;
  sentenceStarter?: string;
  revealQuestion?: {
    instruction: string;
    options: string[];
  };
  guessDetails?: {
    targetPrompt: string;
    hint: string;
  };
  rapidFirePairs?: RapidFirePair[];
}

export interface SessionConfig {
  relationship: RelationshipType;
  vibe: VibeType;
  duration: DurationType;
  intensity: IntensitySetting;
  isPremiumUnlocked?: boolean;
}

export interface SessionStats {
  promptsCompleted: number;
  laughedCount: number;
  favoritesCount: number;
  durationSeconds: number;
  favoritePromptIds: string[];
}

export interface UserProfile {
  name: string;
  avatar: string;
}

export type ThemeId = 'linnen' | 'salie' | 'blush' | 'espresso';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  badge: string;
  isDark: boolean;
  bgHex: string;
  cardHex: string;
  accentHex: string;
}

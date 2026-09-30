export type InteractionType =
  | 'ask'
  | 'both_answer'
  | 'guess'
  | 'point'
  | 'would_you_rather'
  | 'challenge'
  | 'finish_the_sentence'
  | 'rapid_fire'
  | 'reveal'
  | 'secret_pick'
  | 'predict'
  | 'match'
  | 'ranking'
  | 'one_word'
  | 'story'
  | 'wildcard';

export type RelationshipType =
  | 'date'
  | 'partner'
  | 'friends'
  | 'family'
  | 'surprise'
  | 'work'
  | 'group';

export type RelationshipStage =
  // Date
  | 'date_first'       // Eerste ontmoeting
  | 'date_few'         // Een paar dates
  | 'date_awhile'      // We daten al even
  | 'date_serious'     // Het wordt serieuzer
  | 'date_flirty'      // Flirty avond
  // Partner
  | 'partner_new'      // Net samen
  | 'partner_long'     // Al langer samen
  | 'partner_datenight'// Date night
  | 'partner_reconnect'// We willen weer eens echt praten
  | 'partner_deep'     // We kennen elkaar door en door
  // Friends
  | 'friends_new'      // Nieuwe vrienden
  | 'friends_good'     // Goede vrienden
  | 'friends_best'     // Beste vrienden
  | 'friends_group'    // Vriendengroep
  // Family
  | 'family_parent_child' // Ouder/kind
  | 'family_siblings'     // Broer/zus
  | 'family_general'      // Familie algemeen
  | 'any';

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

export interface SecretPickDetails {
  question: string;
  options: string[];
}

export interface PromptItem {
  id: string;
  category: string;
  subcategory: string;
  interactionType: InteractionType;
  intensity: IntensityLevel;
  relationshipType: RelationshipType[];
  relationshipStages?: RelationshipStage[];
  tags: string[];
  premium: boolean;
  prompt: string;
  subtitle?: string;
  tip?: string;
  options?: PromptOption[];
  challengeAction?: string;
  challengeDurationSec?: number;
  sentenceStarter?: string;
  emotionalTone?: 'warmup' | 'playful' | 'curious' | 'vulnerable' | 'peak' | 'positive_landing';
  revealQuestion?: {
    instruction: string;
    options: string[];
  };
  secretPickDetails?: SecretPickDetails;
  guessDetails?: {
    targetPrompt: string;
    hint: string;
  };
  rapidFirePairs?: RapidFirePair[];
}

export interface SessionConfig {
  relationship: RelationshipType;
  relationshipStage?: RelationshipStage;
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
  sessionFavoriteIds: string[];
}

export interface PlayHistoryRecord {
  lastPlayedAt: number;
  timesPlayed: number;
}

export type PlayHistoryMap = Record<string, PlayHistoryRecord>;

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

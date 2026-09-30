import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Onboarding } from './components/Onboarding';
import { SetupFlow } from './components/SetupFlow';
import { SessionView } from './components/SessionView';
import { OutroScreen } from './components/OutroScreen';
import { FavoritesView } from './components/FavoritesView';
import { PremiumPaywallModal } from './components/PremiumPaywallModal';
import { ProfileModal } from './components/ProfileModal';
import { SurpriseModal } from './components/SurpriseModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { AmbientBackground } from './components/AmbientBackground';
import { SessionConfig, UserProfile, ThemeId, PromptItem } from './types';
import { useSessionEngine } from './hooks/useSessionEngine';
import { 
  safeGetFavorites, 
  safeSaveFavorites, 
  safeGetUserProfile, 
  safeSaveUserProfile, 
  safeGetTheme, 
  safeSaveTheme, 
  safeGetPremium, 
  safeSavePremium 
} from './utils/storage';
import { Heart, Sparkles, RotateCcw, Dices, Palette, Bookmark } from 'lucide-react';

export default function App() {
  // Navigation State
  const [view, setView] = useState<'onboarding' | 'setup' | 'session' | 'outro' | 'favorites'>('setup');
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(() => {
    return safeGetPremium();
  });
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Persistent Favorites State (Saved across sessions in localStorage with validation)
  const [globalFavorites, setGlobalFavorites] = useState<string[]>(() => {
    const list = safeGetFavorites();
    if (list.length > 0) return list;
    // Default seed with 2 charming questions for immediate delight
    return ['date-ask-2', 'date-guess-1'];
  });

  const toggleGlobalFavorite = (promptId: string) => {
    setGlobalFavorites((prev) => {
      const next = prev.includes(promptId) ? prev.filter((id) => id !== promptId) : [...prev, promptId];
      safeSaveFavorites(next);
      return next;
    });
  };

  // Theme State (Default to 'linnen' for a warm, light, bright, approachable aesthetic)
  const [theme, setTheme] = useState<ThemeId>(() => {
    return safeGetTheme('linnen');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeSaveTheme(theme);
  }, [theme]);

  // User Profile State with validated schema
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return safeGetUserProfile();
  });

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    safeSaveUserProfile(updated);
  };

  // Active Session Config
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    relationship: 'date',
    relationshipStage: 'date_first',
    vibe: 'leren_kennen',
    duration: '15min',
    intensity: 'personal',
    isPremiumUnlocked: false
  });

  // Check onboarding status on mount
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('tussen_ons_onboarded');
    if (!hasOnboarded) {
      setView('onboarding');
    }
  }, []);

  // Sync premium state with session config
  useEffect(() => {
    setSessionConfig((prev) => ({
      ...prev,
      isPremiumUnlocked
    }));
  }, [isPremiumUnlocked]);

  // Session Engine
  const {
    currentPrompt,
    currentPromptIndex,
    totalPrompts,
    currentPhase,
    isFavorite,
    laughedCount,
    interactionData,
    isCompleted,
    stats,
    nextPrompt,
    skipPrompt,
    toggleFavorite,
    recordLaugh,
    recordInteraction,
    finishSession,
    restartSession,
    startCustomSession
  } = useSessionEngine(sessionConfig, {
    initialFavorites: globalFavorites,
    onToggleGlobalFavorite: toggleGlobalFavorite
  });

  // When session engine finishes, switch to outro
  useEffect(() => {
    if (isCompleted && view === 'session') {
      setView('outro');
    }
  }, [isCompleted, view]);

  // Handlers
  const handleStartSession = (newConfig: SessionConfig) => {
    setSessionConfig(newConfig);
    restartSession();
    setView('session');
  };

  const handleStartFavoritesSession = (prompts: PromptItem[]) => {
    startCustomSession(prompts);
    setView('session');
  };

  const handleUnlockTrial = () => {
    setIsPremiumUnlocked(true);
    safeSavePremium(true);
  };

  const handleResetToOnboarding = () => {
    localStorage.removeItem('tussen_ons_onboarded');
    setView('onboarding');
  };

  const themeLabelMap: Record<ThemeId, string> = {
    linnen: 'Warm Linnen',
    salie: 'Salie & Haver',
    blush: 'Zacht Blush',
    espresso: 'Nacht Espresso'
  };

  return (
    <div 
      data-theme={theme}
      className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col justify-center items-center font-sans antialiased selection:bg-[var(--color-accent)] selection:text-white transition-colors duration-300 relative overflow-hidden"
    >
      {/* Outer desktop ambient glow layer */}
      <div className="hidden md:block">
        <AmbientBackground />
      </div>

      {/* Responsive Shell: Native fluid on mobile, elegant centered device canvas on wider displays */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[var(--bg-app)] shadow-2xl relative transition-colors duration-300 overflow-hidden">
        {/* Subtle, slow floating ambient shapes */}
        <AmbientBackground />

        {/* Content layer above the floating shapes */}
        <div className="relative z-10 flex-1 flex flex-col min-h-screen">
          <AnimatePresence mode="wait">
            {view === 'onboarding' && (
              <Onboarding
                key="onboarding"
                onComplete={() => setView('setup')}
              />
            )}

            {view === 'setup' && (
              <div key="setup" className="relative flex-1 flex flex-col">
                <SetupFlow
                  onStartSession={handleStartSession}
                  onOpenPaywall={() => setShowPaywall(true)}
                  onOpenProfile={() => setShowProfileModal(true)}
                  onOpenSurprise={() => setShowSurpriseModal(true)}
                  onOpenTheme={() => setShowThemeModal(true)}
                  onOpenFavorites={() => setView('favorites')}
                  favoritesCount={globalFavorites.length}
                  userProfile={userProfile}
                  isPremiumUnlocked={isPremiumUnlocked}
                />
                
                {/* Subtle footer toggle to switch theme, review onboarding or surprise me */}
                <div className="py-2.5 text-center text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-2 flex-wrap px-4">
                  <button
                    onClick={() => setView('favorites')}
                    className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                    <span>Favorieten ({globalFavorites.length})</span>
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setShowThemeModal(true)}
                    className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Palette className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                    <span>Stijl: {themeLabelMap[theme]}</span>
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setShowSurpriseModal(true)}
                    className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Dices className="w-3 h-3" style={{ color: 'var(--color-accent)' }} /> Surprise Me
                  </button>
                  <span>·</span>
                  <button
                    onClick={handleResetToOnboarding}
                    className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Intro
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setShowPaywall(true)}
                    className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
                    {isPremiumUnlocked ? 'Plus Actief' : 'Plus'}
                  </button>
                </div>
              </div>
            )}

            {view === 'favorites' && (
              <FavoritesView
                key="favorites"
                favoriteIds={globalFavorites}
                onToggleFavorite={toggleGlobalFavorite}
                onBack={() => setView('setup')}
                onStartCustomSession={handleStartFavoritesSession}
                onOpenTheme={() => setShowThemeModal(true)}
              />
            )}

            {view === 'session' && currentPrompt && (
              <SessionView
                key="session"
                currentPrompt={currentPrompt}
                currentPromptIndex={currentPromptIndex}
                totalPrompts={totalPrompts}
                currentPhase={currentPhase}
                isFavorite={isFavorite}
                laughedCount={laughedCount}
                interactionData={interactionData}
                onNext={nextPrompt}
                onSkip={skipPrompt}
                onToggleFavorite={toggleFavorite}
                onRecordLaugh={recordLaugh}
                onRecordInteraction={recordInteraction}
                onExitSession={finishSession}
                onOpenTheme={() => setShowThemeModal(true)}
                config={sessionConfig}
              />
            )}

            {view === 'outro' && (
              <OutroScreen
                key="outro"
                stats={stats}
                onPlayAnotherRound={() => {
                  restartSession();
                  setView('session');
                }}
                onChangeVibe={() => setView('setup')}
                onFinish={() => setView('setup')}
                onOpenTheme={() => setShowThemeModal(true)}
                onOpenFavorites={() => setView('favorites')}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={userProfile}
          onSave={handleSaveProfile}
        />

        {/* Surprise Me Modal */}
        <SurpriseModal
          isOpen={showSurpriseModal}
          onClose={() => setShowSurpriseModal(false)}
          onConfirm={handleStartSession}
          currentRelationship={sessionConfig.relationship}
          isPremiumUnlocked={isPremiumUnlocked}
        />

        {/* Theme Selector Modal */}
        <ThemeSelectorModal
          isOpen={showThemeModal}
          onClose={() => setShowThemeModal(false)}
          currentTheme={theme}
          onSelectTheme={(t) => setTheme(t)}
        />

        {/* Premium Paywall Modal */}
        <PremiumPaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onUnlockTrial={handleUnlockTrial}
          isUnlocked={isPremiumUnlocked}
        />
      </div>
    </div>
  );
}

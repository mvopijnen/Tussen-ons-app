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
import { PWAInstallButton } from './components/PWAInstallButton';
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
        {/* Mock Status Bar (Native App Feel) */}
        <div className="h-7 flex items-center justify-between px-6 text-[11px] font-bold text-[var(--text-muted)] select-none z-[60] shrink-0">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fillOpacity=".3"/>
              <path d="M4.77 12.5L12.01 21.49l7.24-8.99C18.85 12.24 16.1 10 12.01 10c-4.09 0-6.84 2.24-7.24 2.5z"/>
            </svg>
            <div className="w-5 h-2.5 border border-[var(--text-muted)] rounded-[3px] p-[1px] relative">
              <div className="bg-[var(--text-muted)] h-full w-[70%] rounded-[1px]" />
              <div className="absolute -right-1 top-0.5 w-0.5 h-1 bg-[var(--text-muted)] rounded-r-full" />
            </div>
          </div>
        </div>

        {/* Subtle, slow floating ambient shapes */}
        <AmbientBackground />

        {/* Content layer above the floating shapes */}
        <div className="relative z-10 flex-1 flex flex-col min-h-[calc(100vh-28px-16px)]">
          <AnimatePresence mode="wait">
            {view === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <Onboarding onComplete={() => setView('setup')} />
              </motion.div>
            )}

            {view === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex-1 flex flex-col"
              >
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
                
                {/* Clean footer with non-duplicated utility actions */}
                <div className="py-2.5 px-4 flex flex-col items-center gap-2">
                  <div className="w-full max-w-[240px] flex justify-center">
                    <PWAInstallButton variant="minimal" />
                  </div>
                  
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => setShowSurpriseModal(true)}
                      className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Dices className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                      <span>Surprise Me</span>
                    </button>
                    <span>·</span>
                    <button
                      onClick={handleResetToOnboarding}
                      className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Intro</span>
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setShowPaywall(true)}
                      className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Sparkles className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
                      <span>{isPremiumUnlocked ? 'Plus Actief' : 'Plus'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <FavoritesView
                  favoriteIds={globalFavorites}
                  onToggleFavorite={toggleGlobalFavorite}
                  onBack={() => setView('setup')}
                  onStartCustomSession={handleStartFavoritesSession}
                  onOpenTheme={() => setShowThemeModal(true)}
                />
              </motion.div>
            )}

            {view === 'session' && currentPrompt && (
              <motion.div
                key="session"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <SessionView
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
              </motion.div>
            )}

            {view === 'outro' && (
              <motion.div
                key="outro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <OutroScreen
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mock Home Indicator (iOS feel) */}
        <div className="h-4 w-full flex items-center justify-center shrink-0 z-[60] pb-1">
          <div className="w-32 h-1 bg-[var(--text-muted)] opacity-20 rounded-full" />
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

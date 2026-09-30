import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Smile, 
  ArrowRight, 
  SkipForward, 
  X, 
  Pause, 
  Flame,
  Palette
} from 'lucide-react';
import { PromptItem, SessionConfig } from '../types';
import { InteractionCard } from './InteractionCard';

interface SessionViewProps {
  currentPrompt: PromptItem;
  currentPromptIndex: number;
  totalPrompts: number;
  currentPhase: string;
  isFavorite: boolean;
  laughedCount: number;
  interactionData: any;
  onNext: () => void;
  onSkip: () => void;
  onToggleFavorite: (id: string) => void;
  onRecordLaugh: () => void;
  onRecordInteraction: (promptId: string, data: any) => void;
  onExitSession: () => void;
  onOpenTheme?: () => void;
  config: SessionConfig;
}

export const SessionView: React.FC<SessionViewProps> = ({
  currentPrompt,
  currentPromptIndex,
  totalPrompts,
  currentPhase,
  isFavorite,
  laughedCount,
  interactionData,
  onNext,
  onSkip,
  onToggleFavorite,
  onRecordLaugh,
  onRecordInteraction,
  onExitSession,
  onOpenTheme,
  config
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [laughAnimationKey, setLaughAnimationKey] = useState(0);

  const handleLaugh = () => {
    onRecordLaugh();
    setLaughAnimationKey((prev) => prev + 1);
  };

  // Formatted unboxed metadata
  const currentInteractionData = interactionData[currentPrompt.id];

  return (
    <div className="relative flex flex-col justify-between h-[100dvh] max-w-md mx-auto px-4 py-4 sm:py-6 select-none overflow-hidden">
      {/* Top Session Bar */}
      <header className="flex items-center justify-between pb-2 z-10">
        {/* Pause/Exit button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-label="Pauzeer of verlaat sessie"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Phase & Counter Kicker */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-accent)' }}>
            {currentPhase}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-mono">
            <span>Kaart {currentPromptIndex + 1}</span>
            <span aria-hidden="true">·</span>
            <span>van {totalPrompts}</span>
          </div>
        </div>

        {/* Actions: Theme Switcher, Laugh counter & Favorite */}
        <div className="flex items-center gap-1 -mr-1">
          {onOpenTheme && (
            <button
              onClick={onOpenTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Verander lay-out stijl"
              aria-label="Lay-out stijl aanpassen"
            >
              <Palette className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleLaugh}
            className="relative p-2 text-[var(--text-muted)] hover:text-amber-500 transition-colors cursor-pointer active:scale-90"
            title="We moesten lachen!"
            aria-label="We moesten lachen"
          >
            <Smile className="w-5 h-5" />
            <AnimatePresence>
              {laughAnimationKey > 0 && (
                <motion.span
                  key={laughAnimationKey}
                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -24, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-1 right-1 text-xs font-bold text-amber-500 pointer-events-none"
                >
                  +1 😂
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => onToggleFavorite(currentPrompt.id)}
            style={{
              color: isFavorite ? 'var(--color-accent)' : 'var(--text-muted)'
            }}
            className="p-2 transition-transform active:scale-90 cursor-pointer hover:opacity-80"
            title="Sla op als favoriet"
            aria-label="Favoriet markeren"
          >
            <Heart 
              className="w-5 h-5" 
              style={{ fill: isFavorite ? 'var(--color-accent)' : 'transparent' }} 
            />
          </button>
        </div>
      </header>

      {/* Central Interactive Card (Fills majority of screen) */}
      <div className="relative flex-1 my-2 flex items-center justify-center min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPrompt.id}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--card-shadow)'
            }}
            className="w-full h-full border rounded-3xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top metadata strip inside card */}
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pb-2">
              <div className="flex items-center gap-1.5 font-medium">
                <span>{currentPrompt.category}</span>
                <span aria-hidden="true">·</span>
                <span>{currentPrompt.subcategory}</span>
              </div>

              {/* Intensity indicators */}
              <div className="flex items-center gap-1" title={`Intensiteit ${currentPrompt.intensity}/5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: i < currentPrompt.intensity ? 'var(--color-accent)' : 'var(--border-subtle)'
                    }}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Main Interactive Variant View */}
            <div className="flex-1 my-auto overflow-y-auto py-2">
              <InteractionCard
                prompt={currentPrompt}
                interactionData={currentInteractionData}
                onRecordInteraction={(data) =>
                  onRecordInteraction(currentPrompt.id, data)
                }
              />
            </div>

            {/* Subtle bottom note inside card */}
            <div className="pt-2 text-center text-[10px] text-[var(--text-muted)] font-mono tracking-widest uppercase opacity-70">
              Tussen Ons · Moment voor twee
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Zone */}
      <footer className="pt-2 pb-1 flex items-center justify-between gap-3 z-10">
        <button
          onClick={onSkip}
          className="h-12 px-4 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <SkipForward className="w-4 h-4" />
          <span>Overslaan</span>
        </button>

        <button
          onClick={onNext}
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
          className="flex-1 h-12 rounded-2xl active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <span>
            {currentPromptIndex + 1 === totalPrompts
              ? 'Afronden & bekijken'
              : 'Volgende vraag'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Exit / Pause Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              className="relative w-full max-w-xs border rounded-2xl p-5 text-center space-y-4 shadow-xl z-10"
            >
              <h3 className="font-editorial text-xl text-[var(--text-primary)] font-medium">
                Sessie even pauzeren?
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                Jullie hebben al {currentPromptIndex + 1} vragen besproken. Wil je stoppen en de herinneringen bekijken?
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-primary)' }}
                  className="w-full py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Doorgaan met gesprek
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    onExitSession();
                  }}
                  style={{ color: 'var(--color-accent)' }}
                  className="w-full py-2 text-xs font-medium transition-colors cursor-pointer hover:underline"
                >
                  Sessie afronden
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

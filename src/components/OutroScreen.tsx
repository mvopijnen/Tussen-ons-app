import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Smile, 
  Heart, 
  Clock, 
  RotateCcw, 
  SlidersHorizontal, 
  Check, 
  BookmarkCheck,
  Share2,
  ArrowRight
} from 'lucide-react';
import { SessionStats } from '../types';
import { PROMPTS_DATABASE } from '../data/prompts';

interface OutroScreenProps {
  stats: SessionStats;
  onPlayAnotherRound: () => void;
  onChangeVibe: () => void;
  onFinish: () => void;
  onOpenTheme?: () => void;
  onOpenFavorites?: () => void;
}

export const OutroScreen: React.FC<OutroScreenProps> = ({
  stats,
  onPlayAnotherRound,
  onChangeVibe,
  onFinish,
  onOpenTheme,
  onOpenFavorites
}) => {
  // Format elapsed seconds to mm:ss
  const minutes = Math.floor(stats.durationSeconds / 60);
  const seconds = stats.durationSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes} min` : `${seconds} sec`;

  // Look up favorited prompts
  const favoritedPrompts = PROMPTS_DATABASE.filter((p) =>
    stats.favoritePromptIds.includes(p.id)
  );

  return (
    <div className="flex flex-col justify-between min-h-screen max-w-md mx-auto px-5 py-8 sm:py-10 select-none">
      {/* Top Brand Marker */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span className="font-editorial text-base text-[var(--text-primary)] font-medium">Tussen Ons</span>
        <div className="flex items-center gap-2">
          {onOpenTheme && (
            <button
              onClick={onOpenTheme}
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
              title="Lay-out stijl aanpassen"
            >
              <span>🎨 Stijl</span>
            </button>
          )}
          <span className="font-mono">Sessie Afgerond</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="my-auto py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-2 text-center"
        >
          <div 
            style={{ backgroundColor: 'var(--color-accent-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--color-accent)' }}
            className="w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto mb-3 shadow-xs"
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
            Goed gesprek
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--text-primary)] font-medium leading-tight">
            Dat was leuk.
          </h1>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm font-light max-w-xs mx-auto leading-relaxed">
            De beste gesprekken ontstaan wanneer je durft te luisteren naar wat er niet vanzelf gezegd wordt.
          </p>
        </motion.div>

        {/* Lighthearted Stats Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="border rounded-2xl p-4 text-center space-y-1 shadow-xs"
          >
            <div className="text-2xl font-editorial font-bold text-[var(--text-primary)] tabular-nums">
              {stats.promptsCompleted}
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-light flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} /> Prompts gespeeld
            </div>
          </div>

          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="border rounded-2xl p-4 text-center space-y-1 shadow-xs"
          >
            <div className="text-2xl font-editorial font-bold text-[var(--text-primary)] tabular-nums">
              {stats.laughedCount}
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-light flex items-center justify-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-amber-500" /> Keer gelachen
            </div>
          </div>

          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="border rounded-2xl p-4 text-center space-y-1 shadow-xs"
          >
            <div className="text-2xl font-editorial font-bold text-[var(--text-primary)] tabular-nums">
              {stats.favoritesCount}
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-light flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} /> Nieuw bewaard
            </div>
          </div>

          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="border rounded-2xl p-4 text-center space-y-1 shadow-xs"
          >
            <div className="text-2xl font-editorial font-bold text-[var(--text-primary)] tabular-nums">
              {timeFormatted}
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-light flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Tijd samen
            </div>
          </div>
        </motion.div>

        {/* Favorited prompts list for THIS session (if any) */}
        {favoritedPrompts.length > 0 ? (
          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="border rounded-2xl p-4 space-y-2.5 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <BookmarkCheck className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
              <span>Tijdens deze ronde bewaard ({favoritedPrompts.length}):</span>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {favoritedPrompts.map((fav) => (
                <div
                  key={fav.id}
                  style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
                  className="text-xs text-[var(--text-primary)] p-2.5 rounded-xl border leading-snug"
                >
                  &ldquo;{fav.prompt}&rdquo;
                </div>
              ))}
            </div>

            {onOpenFavorites && (
              <button
                onClick={onOpenFavorites}
                style={{ color: 'var(--color-accent)' }}
                className="w-full text-center text-xs font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer pt-1"
              >
                <span>Bekijk al jullie opgeslagen favorieten</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : onOpenFavorites ? (
          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="border rounded-2xl p-3.5 text-center space-y-1 shadow-xs"
          >
            <p className="text-xs text-[var(--text-secondary)] font-light">
              Geen vragen bewaard deze ronde – alle aandacht ging naar het gesprek.
            </p>
            <button
              onClick={onOpenFavorites}
              style={{ color: 'var(--color-accent)' }}
              className="text-xs font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer pt-0.5"
            >
              <span>Bekijk al jullie opgeslagen favorieten</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onPlayAnotherRound}
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
          className="w-full h-12 rounded-2xl active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Nog één ronde spelen
        </button>

        <button
          onClick={onChangeVibe}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          className="w-full h-12 rounded-2xl border active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4" /> Andere vibe of gezelschap
        </button>

        <button
          onClick={onFinish}
          className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer"
        >
          Klaar voor vanavond
        </button>
      </div>
    </div>
  );
};

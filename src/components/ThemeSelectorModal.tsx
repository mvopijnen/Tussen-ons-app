import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Sparkles, Sun, Moon } from 'lucide-react';
import { ThemeId, ThemeOption } from '../types';

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'linnen',
    name: 'Warm Linnen',
    tagline: 'Licht, natuurlijk haver & terracotta. Zacht, warm en uitnodigend.',
    badge: 'Aanrader',
    isDark: false,
    bgHex: '#F8F5EE',
    cardHex: '#FFFFFF',
    accentHex: '#B83A4B'
  },
  {
    id: 'salie',
    name: 'Salie & Haver',
    tagline: 'Fris ochtendlicht, eucalyptus & zacht ecru. Kalm en open.',
    badge: 'Fris',
    isDark: false,
    bgHex: '#F1F4F0',
    cardHex: '#FFFFFF',
    accentHex: '#28664D'
  },
  {
    id: 'blush',
    name: 'Zacht Blush',
    tagline: 'Zachte perzik, blush crème & warm koraal. Speels en romantisch.',
    badge: 'Romantisch',
    isDark: false,
    bgHex: '#FAF2ED',
    cardHex: '#FFFFFF',
    accentHex: '#D05A3F'
  },
  {
    id: 'espresso',
    name: 'Nacht Espresso',
    tagline: 'Intieme donkere cocktailbar & kaarslicht voor late avonden.',
    badge: 'Donker',
    isDark: true,
    bgHex: '#131211',
    cardHex: '#1A1816',
    accentHex: '#B83A4B'
  }
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={{ backgroundColor: 'var(--bg-card)' }}
          className="relative w-full max-w-md border-t sm:border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 select-none max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card-subtle)' }}
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-5 pr-8">
            <span className="text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1.5" style={{ color: 'var(--color-accent)' }}>
              <Palette className="w-3.5 h-3.5" />
              Sfeer & Stijl
            </span>
            <h2 className="font-editorial text-2xl text-[var(--text-primary)] font-medium leading-tight">
              Kies jullie gewenste lay-out
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-light">
              Kies een lichte, warme sfeer voor overdag of een intieme tint voor de avond.
            </p>
          </div>

          {/* Theme Option Cards */}
          <div className="space-y-3 mb-6">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = currentTheme === opt.id;

              return (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectTheme(opt.id)}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card)',
                    borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected ? 'shadow-md ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Visual Color Swatch */}
                    <div 
                      className="w-11 h-11 rounded-xl p-1 shrink-0 flex flex-col justify-between shadow-xs border border-black/10"
                      style={{ backgroundColor: opt.bgHex }}
                    >
                      <div 
                        className="w-full h-4 rounded-md shadow-xs flex items-center justify-end px-1"
                        style={{ backgroundColor: opt.cardHex }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: opt.accentHex }}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        {opt.isDark ? (
                          <Moon className="w-3 h-3 text-stone-400" />
                        ) : (
                          <Sun className="w-3 h-3 text-amber-600/70" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {opt.name}
                        </span>
                        <span 
                          className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--bg-card-subtle)',
                            color: isSelected ? 'var(--color-accent-text)' : 'var(--text-secondary)'
                          }}
                        >
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-light leading-snug">
                        {opt.tagline}
                      </p>
                    </div>
                  </div>

                  <div 
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                      isSelected ? 'text-white' : 'border-[var(--border-subtle)] text-transparent'
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                      borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                    }}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Direct Confirmation Button */}
          <button
            onClick={onClose}
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
            className="w-full h-12 rounded-xl active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            Klaar met kiezen ✓
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

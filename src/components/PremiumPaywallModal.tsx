import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Flame, Heart, Zap, Shield } from 'lucide-react';

interface PremiumPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockTrial: () => void;
  isUnlocked: boolean;
}

export const PremiumPaywallModal: React.FC<PremiumPaywallModalProps> = ({
  isOpen,
  onClose,
  onUnlockTrial,
  isUnlocked
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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          className="relative w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-secondary)' }}
            className="absolute top-5 right-5 p-2 hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer"
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-2 pt-2 text-center">
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
              Tussen Ons Plus
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
              Maak iedere date anders.
            </h2>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm font-light max-w-xs mx-auto">
              Ontdek nieuwe kanten van elkaar met ongecensureerde diepgang en exclusieve interacties.
            </p>
          </div>

          {/* Value Highlights */}
          <div 
            style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
            className="my-6 space-y-3 rounded-2xl p-4 border"
          >
            <div className="flex items-start gap-3">
              <div 
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              >
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                  Ongecensureerde 'Deep' Intensiteit
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] font-light">
                  Diepere kwetsbaarheid, romantische spanning en stoute dilemma’s.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div 
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                  Steeds Nieuwe Vragen & Verrassende Sessies
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] font-light">
                  Toegang tot alle diepe thema’s, geavanceerde spelmechanieken en unieke relatiefases.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div 
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              >
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                  Bewaar Jullie Favoriete Vragen
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] font-light">
                  Sla vragen op die een bijzonder, grappig of mooi gesprek opleverden en speel eigen rondes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div 
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              >
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                  Volledig Privé & Veilig
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] font-light">
                  Wat tussen jullie wordt gezegd, blijft tussen jullie. Geen opnames of data naar servers.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div 
            style={{ 
              backgroundColor: 'var(--color-accent-subtle)', 
              borderColor: 'var(--color-accent)' 
            }}
            className="border rounded-2xl p-4 mb-6 text-center space-y-1"
          >
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-accent)' }}>
              Introductie Aanbod
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-2xl font-editorial font-bold text-[var(--text-primary)]">€2,99</span>
              <span className="text-xs text-[var(--text-secondary)]">/ maand</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-light">
              Eerste 7 dagen gratis · Altijd direct opzegbaar met één klik
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onUnlockTrial();
                onClose();
              }}
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
              className="w-full h-12 rounded-xl active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              {isUnlocked ? 'Plus is al actief ✓' : 'Probeer 7 dagen gratis'}
            </button>

            <button
              onClick={onClose}
              className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer"
            >
              Misschien later, terug naar gratis sessie
            </button>
          </div>

          {/* Reassurance footnote */}
          <div 
            style={{ borderColor: 'var(--border-subtle)' }}
            className="mt-4 pt-3 border-t flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)]"
          >
            <Shield className="w-3 h-3 text-[var(--text-muted)]" />
            <span>Veilig en anoniem · Geen verplichte registratie</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

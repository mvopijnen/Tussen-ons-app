import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC<{ variant?: 'minimal' | 'full' }> = ({ variant = 'full' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  if (variant === 'minimal') {
    if (isInstallable) {
      return (
        <button
          onClick={install}
          className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity"
        >
          <Download className="w-3 h-3" />
          <span>App Installeren</span>
        </button>
      );
    }
    if (isIOS) {
      return (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity"
        >
          <Smartphone className="w-3 h-3" />
          <span>Zet op beginscherm</span>
        </button>
      );
    }
    return null;
  }

  // Full variant (e.g. for a banner in settings or profile)
  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm shadow-lg shadow-[var(--color-accent)]/20 active:scale-[0.98] transition-transform"
        >
          <Download className="w-4 h-4" />
          Installeer Tussen Ons App
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold text-sm active:bg-[var(--bg-card-hover)] transition-colors"
        >
          <Smartphone className="w-4 h-4" />
          Zet op je beginscherm
        </button>
      )}

      <AnimatePresence>
        {showIOSGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowIOSGuide(false)}
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-sm bg-[var(--bg-card)] rounded-3xl p-6 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-[var(--bg-card-subtle)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-app)] flex items-center justify-center mb-4 shadow-inner">
                  <Smartphone className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                
                <h3 className="text-xl font-editorial font-bold mb-2">Tussen Ons op je iPhone</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                  Voeg de app toe aan je beginscherm voor de beste ervaring.
                </p>

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center shrink-0 mt-0.5">
                      <Share className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm">Tik op het <strong>Deel-icoon</strong> onderin je Safari browser.</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      +
                    </div>
                    <p className="text-sm">Scroll naar beneden en kies <strong>Zet op beginscherm</strong>.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-8 w-full py-3 rounded-xl bg-[var(--bg-card-subtle)] font-semibold text-[var(--text-primary)]"
                >
                  Begrepen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

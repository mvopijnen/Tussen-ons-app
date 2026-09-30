import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, HeartHandshake, Compass } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    icon: Sparkles,
    kicker: 'Stilte & Verbinding',
    title: 'Betere gesprekken beginnen soms met één goede vraag.',
    description:
      'Geen regels, geen puntentelling of winnaars. Alleen echte, onverdeelde aandacht voor degene die tegenover je zit.'
  },
  {
    icon: HeartHandshake,
    kicker: 'Lachen & Ongemak',
    title: 'Laat de stilte vallen, lach om het ongemak.',
    description:
      'Van ontwapenende blunders tot speelse uitdagingen. De app leidt het gesprek natuurlijk in, zodat niemand zich verplicht voelt.'
  },
  {
    icon: Compass,
    kicker: 'Jullie Ritme',
    title: 'Ontdek wat er tussen jullie leeft.',
    description:
      'Kies jullie sfeer, bepaal hoe diep het mag gaan en laat de gespreksengine jullie meenemen op ontdekking.'
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem('tussen_ons_onboarded', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tussen_ons_onboarded', 'true');
    onComplete();
  };

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="relative flex flex-col justify-between min-h-screen max-w-md mx-auto px-6 py-10 sm:py-14 select-none">
      {/* Top bar with subtle skip affordance */}
      <div className="flex items-center justify-between">
        <span className="font-editorial text-xl tracking-tight text-[var(--text-primary)] font-medium">
          Tussen Ons
        </span>
        <button
          onClick={handleSkip}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2 px-3 -mr-3 cursor-pointer"
        >
          Overslaan
        </button>
      </div>

      {/* Main card carousel */}
      <div className="my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div 
              style={{ backgroundColor: 'var(--color-accent-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--color-accent)' }}
              className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs"
            >
              <Icon className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
                {step.kicker}
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight font-medium">
                {step.title}
              </h1>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-light max-w-sm pt-2">
                {step.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="space-y-6 pt-4">
        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: idx === currentStep ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8' : 'w-2.5'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
          className="w-full h-13 rounded-2xl active:scale-[0.98] font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {currentStep === ONBOARDING_STEPS.length - 1 ? (
            'Start sessie'
          ) : (
            <>
              Volgende <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

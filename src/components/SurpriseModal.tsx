import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Dices, 
  Sparkles, 
  Smile, 
  Compass, 
  Flame, 
  Clock, 
  Zap, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { RelationshipType, VibeType, DurationType, IntensitySetting, SessionConfig } from '../types';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: SessionConfig) => void;
  currentRelationship: RelationshipType;
  isPremiumUnlocked: boolean;
}

const ALL_VIBES: { id: VibeType; title: string; desc: string; icon: any }[] = [
  { id: 'lachen', title: 'Lachen & Luchtig', desc: 'Blunders, humor en ontwapenende verhalen', icon: Smile },
  { id: 'leren_kennen', title: 'Elkaar Leren Kennen', desc: 'Nieuwsgierig naar gewoontes en dromen', icon: Compass },
  { id: 'flirten', title: 'Flirten & Spanning', desc: 'Lichaamstaal, chemie en stiltes', icon: Flame },
  { id: 'dieper', title: 'Echt Dieper Gaan', desc: 'Kwetsbaarheid en oprechte waarden', icon: Sparkles },
  { id: 'verrassend', title: 'Onverwacht & Verrassend', desc: 'Sociale opdrachten en snelle dilemma’s', icon: Dices }
];

const ALL_DURATIONS: { id: DurationType; label: string; sub: string }[] = [
  { id: '5min', label: '5 Minuten', sub: 'Snelle ijsbreker (± 5 kaarten)' },
  { id: '15min', label: '15 Minuten', sub: 'Gouden balans (± 9 kaarten)' },
  { id: '30min', label: '30 Minuten', sub: 'Uitgebreid natafelen (± 14 kaarten)' },
  { id: 'unlimited', label: 'Geen Tijdslimiet', sub: 'Vrij doorpraten zolang het stroomt' }
];

const ALL_RELATIONSHIPS: { id: RelationshipType; label: string }[] = [
  { id: 'date', label: 'Eerste Date' },
  { id: 'partner', label: 'Partner' },
  { id: 'friends', label: 'Vrienden & Vriendschap' },
  { id: 'family', label: 'Familie' },
  { id: 'group', label: 'Groepsijsbrekers' },
  { id: 'surprise', label: 'Eclectische Mix' }
];

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentRelationship,
  isPremiumUnlocked
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  // Randomized selections
  const [selectedRel, setSelectedRel] = useState<RelationshipType>(currentRelationship);
  const [selectedVibe, setSelectedVibe] = useState<VibeType>('leren_kennen');
  const [selectedDur, setSelectedDur] = useState<DurationType>('15min');
  const [selectedInt, setSelectedInt] = useState<IntensitySetting>('personal');

  const rollNewConfig = () => {
    setIsRolling(true);
    setRollCount((prev) => prev + 1);

    // Pick random values
    const randomVibe = ALL_VIBES[Math.floor(Math.random() * ALL_VIBES.length)].id;
    const randomDur = ALL_DURATIONS[Math.floor(Math.random() * ALL_DURATIONS.length)].id;
    
    // Intensity: allow deep if unlocked
    const availableIntensities: IntensitySetting[] = isPremiumUnlocked
      ? ['easy', 'personal', 'deep']
      : ['easy', 'personal'];
    const randomInt = availableIntensities[Math.floor(Math.random() * availableIntensities.length)];

    // Relationship: if currently surprise or user rolls, can pick a specific one or surprise
    const chosenRel = currentRelationship === 'surprise'
      ? ALL_RELATIONSHIPS[Math.floor(Math.random() * (ALL_RELATIONSHIPS.length - 1))].id
      : currentRelationship;

    setTimeout(() => {
      setSelectedRel(chosenRel);
      setSelectedVibe(randomVibe);
      setSelectedDur(randomDur);
      setSelectedInt(randomInt);
      setIsRolling(false);
    }, 350);
  };

  useEffect(() => {
    if (isOpen) {
      rollNewConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const vibeObj = ALL_VIBES.find((v) => v.id === selectedVibe) || ALL_VIBES[0];
  const durObj = ALL_DURATIONS.find((d) => d.id === selectedDur) || ALL_DURATIONS[1];
  const relObj = ALL_RELATIONSHIPS.find((r) => r.id === selectedRel) || ALL_RELATIONSHIPS[0];
  const VibeIcon = vibeObj.icon;

  const intensityLabel =
    selectedInt === 'easy'
      ? 'Easy & Veilig'
      : selectedInt === 'personal'
      ? 'Persoonlijk & Oprecht'
      : 'Deep & Intiem';

  const handleStart = () => {
    let stage: any = 'any';
    if (selectedRel === 'date') {
      const dateStages = ['date_first', 'date_few', 'date_flirty', 'date_awhile'];
      stage = dateStages[Math.floor(Math.random() * dateStages.length)];
    } else if (selectedRel === 'partner') {
      const partnerStages = ['partner_datenight', 'partner_reconnect', 'partner_new'];
      stage = partnerStages[Math.floor(Math.random() * partnerStages.length)];
    } else if (selectedRel === 'friends') {
      stage = 'friends_good';
    } else if (selectedRel === 'family') {
      stage = 'family_general';
    }

    onConfirm({
      relationship: selectedRel,
      relationshipStage: stage,
      vibe: selectedVibe,
      duration: selectedDur,
      intensity: selectedInt,
      isPremiumUnlocked
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          className="relative w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 select-none space-y-5"
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
          <div className="space-y-1 text-center pr-6">
            <span className="text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5" style={{ color: 'var(--color-accent)' }}>
              <Dices className="w-3.5 h-3.5" />
              Surprise Me Mode
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
              Laat het lot jullie gesprek sturen.
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-light max-w-xs mx-auto">
              We hebben willekeurig een unieke combinatie samengesteld voor dit moment.
            </p>
          </div>

          {/* Randomized Outcome Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={rollCount}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
              className="border rounded-2xl p-4.5 space-y-3.5"
            >
              {/* Vibe */}
              <div 
                style={{ borderColor: 'var(--border-subtle)' }}
                className="flex items-center justify-between gap-3 pb-3 border-b"
              >
                <div className="flex items-center gap-3">
                  <div 
                    style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  >
                    <VibeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                      Sfeer & Energie
                    </span>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {vibeObj.title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid with Duration and Intensity */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div 
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                  className="p-3 rounded-xl border space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs">
                    <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                    <span className="text-[10px] uppercase tracking-wider font-mono">Duur</span>
                  </div>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    {durObj.label}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-light truncate">
                    {durObj.sub}
                  </div>
                </div>

                <div 
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                  className="p-3 rounded-xl border space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] uppercase tracking-wider font-mono">Intensiteit</span>
                  </div>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    {intensityLabel}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-light truncate">
                    {selectedRel ? relObj.label : 'Verrassend'}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleStart}
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
              className="w-full h-12 rounded-xl active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Start deze verrassingssessie</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={rollNewConfig}
              disabled={isRolling}
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
              className="w-full h-11 rounded-xl border active:scale-[0.98] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>🎲 Opnieuw dobbelen</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

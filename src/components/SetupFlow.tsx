import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Users, 
  Home, 
  Dices, 
  Briefcase, 
  Layers, 
  Smile, 
  Compass, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  ArrowLeft,
  Palette,
  User
} from 'lucide-react';
import { RelationshipType, VibeType, DurationType, IntensitySetting, SessionConfig, UserProfile } from '../types';

interface SetupFlowProps {
  onStartSession: (config: SessionConfig) => void;
  onOpenPaywall: () => void;
  onOpenProfile: () => void;
  onOpenSurprise: () => void;
  onOpenTheme: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  userProfile: UserProfile;
  isPremiumUnlocked: boolean;
}

export const SetupFlow: React.FC<SetupFlowProps> = ({
  onStartSession,
  onOpenPaywall,
  onOpenProfile,
  onOpenSurprise,
  onOpenTheme,
  onOpenFavorites,
  favoritesCount,
  userProfile,
  isPremiumUnlocked
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [relationship, setRelationship] = useState<RelationshipType>('date');
  const [vibe, setVibe] = useState<VibeType>('leren_kennen');
  const [duration, setDuration] = useState<DurationType>('15min');
  const [intensity, setIntensity] = useState<IntensitySetting>('personal');

  // Next and Back handlers
  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
    } else {
      onStartSession({
        relationship,
        vibe,
        duration,
        intensity,
        isPremiumUnlocked
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen max-w-md mx-auto px-5 py-6 sm:py-8">
      {/* Top Bar with Brand, Favorites, Theme Button & Profile Pill */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Vorige stap"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="font-editorial text-lg tracking-tight text-[var(--text-primary)] font-medium">
              Tussen Ons
            </span>
          )}
        </div>

        {/* Top Right Actions: Favorites, Theme Selector & User Profile */}
        <div className="flex items-center gap-1.5">
          {/* Quick Favorites Button */}
          <button
            onClick={onOpenFavorites}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-xs transition-all cursor-pointer relative"
            title="Bekijk bewaarde favoriete vragen"
          >
            <Heart 
              className="w-3.5 h-3.5 transition-colors" 
              style={{ 
                color: 'var(--color-accent)', 
                fill: favoritesCount > 0 ? 'var(--color-accent)' : 'transparent' 
              }} 
            />
            <span className="font-medium text-[11px] hidden xs:inline">Favorieten</span>
            {favoritesCount > 0 && (
              <span 
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                className="text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold"
              >
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Quick Theme Switcher Button */}
          <button
            onClick={onOpenTheme}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-xs transition-all cursor-pointer"
            title="Kies een andere lay-out / stijl"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
            <span className="font-medium text-[11px] hidden sm:inline">Stijl</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={onOpenProfile}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs text-[var(--text-primary)] shadow-xs transition-all cursor-pointer"
            title="Profiel aanpassen"
          >
            <span className="text-sm leading-none">{userProfile.avatar || '✨'}</span>
            <span className="font-medium max-w-[65px] truncate text-[11px]">{userProfile.name || 'Jij'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepOneRelationship
              key="step1"
              selected={relationship}
              onSelect={setRelationship}
              userProfile={userProfile}
              onOpenProfile={onOpenProfile}
              onOpenSurprise={onOpenSurprise}
              onOpenFavorites={onOpenFavorites}
              favoritesCount={favoritesCount}
            />
          )}

          {step === 2 && (
            <StepTwoVibe
              key="step2"
              selected={vibe}
              onSelect={setVibe}
            />
          )}

          {step === 3 && (
            <StepThreeDuration
              key="step3"
              selected={duration}
              onSelect={setDuration}
            />
          )}

          {step === 4 && (
            <StepFourIntensity
              key="step4"
              selected={intensity}
              onSelect={setIntensity}
              onOpenPaywall={onOpenPaywall}
              isPremiumUnlocked={isPremiumUnlocked}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-4 space-y-2">
        <button
          onClick={handleNext}
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
          className="w-full h-13 rounded-2xl active:scale-[0.98] font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {step === 4 ? (
            'Begin gesprek'
          ) : (
            <>
              Verder <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>

        {/* Quick Surprise Me trigger button available from any step */}
        {step > 1 && (
          <button
            onClick={onOpenSurprise}
            className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
            <span>Of laat het lot beslissen met Surprise Me</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   STEP 1: WIE ZIT ER TEGENOVER JE?
---------------------------------------------------- */
interface StepOneProps {
  selected: RelationshipType;
  onSelect: (val: RelationshipType) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenSurprise: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
}

const StepOneRelationship: React.FC<StepOneProps> = ({ 
  selected, 
  onSelect,
  userProfile,
  onOpenProfile,
  onOpenSurprise,
  onOpenFavorites,
  favoritesCount
}) => {
  const options = [
    {
      id: 'date',
      title: 'Eerste Date',
      subtitle: 'Nieuwsgierig aftasten, lachen & chemie ontdekken',
      icon: Heart,
      available: true
    },
    {
      id: 'partner',
      title: 'Mijn Partner',
      subtitle: 'Samen verdiepen, herinneringen ophalen & herontdekken',
      icon: Sparkles,
      available: true
    },
    {
      id: 'friends',
      title: 'Vrienden & Vriendschap',
      subtitle: 'Gêne laten vallen, ontwapenende verhalen & loyaliteit',
      icon: Users,
      available: true
    },
    {
      id: 'family',
      title: 'Familie',
      subtitle: 'Generatiebruggen bouwen & warme anekdotes delen',
      icon: Home,
      available: true
    },
    {
      id: 'group',
      title: 'Groepsijsbrekers',
      subtitle: 'Tafelgesprekken, snelle dilemma’s & speelse aanwijzingen',
      icon: Layers,
      available: true
    },
    {
      id: 'surprise',
      title: 'Verras Me (Willekeurige Sessie)',
      subtitle: 'Willekeurige sfeer, duur & intensiteit voor een uniek moment',
      icon: Dices,
      available: true,
      isSurpriseAction: true
    },
    {
      id: 'work',
      title: 'Collega / Werk',
      subtitle: 'Professioneel maar oprecht en menselijk',
      icon: Briefcase,
      available: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Personalized Greeting Header with User Profile */}
      <div 
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        className="border rounded-2xl p-3.5 flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div 
            style={{ backgroundColor: 'var(--color-accent-subtle)', borderColor: 'var(--border-subtle)' }}
            className="w-10 h-10 rounded-xl text-xl flex items-center justify-center border"
          >
            {userProfile.avatar || '✨'}
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] font-light">
              Ingelogd als
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {userProfile.name || 'Jij'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          style={{ color: 'var(--color-accent)' }}
          className="text-xs hover:underline font-medium transition-colors px-2 py-1 cursor-pointer"
        >
          Wijzig profiel
        </button>
      </div>

      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Gezelschap
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
          Met wie praat {userProfile.name || 'jij'} vandaag?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light">
          We stemmen de toon, intensiteit en interacties nauwkeurig af.
        </p>
      </div>

      {/* Quick link to Favorites if user has any saved */}
      {favoritesCount > 0 && (
        <button
          onClick={onOpenFavorites}
          style={{ backgroundColor: 'var(--color-accent-subtle)', borderColor: 'var(--border-subtle)' }}
          className="w-full p-3 rounded-2xl border flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div 
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
            >
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <span>Opgeslagen Favorieten</span>
                <span 
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold"
                >
                  {favoritesCount}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] font-light">
                Herbeleef of speel direct jullie bewaarde vragen
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-accent)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;

          if (!opt.available) {
            return (
              <div
                key={opt.id}
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
                className="w-full text-left p-3.5 rounded-2xl border opacity-50 flex items-center justify-between cursor-not-allowed"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    style={{ backgroundColor: 'var(--bg-card)' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)]"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-muted)]">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-light">
                      {opt.subtitle}
                    </div>
                  </div>
                </div>
                <span 
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}
                  className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded"
                >
                  Binnenkort
                </span>
              </div>
            );
          }

          const handleClick = () => {
            if (opt.isSurpriseAction) {
              onSelect('surprise');
              onOpenSurprise();
            } else {
              onSelect(opt.id as RelationshipType);
            }
          };

          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              onClick={handleClick}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card)',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--bg-card-subtle)',
                    color: isSelected ? 'var(--color-accent-text)' : 'var(--color-accent)'
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-xs"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    {opt.title}
                    {opt.isSurpriseAction && (
                      <span 
                        style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                        className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded"
                      >
                        🎲 Aanrader
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-light">
                    {opt.subtitle}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ----------------------------------------------------
   STEP 2: WAAR HEBBEN JULLIE ZIN IN? (VIBE)
---------------------------------------------------- */
interface StepTwoProps {
  selected: VibeType;
  onSelect: (val: VibeType) => void;
}

const StepTwoVibe: React.FC<StepTwoProps> = ({ selected, onSelect }) => {
  const vibes = [
    {
      id: 'lachen',
      title: 'Lachen & Luchtig',
      description: 'Gêne vermijden, ontwapenende blunders en humor',
      icon: Smile
    },
    {
      id: 'leren_kennen',
      title: 'Elkaar Leren Kennen',
      description: 'Nieuwsgierig, gewoontes, muziek en dromen',
      icon: Compass
    },
    {
      id: 'flirten',
      title: 'Flirten & Spanning',
      description: 'Lichaamstaal, chemie, complimenten en stiltes',
      icon: Flame
    },
    {
      id: 'dieper',
      title: 'Echt Dieper Gaan',
      description: 'Waarden, kwetsbaarheid en wat je zelden deelt',
      icon: Sparkles
    },
    {
      id: 'verrassend',
      title: 'Onverwacht & Verrassend',
      description: 'Sociale opdrachten, snelle dilemma’s en raadsels',
      icon: Dices
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Sfeer
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
          Waar hebben jullie zin in?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light">
          Kies de energie die past bij dit moment en jullie drankje.
        </p>
      </div>

      <div className="space-y-2.5">
        {vibes.map((item) => {
          const Icon = item.icon;
          const isSelected = selected === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(item.id as VibeType)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card)',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--bg-card-subtle)',
                  color: isSelected ? 'var(--color-accent-text)' : 'var(--color-accent)'
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                  {item.title}
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-light">
                  {item.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ----------------------------------------------------
   STEP 3: HOE LANG HEBBEN JULLIE? (DURATION)
---------------------------------------------------- */
interface StepThreeProps {
  selected: DurationType;
  onSelect: (val: DurationType) => void;
}

const StepThreeDuration: React.FC<StepThreeProps> = ({ selected, onSelect }) => {
  const durations = [
    {
      id: '5min',
      label: '5 Minuten',
      subtitle: 'Snelle ijsbreker bij het eerste drankje (± 5 kaarten)',
      badge: 'Snel'
    },
    {
      id: '15min',
      label: '15 Minuten',
      subtitle: 'De perfecte balans voor een fijne dynamiek (± 9 kaarten)',
      badge: 'Populair'
    },
    {
      id: '30min',
      label: '30 Minuten',
      subtitle: 'Uitgebreid natafelen en rustig doorpraten (± 14 kaarten)',
      badge: 'Verdiepend'
    },
    {
      id: 'unlimited',
      label: 'Geen Tijdslimiet',
      subtitle: 'Speel door zolang het gesprek vanzelf blijft stromen',
      badge: 'Eindeloos'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Tijdsduur
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
          Hoe lang hebben jullie?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light">
          Geen zorgen, jullie kunnen op elk gewenst moment stoppen of pauzeren.
        </p>
      </div>

      <div className="space-y-3">
        {durations.map((item) => {
          const isSelected = selected === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(item.id as DurationType)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card)',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    · {item.badge}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] font-light">
                  {item.subtitle}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                }}
                className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ----------------------------------------------------
   STEP 4: HOE SPANNEND MAG HET WORDEN? (INTENSITY)
---------------------------------------------------- */
interface StepFourProps {
  selected: IntensitySetting;
  onSelect: (val: IntensitySetting) => void;
  onOpenPaywall: () => void;
  isPremiumUnlocked: boolean;
}

const StepFourIntensity: React.FC<StepFourProps> = ({
  selected,
  onSelect,
  onOpenPaywall,
  isPremiumUnlocked
}) => {
  const levels = [
    {
      id: 'easy',
      title: 'Easy & Veilig',
      subtitle: 'Luchtige ijsbrekers, observaties en humor. Niemand voelt zich bezwaard.',
      isLocked: false
    },
    {
      id: 'personal',
      title: 'Persoonlijk & Oprecht',
      subtitle: 'Echte gewoontes, verlangens en kleine bekentenissen.',
      isLocked: false
    },
    {
      id: 'deep',
      title: 'Deep & Intiem',
      subtitle: 'Volledig ongefilterde vragen, kwetsbaarheid en romantische chemie.',
      isLocked: !isPremiumUnlocked
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Intensiteit
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
          Hoe spannend mag het worden?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light">
          Onze sessie-engine bouwt de diepgang altijd geleidelijk op.
        </p>
      </div>

      <div className="space-y-3">
        {levels.map((item) => {
          const isSelected = selected === item.id;

          const handleClick = () => {
            if (item.isLocked) {
              onOpenPaywall();
            } else {
              onSelect(item.id as IntensitySetting);
            }
          };

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={handleClick}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card)',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                    {item.title}
                  </span>
                  {item.isLocked && (
                    <span 
                      style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--color-accent)' }}
                      className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded"
                    >
                      <Lock className="w-3 h-3" /> Plus
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                  {item.subtitle}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                }}
                className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1"
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Users, 
  Home, 
  Layers, 
  Dices, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Smile,
  Compass,
  Flame,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Edit2
} from 'lucide-react';
import { 
  RelationshipType, 
  RelationshipStage, 
  VibeType, 
  DurationType, 
  IntensitySetting, 
  SessionConfig, 
  UserProfile 
} from '../types';

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

type SetupStep = 1 | 2 | 3 | 4 | 5;

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
  const [step, setStep] = useState<SetupStep>(1);

  // Selections
  const [relationship, setRelationship] = useState<RelationshipType>('date');
  const [relationshipStage, setRelationshipStage] = useState<RelationshipStage>('date_first');
  const [vibe, setVibe] = useState<VibeType>('leren_kennen');
  const [duration, setDuration] = useState<DurationType>('15min');
  const [intensity, setIntensity] = useState<IntensitySetting>('personal');

  // Automatically update stage default when relationship changes
  const handleSelectRelationship = (rel: RelationshipType) => {
    setRelationship(rel);
    if (rel === 'date') setRelationshipStage('date_first');
    else if (rel === 'partner') setRelationshipStage('partner_datenight');
    else if (rel === 'friends') setRelationshipStage('friends_good');
    else if (rel === 'family') setRelationshipStage('family_general');
    else setRelationshipStage('any');
  };

  // Next and Back handlers
  const handleNext = () => {
    if (step < 5) {
      setStep((prev) => Math.min(5, prev + 1) as SetupStep);
    } else {
      onStartSession({
        relationship,
        relationshipStage,
        vibe,
        duration,
        intensity,
        isPremiumUnlocked
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => Math.max(1, prev - 1) as SetupStep);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen max-w-md mx-auto px-5 py-5 sm:py-7">
      {/* Top Bar with Brand, Favorites, Theme Button & Profile Pill */}
      <div className="sticky top-0 z-30 flex items-center justify-between py-2 bg-[var(--bg-app)]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Vorige stap"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="font-editorial text-lg tracking-tight text-[var(--text-primary)] font-semibold px-1">
              Tussen Ons
            </span>
          )}
        </div>

        {/* Top Right Actions */}
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
              onSelect={handleSelectRelationship}
              userProfile={userProfile}
              onOpenProfile={onOpenProfile}
              onOpenSurprise={onOpenSurprise}
              onOpenFavorites={onOpenFavorites}
              favoritesCount={favoritesCount}
            />
          )}

          {step === 2 && (
            <StepTwoStage
              key="step2"
              relationship={relationship}
              selected={relationshipStage}
              onSelect={setRelationshipStage}
            />
          )}

          {step === 3 && (
            <StepThreeVibe
              key="step3"
              selected={vibe}
              onSelect={setVibe}
            />
          )}

          {step === 4 && (
            <StepFourDuration
              key="step4"
              selected={duration}
              onSelect={setDuration}
            />
          )}

          {step === 5 && (
            <StepFiveIntensity
              key="step5"
              selected={intensity}
              onSelect={setIntensity}
              onOpenPaywall={onOpenPaywall}
              isPremiumUnlocked={isPremiumUnlocked}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-3 space-y-2">
        <button
          onClick={handleNext}
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
          className="w-full h-12.5 rounded-2xl active:scale-[0.98] font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {step === 5 ? (
            'Begin gesprek'
          ) : (
            <>
              Verder <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>

        {/* Step indicator dots & Privacy badge */}
        <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i === step ? 'var(--color-accent)' : i < step ? 'var(--border-focus)' : 'var(--border-subtle)',
                  width: i === step ? '18px' : '6px'
                }}
                className="h-1.5 rounded-full transition-all duration-300"
              />
            ))}
          </div>

          <div className="flex items-center gap-1 font-light text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)] opacity-80" />
            <span>100% privé tussen jullie</span>
          </div>
        </div>
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
      title: 'Date',
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
      className="space-y-3.5"
    >
      {/* Light Player Badge Header (Refined, no 'Ingelogd als') */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{userProfile.avatar || '✨'}</span>
          <span className="font-semibold text-[var(--text-primary)]">{userProfile.name || 'Jij'}</span>
        </div>
        <button
          onClick={onOpenProfile}
          style={{ color: 'var(--color-accent)' }}
          className="hover:underline flex items-center gap-1 cursor-pointer font-medium text-[11px]"
        >
          <Edit2 className="w-3 h-3" />
          <span>Wijzig</span>
        </button>
      </div>

      {/* Prominent Two-Route Choice: Zelf samenstellen vs Verras ons */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          style={{ 
            backgroundColor: 'var(--color-accent-subtle)', 
            borderColor: 'var(--color-accent)' 
          }}
          className="p-3 rounded-2xl border text-center font-medium text-xs flex flex-col items-center justify-center gap-1 shadow-2xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="font-semibold text-[var(--color-accent)]">Zelf samenstellen</span>
        </div>

        <button
          onClick={onOpenSurprise}
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-subtle)', 
            color: 'var(--text-primary)' 
          }}
          className="p-3 rounded-2xl border text-center font-medium text-xs flex flex-col items-center justify-center gap-1 shadow-2xs cursor-pointer hover:border-[var(--color-accent)] transition-all active:scale-[0.98]"
        >
          <Dices className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="font-semibold">🎲 Verras ons direct</span>
        </button>
      </div>

      <div className="space-y-0.5">
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
          className="w-full p-2.5 rounded-2xl border flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <div 
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
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
              <div className="text-[10px] text-[var(--text-secondary)] font-light">
                Herbeleef of speel direct jullie bewaarde vragen
              </div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Options List */}
      <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;

          if (!opt.available) {
            return (
              <div
                key={opt.id}
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
                className="w-full text-left p-3 rounded-2xl border opacity-50 flex items-center justify-between cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div 
                    style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[var(--text-muted)]">
                      {opt.title}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-light">
                      {opt.subtitle}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                  Binnenkort
                </span>
              </div>
            );
          }

          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.id as RelationshipType)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card)',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--bg-card-subtle)',
                    color: isSelected ? 'var(--color-accent-text)' : 'var(--color-accent)'
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                    {opt.title}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-light">
                    {opt.subtitle}
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                }}
                className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2"
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
   STEP 2: HOE GOED KENNEN JULLIE ELKAAR? (RELATIONSHIP STAGE)
---------------------------------------------------- */
interface StepTwoStageProps {
  relationship: RelationshipType;
  selected: RelationshipStage;
  onSelect: (val: RelationshipStage) => void;
}

const StepTwoStage: React.FC<StepTwoStageProps> = ({ relationship, selected, onSelect }) => {
  // Dynamically configure stages based on relationship
  let stages: { id: RelationshipStage; title: string; subtitle: string }[] = [];

  if (relationship === 'date') {
    stages = [
      { id: 'date_first', title: 'Eerste ontmoeting', subtitle: 'We kennen elkaar nauwelijks, aftasten & eerste indruk' },
      { id: 'date_few', title: 'Een paar dates', subtitle: 'We zijn elkaar aan het ontdekken en ontspannen' },
      { id: 'date_awhile', title: 'We daten al even', subtitle: 'Er is al vertrouwen, speelsheid en openheid' },
      { id: 'date_serious', title: 'Het wordt serieuzer', subtitle: 'Kijken naar de toekomst, waarden en diepere connectie' },
      { id: 'date_flirty', title: 'Flirty avond', subtitle: 'Chemie, aantrekkingskracht en speelse spanning' }
    ];
  } else if (relationship === 'partner') {
    stages = [
      { id: 'partner_new', title: 'Net samen', subtitle: 'Verliefd, nieuwsgierig naar elkaars werelden' },
      { id: 'partner_long', title: 'Al langer samen', subtitle: 'Vertrouwd, warm en herinneringen ophalen' },
      { id: 'partner_datenight', title: 'Date night', subtitle: 'Even quality time en exclusieve aandacht voor elkaar' },
      { id: 'partner_reconnect', title: 'Weer eens écht praten', subtitle: 'Voorbij de dagelijkse routine en praktische lijstjes' },
      { id: 'partner_deep', title: 'Kennen elkaar door en door', subtitle: 'Diepe intimiteit en ongefilterde kwetsbaarheid' }
    ];
  } else if (relationship === 'friends') {
    stages = [
      { id: 'friends_new', title: 'Nieuwe vrienden', subtitle: 'IJs breken, hobby\'s en verhalen delen' },
      { id: 'friends_good', title: 'Goede vrienden', subtitle: 'Gêne laten vallen, loyaliteit en goede gesprekken' },
      { id: 'friends_best', title: 'Beste vrienden', subtitle: 'Geen geheimen, elkaars verleden en herkenning' },
      { id: 'friends_group', title: 'Vriendengroep', subtitle: 'Groepsdynamiek, anekdotes en snelle dilemma\'s' }
    ];
  } else if (relationship === 'family') {
    stages = [
      { id: 'family_parent_child', title: 'Ouder / kind', subtitle: 'Generatiebruggen, dankbaarheid en mooie verhalen' },
      { id: 'family_siblings', title: 'Broer / zus', subtitle: 'Jeugdherinneringen, binnenpretjes en herkenning' },
      { id: 'family_general', title: 'Familie algemeen', subtitle: 'Warmte, gezelligheid en familietradities' }
    ];
  } else {
    stages = [
      { id: 'any', title: 'Alle niveaus', subtitle: 'Geschikt voor elk type gezelschap' }
    ];
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-3.5"
    >
      <div className="space-y-0.5">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Relatiefase
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
          Hoe goed kennen jullie elkaar?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light">
          Hiermee voorkomen we vragen die te vroeg of juist te algemeen aanvoelen.
        </p>
      </div>

      <div className="space-y-2.5">
        {stages.map((stg) => {
          const isSelected = selected === stg.id;

          return (
            <motion.button
              key={stg.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(stg.id)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card)',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  {stg.title}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-light">
                  {stg.subtitle}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                }}
                className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2"
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
   STEP 3: WAAR HEBBEN JULLIE ZIN IN? (VIBE)
---------------------------------------------------- */
interface StepThreeProps {
  selected: VibeType;
  onSelect: (val: VibeType) => void;
}

const StepThreeVibe: React.FC<StepThreeProps> = ({ selected, onSelect }) => {
  const vibes = [
    {
      id: 'lachen',
      title: 'Lachen & Luchtig',
      description: 'Gêne laten vallen, blunders en herkenbare situaties',
      icon: Smile
    },
    {
      id: 'leren_kennen',
      title: 'Leren Kennen & Verwondering',
      description: 'Gewoontes, verborgen talenten en dromen',
      icon: Compass
    },
    {
      id: 'flirten',
      title: 'Flirten & Spanning',
      description: 'Lichaamstaal, chemie, complimenten en subtiele stiltes',
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
      description: 'Secret picks, sociale challenges en snelle dilemma’s',
      icon: Dices
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-3.5"
    >
      <div className="space-y-0.5">
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
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--bg-card-subtle)',
                  color: isSelected ? 'var(--color-accent-text)' : 'var(--color-accent)'
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                  {item.title}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-light">
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
   STEP 4: HOE LANG HEBBEN JULLIE? (DURATION)
---------------------------------------------------- */
interface StepFourProps {
  selected: DurationType;
  onSelect: (val: DurationType) => void;
}

const StepFourDuration: React.FC<StepFourProps> = ({ selected, onSelect }) => {
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
      className="space-y-3.5"
    >
      <div className="space-y-0.5">
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

      <div className="space-y-2.5">
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
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    · {item.badge}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-light">
                  {item.subtitle}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                }}
                className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2"
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
   STEP 5: HOE VER GAAN WE? (INTENSITY & PERSOONLIJK)
---------------------------------------------------- */
interface StepFiveProps {
  selected: IntensitySetting;
  onSelect: (val: IntensitySetting) => void;
  onOpenPaywall: () => void;
  isPremiumUnlocked: boolean;
}

const StepFiveIntensity: React.FC<StepFiveProps> = ({
  selected,
  onSelect,
  onOpenPaywall,
  isPremiumUnlocked
}) => {
  const levels = [
    {
      id: 'easy',
      title: 'Luchtig & Speels',
      subtitle: 'IJsbrekers, observaties en humor. Niemand voelt zich bezwaard of in verlegenheid gebracht.',
      isLocked: false
    },
    {
      id: 'personal',
      title: 'Persoonlijk & Oprecht',
      subtitle: 'Echte gewoontes, dromen, waarden en leuke kleine bekentenissen.',
      isLocked: false
    },
    {
      id: 'deep',
      title: 'Diep & Kwetsbaar',
      subtitle: 'Ongefilterde openheid, levenslessen en betekenisvolle connectie.',
      isLocked: !isPremiumUnlocked
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-3.5"
    >
      <div className="space-y-0.5">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Diepgang
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-medium leading-tight">
          Hoe persoonlijk mag het worden?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light">
          De engine bouwt de intensiteit altijd natuurlijk op en sluit positief af.
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
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </span>
                  {item.isLocked && (
                    <span 
                      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                      className="text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase font-bold tracking-wider"
                    >
                      Plus
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed">
                  {item.subtitle}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                }}
                className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2"
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

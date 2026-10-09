import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Users, 
  Home, 
  Layers, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  Smile,
  Compass,
  Flame,
  Dices,
  Palette,
  ShieldCheck,
  Check,
  Edit2,
  Lightbulb
} from 'lucide-react';
import { 
  RelationshipType, 
  RelationshipStage, 
  VibeType, 
  DurationType, 
  SessionConfig, 
  UserProfile 
} from '../types';

export interface SetupFlowProps {
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

export type SetupStep = 1 | 2 | 3 | 4;

export const SetupFlow: React.FC<SetupFlowProps> = ({
  onStartSession,
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

  // Automatically update stage default when relationship changes
  const handleSelectRelationship = (rel: RelationshipType) => {
    setRelationship(rel);
    if (rel === 'date') setRelationshipStage('date_first');
    else if (rel === 'partner') setRelationshipStage('partner_datenight');
    else if (rel === 'friends') setRelationshipStage('friends_good');
    else if (rel === 'family') setRelationshipStage('family_general');
    else if (rel === 'creative') setRelationshipStage('any');
    else setRelationshipStage('any');
  };

  // Next and Back handlers
  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => Math.min(4, prev + 1) as SetupStep);
    } else {
      onStartSession({
        relationship,
        relationshipStage,
        vibe,
        duration,
        intensity: 'personal',
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
    <div className="flex flex-col justify-between min-h-[calc(100vh-28px-16px)] max-w-md mx-auto px-5 py-4 sm:py-6">
      {/* Top Bar with Brand, Favorites, Theme Button & Profile Pill */}
      <div className="sticky top-0 z-30 flex items-center justify-between pb-3 bg-[var(--bg-app)]/85 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="w-9 h-9 flex items-center justify-center -ml-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
              aria-label="Vorige stap"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
          ) : (
            <span className="font-editorial text-lg tracking-tight text-[var(--text-primary)] font-semibold px-0.5">
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-2xs transition-all cursor-pointer relative"
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-2xs transition-all cursor-pointer"
            title="Kies een andere lay-out / stijl"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
            <span className="font-medium text-[11px] hidden sm:inline">Stijl</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={onOpenProfile}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs text-[var(--text-primary)] shadow-2xs transition-all cursor-pointer"
            title="Profiel aanpassen"
          >
            <span className="text-sm leading-none">{userProfile.avatar || '✨'}</span>
            <span className="font-medium max-w-[65px] truncate text-[11px]">{userProfile.name || 'Jij'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Spacious single-column editorial step */}
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
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Actions with generous negative space */}
      <div className="pt-5 space-y-3">
        <button
          onClick={handleNext}
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
          className="w-full h-12.5 rounded-2xl active:scale-[0.98] font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <span>{step === 4 ? 'Begin gesprek' : 'Verder'}</span>
          {step < 4 && <ArrowRight className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Step indicator dots & Privacy badge */}
        <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i === step ? 'var(--color-accent)' : i < step ? 'var(--border-focus)' : 'var(--border-subtle)',
                  width: i === step ? '20px' : '6px'
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
}

const StepOneRelationship: React.FC<StepOneProps> = ({ 
  selected, 
  onSelect,
  userProfile,
  onOpenProfile,
  onOpenSurprise
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
      id: 'creative',
      title: 'Creatieve Vonk',
      subtitle: 'Ideeën laten vonken, out-of-the-box dromen & verbeelding',
      icon: Lightbulb,
      available: true
    },
    {
      id: 'group',
      title: 'Groepsijsbrekers',
      subtitle: 'Tafelgesprekken, snelle dilemma’s & speelse dynamiek',
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      {/* Light Player Badge Header */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{userProfile.avatar || '✨'}</span>
          <span className="font-medium text-[var(--text-primary)] text-xs">{userProfile.name || 'Jij'}</span>
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

      {/* Spacious Editorial Heading */}
      <div className="space-y-1 pt-1 pb-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Gezelschap
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-normal leading-tight">
          Met wie praat {userProfile.name || 'jij'} vandaag?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
          Kies het gezelschap voor een afgestemde dynamiek en veilige intensiteit.
        </p>
      </div>

      {/* Vertical single-column list with thin dividers */}
      <div 
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
        className="border rounded-2xl divide-y divide-[var(--border-subtle)] shadow-2xs overflow-hidden max-h-[48vh] overflow-y-auto"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;

          if (!opt.available) {
            return (
              <div
                key={opt.id}
                className="w-full text-left py-3.5 px-4.5 flex items-center justify-between opacity-40 bg-[var(--bg-card-subtle)]/40 cursor-not-allowed"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <Icon className="w-4 h-4 shrink-0 text-[var(--text-muted)]" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-[var(--text-muted)]">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-light truncate">
                      {opt.subtitle}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0 pl-2">
                  Binnenkort
                </span>
              </div>
            );
          }

          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(opt.id as RelationshipType)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent'
              }}
              className={`w-full text-left py-3.5 px-4.5 flex items-center justify-between transition-colors cursor-pointer group ${
                isSelected ? '' : 'hover:bg-[var(--bg-card-subtle)]/50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <Icon 
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                  }`} 
                />
                <div className="space-y-0.5 min-w-0">
                  <div className={`text-xs sm:text-sm tracking-tight transition-colors ${
                    isSelected ? 'font-semibold text-[var(--text-primary)]' : 'font-medium text-[var(--text-primary)]'
                  }`}>
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed line-clamp-1">
                    {opt.subtitle}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center pl-2">
                {isSelected ? (
                  <div 
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] group-hover:border-[var(--border-focus)] transition-colors" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quiet, minimalist surprise trigger replacing the bulky grid */}
      <div className="flex items-center justify-between pt-1 px-1">
        <button
          onClick={onOpenSurprise}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5 cursor-pointer font-medium py-0.5"
        >
          <Dices className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span>Liever meteen verrast worden? <strong>Kies spontaan</strong></span>
        </button>
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
  } else if (relationship === 'creative') {
    stages = [
      { id: 'any', title: 'Vrije Verbeelding', subtitle: 'Wat-als scenario\'s, filosofische gedachten en innovatie' },
      { id: 'friends_good', title: 'Creatieve Sparringpartners', subtitle: 'Elkaars ideeën versterken, wilde plannen en dromen testen' },
      { id: 'partner_deep', title: 'Diepe Verwondering', subtitle: 'Intrigerende existentiële vragen over kosmos en bewustzijn' }
    ];
  } else {
    stages = [
      { id: 'any', title: 'Alle niveaus', subtitle: 'Geschikt voor elk type gezelschap' }
    ];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div className="space-y-1 pt-1 pb-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Relatiefase
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-normal leading-tight">
          Hoe goed kennen jullie elkaar?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
          Zo sluiten de vragen naadloos aan op jullie vertrouwensband en comfortzone.
        </p>
      </div>

      {/* Vertical single-column list with thin dividers */}
      <div 
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
        className="border rounded-2xl divide-y divide-[var(--border-subtle)] shadow-2xs overflow-hidden max-h-[48vh] overflow-y-auto"
      >
        {stages.map((stg) => {
          const isSelected = selected === stg.id;

          return (
            <motion.button
              key={stg.id}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(stg.id)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent'
              }}
              className={`w-full text-left py-3.5 px-4.5 flex items-center justify-between transition-colors cursor-pointer group ${
                isSelected ? '' : 'hover:bg-[var(--bg-card-subtle)]/50'
              }`}
            >
              <div className="space-y-0.5 min-w-0 pr-3">
                <div className={`text-xs sm:text-sm tracking-tight transition-colors ${
                  isSelected ? 'font-semibold text-[var(--text-primary)]' : 'font-medium text-[var(--text-primary)]'
                }`}>
                  {stg.title}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed line-clamp-1">
                  {stg.subtitle}
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center pl-2">
                {isSelected ? (
                  <div 
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] group-hover:border-[var(--border-focus)] transition-colors" />
                )}
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
      description: 'Secret picks, speelse challenges en snelle dilemma’s',
      icon: Dices
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div className="space-y-1 pt-1 pb-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Sfeer
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-normal leading-tight">
          Waar hebben jullie zin in?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
          Kies de energie die past bij dit moment en jullie drankje.
        </p>
      </div>

      {/* Vertical single-column list with thin dividers */}
      <div 
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
        className="border rounded-2xl divide-y divide-[var(--border-subtle)] shadow-2xs overflow-hidden max-h-[48vh] overflow-y-auto"
      >
        {vibes.map((item) => {
          const Icon = item.icon;
          const isSelected = selected === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(item.id as VibeType)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent'
              }}
              className={`w-full text-left py-3.5 px-4.5 flex items-center justify-between transition-colors cursor-pointer group ${
                isSelected ? '' : 'hover:bg-[var(--bg-card-subtle)]/50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <Icon 
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                  }`} 
                />
                <div className="space-y-0.5 min-w-0">
                  <div className={`text-xs sm:text-sm tracking-tight transition-colors ${
                    isSelected ? 'font-semibold text-[var(--text-primary)]' : 'font-medium text-[var(--text-primary)]'
                  }`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed line-clamp-1">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center pl-2">
                {isSelected ? (
                  <div 
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] group-hover:border-[var(--border-focus)] transition-colors" />
                )}
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
      subtitle: 'Snelle ijsbreker bij het eerste drankje (± 5 kaarten)'
    },
    {
      id: '15min',
      label: '15 Minuten',
      subtitle: 'De perfecte balans voor een fijne dynamiek (± 9 kaarten)'
    },
    {
      id: '30min',
      label: '30 Minuten',
      subtitle: 'Uitgebreid natafelen en rustig doorpraten (± 14 kaarten)'
    },
    {
      id: 'unlimited',
      label: 'Geen Tijdslimiet',
      subtitle: 'Speel door zolang het gesprek vanzelf blijft stromen (rondes van 5)'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div className="space-y-1 pt-1 pb-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
          Tijdsduur
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-normal leading-tight">
          Hoe lang hebben jullie?
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
          Een richtlijn voor de sessie — jullie kunnen op elk moment pauzeren of afronden.
        </p>
      </div>

      {/* Vertical single-column list with thin dividers */}
      <div 
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
        className="border rounded-2xl divide-y divide-[var(--border-subtle)] shadow-2xs overflow-hidden max-h-[48vh] overflow-y-auto"
      >
        {durations.map((item) => {
          const isSelected = selected === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(item.id as DurationType)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent'
              }}
              className={`w-full text-left py-3.5 px-4.5 flex items-center justify-between transition-colors cursor-pointer group ${
                isSelected ? '' : 'hover:bg-[var(--bg-card-subtle)]/50'
              }`}
            >
              <div className="space-y-0.5 min-w-0 pr-3">
                <div className={`text-xs sm:text-sm tracking-tight transition-colors ${
                  isSelected ? 'font-semibold text-[var(--text-primary)]' : 'font-medium text-[var(--text-primary)]'
                }`}>
                  {item.label}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed line-clamp-1">
                  {item.subtitle}
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center pl-2">
                {isSelected ? (
                  <div 
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-[var(--border-subtle)] group-hover:border-[var(--border-focus)] transition-colors" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export { SetupFlow as ScreenConfig };
export default SetupFlow;

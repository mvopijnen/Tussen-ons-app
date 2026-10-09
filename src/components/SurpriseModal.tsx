import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowRight,
  Heart,
  Users,
  Home,
  Lightbulb,
  Layers,
  LucideIcon
} from 'lucide-react';
import { 
  RelationshipType, 
  RelationshipStage, 
  VibeType, 
  DurationType, 
  IntensitySetting, 
  SessionConfig,
  PromptItem
} from '../types';
import { PROMPTS_DATABASE } from '../data/prompts';
import { APPROVED_EERSTE_ONTMOETING_PROMPTS } from '../data/firstMeetingEngine';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: SessionConfig) => void;
  currentRelationship: RelationshipType;
  isPremiumUnlocked: boolean;
}

interface RelationshipOption {
  id: RelationshipType;
  label: string;
  icon: LucideIcon;
  sub: string;
}

const ALL_RELATIONSHIPS: RelationshipOption[] = [
  { id: 'date', label: 'Eerste Date', icon: Heart, sub: 'Nieuwsgierig aftasten & chemie' },
  { id: 'partner', label: 'Mijn Partner', icon: Sparkles, sub: 'Intimiteit & samen herontdekken' },
  { id: 'friends', label: 'Vrienden', icon: Users, sub: 'Loyaliteit, gêne weg & verhalen' },
  { id: 'family', label: 'Familie', icon: Home, sub: 'Generatiebruggen & tradities' },
  { id: 'creative', label: 'Creatieve Vonk', icon: Lightbulb, sub: 'Verbeelding, out-of-the-box & dromen' }
];

const ALL_VIBES: { id: VibeType; title: string; desc: string; icon: LucideIcon }[] = [
  { id: 'lachen', title: 'Lachen & Luchtig', desc: 'Blunders, humor en ontwapenende situaties', icon: Smile },
  { id: 'leren_kennen', title: 'Elkaar Leren Kennen', desc: 'Gewoontes, drijfveren en dromen', icon: Compass },
  { id: 'flirten', title: 'Flirten & Spanning', desc: 'Lichaamstaal, chemie en vonken', icon: Flame },
  { id: 'dieper', title: 'Echt Dieper Gaan', desc: 'Kwetsbaarheid, waarden en reflectie', icon: Sparkles },
  { id: 'verrassend', title: 'Onverwacht & Verrassend', desc: 'Sociale challenges en snelle dilemma’s', icon: Dices }
];

const ALL_DURATIONS: { id: DurationType; label: string; sub: string; countLabel: string }[] = [
  { id: '5min', label: '5 Minuten', sub: 'Snelle ijsbreker', countLabel: '± 5 kaarten' },
  { id: '15min', label: '15 Minuten', sub: 'De gouden balans', countLabel: '± 9 kaarten' },
  { id: '30min', label: '30 Minuten', sub: 'Uitgebreid natafelen', countLabel: '± 14 kaarten' },
  { id: 'unlimited', label: 'Geen Tijdslimiet', sub: 'Vrij doorpraten zolang het stroomt', countLabel: 'Rondes van 5 kaarten' }
];

interface GeneratedProfile {
  title: string;
  tagline: string;
  atmosphere: string;
  dynamic: string;
}

// Generate tailored editorial conversation profile
function generateConversationProfile(
  rel: RelationshipType,
  vibe: VibeType,
  intensity: IntensitySetting
): GeneratedProfile {
  // Profiles based on Relationship x Vibe x Intensity
  const key = `${rel}_${vibe}`;

  switch (key) {
    case 'creative_verrassend':
      return {
        title: 'De Creatieve Alchemist',
        tagline: 'Een onconventionele sessie vol verbeelding, onverwachte vraagstukken en out-of-the-box invallen.',
        atmosphere: 'Ideaal bij een laat glas wijn of espresso, schemerlicht en een open blik.',
        dynamic: 'Snelle brainstorms, speelse wat-als vragen en verrassende verbanden.'
      };
    case 'creative_dieper':
      return {
        title: 'Filosofische Verwonderaars',
        tagline: 'Vragen die voorbij de waan van de dag reiken: over dromen, het universum en het menselijk spoor.',
        atmosphere: 'Ideaal voor een rustig moment waarin tijd even mag verdwijnen.',
        dynamic: 'Stilte mag vallen, diepe fascinatie en oprechte verbeelding.'
      };
    case 'creative_lachen':
      return {
        title: 'Absurde Ideeënfabriek',
        tagline: 'Gekke gedachtenexperimenten, onlogische dilemma’s en hilarische co-creaties.',
        atmosphere: 'Luchtig, vol schaterlachen en aanstekelijke energie.',
        dynamic: 'Onvoorspelbaar, energiek en lekker tegendraads.'
      };
    case 'creative_leren_kennen':
      return {
        title: 'Verbeeldingsreizigers',
        tagline: 'Ontdek elkaars verborgen talenten, favoriete werelden en innerlijke fascinaties.',
        atmosphere: 'Nieuwsgierig en ontspannen met alle ruimte voor eigenzinnige antwoorden.',
        dynamic: 'Verrassende inzichten over hoe de ander de werkelijkheid beleeft.'
      };

    case 'date_flirten':
      return {
        title: 'Sprankelende Chemie',
        tagline: 'Lichaamstaal, subtiele stiltes en nieuwsgierige blikken die de spanning laten gloeien.',
        atmosphere: 'Kaarslicht, een zacht geroezemoes op de achtergrond en twee drankjes.',
        dynamic: 'Speels aftasten, ontwapenende glimlachen en lichte spanning.'
      };
    case 'date_lachen':
      return {
        title: 'Luchtige Vlinders',
        tagline: 'IJsbrekers, blunders en herkenbare situaties die alle eventuele zenuwen direct wegnemen.',
        atmosphere: 'Ontspannen aan de toog of tijdens een zonnige wandeling.',
        dynamic: 'Onbevangen lachen, gezellige herkenning en ontwapening.'
      };
    case 'date_dieper':
      return {
        title: 'Oprechte Verbinding',
        tagline: 'Voorbij oppervlakkige koetjes en kalfjes naar wat iemand écht drijft en bezighoudt.',
        atmosphere: 'Een rustig tafeltje waar je elkaar goed in de ogen kunt kijken.',
        dynamic: 'Veilige diepgang, oprechte aandacht en wederzijds luisteren.'
      };
    case 'date_leren_kennen':
      return {
        title: 'Eerste Ontdekkingsreis',
        tagline: 'De perfecte balans tussen nieuwsgierige gewoontes, passies en kleine levensverhalen.',
        atmosphere: 'Warm, laagdrempelig en charmant.',
        dynamic: 'Fijne afwisseling tussen vragen, dilemma’s en spontane reacties.'
      };
    case 'date_verrassend':
      return {
        title: 'Spontane Vonk',
        tagline: 'Onverwachte dilemma’s en speelse interacties die het gesprek meteen uniek maken.',
        atmosphere: 'Levendig, alert en vol verfrissende verrassingen.',
        dynamic: 'Snelle reacties en samen ontdekken hoe de ander denkt.'
      };

    case 'partner_dieper':
      return {
        title: 'Intieme Herontdekking',
        tagline: 'Even weg van de dagelijkse to-do lijstjes; samen opnieuw verdwalen in elkaars binnenwereld.',
        atmosphere: 'Op de bank met de telefoons op stil en de haard of kaars aan.',
        dynamic: 'Warmte, ongefilterde kwetsbaarheid en hernieuwde nabijheid.'
      };
    case 'partner_flirten':
      return {
        title: 'Date Night Spanning',
        tagline: 'Herontdek elkaars aantrekkingskracht en speelse kant met een knipoog.',
        atmosphere: 'Echt even uit eten of thuis een exclusief moment voor jullie twee.',
        dynamic: 'Flirterig, zelfverzekerd en vol herinnerde chemie.'
      };
    case 'partner_lachen':
      return {
        title: 'Binnenpretjes & Vrijheid',
        tagline: 'Herinneringen ophalen, elkaars gekke gewoontes vieren en samen onbedaarlijk lachen.',
        atmosphere: 'Gezellig, comfortabel en vol herkenning.',
        dynamic: 'Luchtig, ontspannen en ontwapenend vertrouwd.'
      };
    case 'partner_leren_kennen':
      return {
        title: 'Nieuwe Lagen Samen',
        tagline: 'Zelfs als je elkaar al jaren kent: ontdek dromen en verlangens die nog niet verteld waren.',
        atmosphere: 'Aandachtig, nieuwsgierig en warm.',
        dynamic: 'Verdiepende vragen die nieuwe gespreksstof openbreken.'
      };

    case 'friends_lachen':
      return {
        title: 'Ongefilterde Hilariteit',
        tagline: 'Gêne overboord, gênante herinneringen delen en ongecompliceerd genieten van elkaar.',
        atmosphere: 'Rond een biertje of pizza, luidruchtig en gezellig.',
        dynamic: 'Snelvuur, wijzen en anekdotes waar je nog jaren om zult lachen.'
      };
    case 'friends_dieper':
      return {
        title: 'Onbreekbare Band',
        tagline: 'Echte steun, loyale vriendschap en praten over wat je met bijna niemand anders deelt.',
        atmosphere: 'Laat op de avond, als de muziek zacht staat en de sfeer intiem is.',
        dynamic: 'Eerlijkheid, diepe waardering en een luisterend oor.'
      };
    case 'friends_verrassend':
      return {
        title: 'Spontane Vriendschapschaos',
        tagline: 'Geheime keuzes, sociale dilemma’s en hilarische perspectief-vragen over jullie vriendschap.',
        atmosphere: 'Speels, uitdagend en lekker onvoorspelbaar.',
        dynamic: 'Vol energie, kleine plagerijtjes en snelle interacties.'
      };
    case 'friends_leren_kennen':
      return {
        title: 'Vriendschapsverwondering',
        tagline: 'Dieper in elkaars gewoontes, passies en jeugdverhalen duiken dan tijdens een gewone borrel.',
        atmosphere: 'Ontspannen café-sfeer of wandelend in de buitenlucht.',
        dynamic: 'Nieuwsgierig, respectvol en verrijkend.'
      };

    case 'family_dieper':
      return {
        title: 'Generatiebruggen & Warmte',
        tagline: 'Mooie herinneringen, familietradities en oprechte dankbaarheid voor wat ons bindt.',
        atmosphere: 'Rond de eettafel na een gezamenlijke maaltijd.',
        dynamic: 'Rustig, respectvol en emotioneel verbindend.'
      };
    case 'family_lachen':
      return {
        title: 'Familietafel Anekdotes',
        tagline: 'Jeugdverhalen, komische familieblunders en de typische trekjes van onze stamboom.',
        atmosphere: 'Levendig, warm en vol lachende gezichten.',
        dynamic: 'Vrolijke herkenning en verhalen die van generatie op generatie doorgaan.'
      };
    case 'family_leren_kennen':
      return {
        title: 'Verborgen Familieverhalen',
        tagline: 'Ontdek verhalen uit elkaars jeugd of dromen die tijdens normale familiefeestjes blijven liggen.',
        atmosphere: 'Gezellige koffiehoek of een ontspannen zondagmiddag.',
        dynamic: 'Aandachtig, verhelderend en vol wederzijdse interesse.'
      };
    default:
      return {
        title: 'Spontane Verbinding',
        tagline: 'Laat het lot de richting bepalen voor een verrassende en ontwapenende sessie.',
        atmosphere: 'Geschikt voor elk gezelschap met zin in een goed gesprek.',
        dynamic: 'Verrassend, speels en oprecht verbindend.'
      };
  }
}

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
  const [selectedRel, setSelectedRel] = useState<RelationshipType>(currentRelationship || 'date');
  const [selectedVibe, setSelectedVibe] = useState<VibeType>('leren_kennen');
  const [selectedDur, setSelectedDur] = useState<DurationType>('15min');
  const [selectedInt, setSelectedInt] = useState<IntensitySetting>('personal');

  const rollNewConfig = () => {
    setIsRolling(true);
    setRollCount((prev) => prev + 1);

    // 1. Randomize Relationship Type from all 5 categories
    const relOptions: RelationshipType[] = ['date', 'partner', 'friends', 'family', 'creative'];
    const randomRel = relOptions[Math.floor(Math.random() * relOptions.length)];

    // 2. Randomize Vibe with category-aware harmony
    let vibeOptions: VibeType[] = ['lachen', 'leren_kennen', 'dieper', 'verrassend'];
    if (randomRel === 'date' || randomRel === 'partner') {
      vibeOptions.push('flirten');
    }
    const randomVibe = vibeOptions[Math.floor(Math.random() * vibeOptions.length)];

    // 3. Randomize Duration
    const durOptions: DurationType[] = ['5min', '15min', '30min', 'unlimited'];
    const randomDur = durOptions[Math.floor(Math.random() * durOptions.length)];

    // 4. Randomize Intensity Level
    const availableIntensities: IntensitySetting[] = isPremiumUnlocked
      ? ['easy', 'personal', 'deep']
      : ['easy', 'personal'];
    const randomInt = availableIntensities[Math.floor(Math.random() * availableIntensities.length)];

    setTimeout(() => {
      setSelectedRel(randomRel);
      setSelectedVibe(randomVibe);
      setSelectedDur(randomDur);
      setSelectedInt(randomInt);
      setIsRolling(false);
    }, 280);
  };

  useEffect(() => {
    if (isOpen) {
      rollNewConfig();
    }
  }, [isOpen]);

  const relObj = ALL_RELATIONSHIPS.find((r) => r.id === selectedRel) || ALL_RELATIONSHIPS[0];
  const vibeObj = ALL_VIBES.find((v) => v.id === selectedVibe) || ALL_VIBES[0];
  const durObj = ALL_DURATIONS.find((d) => d.id === selectedDur) || ALL_DURATIONS[1];
  const RelIcon = relObj.icon;
  const VibeIcon = vibeObj.icon;

  const profile = useMemo(() => {
    return generateConversationProfile(selectedRel, selectedVibe, selectedInt);
  }, [selectedRel, selectedVibe, selectedInt]);

  // Find an authentic teaser prompt from the matching library pool
  const teaserPrompt = useMemo<PromptItem | null>(() => {
    // If date + first meeting
    const pool = [...PROMPTS_DATABASE, ...APPROVED_EERSTE_ONTMOETING_PROMPTS];
    const matching = pool.filter((p) => {
      // Must match relationship
      const matchesRel = p.relationshipType.includes(selectedRel) || p.relationshipType.includes('surprise');
      if (!matchesRel) return false;

      // Intensity match
      if (selectedInt === 'easy' && p.intensity > 2) return false;
      if (selectedInt === 'deep' && p.intensity < 3) return false;
      if (p.premium && !isPremiumUnlocked) return false;

      // Don't pick closing prompts as the teaser preview
      if (p.emotionalTone === 'positive_landing') return false;

      return true;
    });

    if (matching.length === 0) return pool[0] || null;
    // Pick deterministic index based on roll count for variety
    return matching[rollCount % matching.length];
  }, [selectedRel, selectedVibe, selectedInt, rollCount, isPremiumUnlocked]);

  const intensityLabel =
    selectedInt === 'easy'
      ? 'Level 1-2 · Licht & Speels'
      : selectedInt === 'personal'
      ? 'Level 2-3 · Persoonlijk & Oprecht'
      : 'Level 3-5 · Deep & Intiem';

  const handleStart = () => {
    let stage: RelationshipStage = 'any';
    if (selectedRel === 'date') {
      const dateStages: RelationshipStage[] = ['date_first', 'date_few', 'date_flirty', 'date_awhile'];
      stage = dateStages[Math.floor(Math.random() * dateStages.length)];
    } else if (selectedRel === 'partner') {
      const partnerStages: RelationshipStage[] = ['partner_datenight', 'partner_reconnect', 'partner_new'];
      stage = partnerStages[Math.floor(Math.random() * partnerStages.length)];
    } else if (selectedRel === 'friends') {
      stage = 'friends_good';
    } else if (selectedRel === 'family') {
      stage = 'family_general';
    } else if (selectedRel === 'creative') {
      stage = 'any';
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
      {isOpen && (
        <motion.div
          key="surprise-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="relative w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 select-none space-y-4.5 max-h-[92vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-secondary)' }}
              className="absolute top-4.5 right-4.5 p-1.5 hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer"
              aria-label="Sluiten"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Editorial Kicker & Tailored Profile Name */}
            <div className="space-y-1.5 text-center pr-6 pl-1 pt-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5" style={{ color: 'var(--color-accent)' }}>
                <Dices className="w-3.5 h-3.5" />
                Op Maat Gemaakt Gespreksprofiel
              </span>
              <AnimatePresence mode="wait">
                <motion.h2 
                  key={profile.title}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] font-normal leading-tight"
                >
                  {profile.title}
                </motion.h2>
              </AnimatePresence>
              <p className="text-xs text-[var(--text-secondary)] font-light max-w-xs mx-auto leading-relaxed">
                {profile.tagline}
              </p>
            </div>

            {/* 4 Selected Parameters in clean single-column list with thin dividers */}
            <AnimatePresence mode="wait">
              <motion.div
                key={rollCount}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card-subtle)' }}
                className="border rounded-2xl divide-y divide-[var(--border-subtle)] shadow-2xs overflow-hidden"
              >
                {/* 1. Relationship */}
                <div className="py-2.5 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <RelIcon className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                        Gezelschap
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {relObj.label}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] font-light text-right max-w-[150px] truncate">
                    {relObj.sub}
                  </span>
                </div>

                {/* 2. Vibe */}
                <div className="py-2.5 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <VibeIcon className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                        Sfeer & Energie
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {vibeObj.title}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] font-light text-right max-w-[150px] truncate">
                    {vibeObj.desc}
                  </span>
                </div>

                {/* 3. Duration */}
                <div className="py-2.5 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                        Sessieomvang
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {durObj.label}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {durObj.countLabel}
                  </span>
                </div>

                {/* 4. Intensity */}
                <div className="py-2.5 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                        Intensiteit
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {intensityLabel}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    Afgestemd
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Authentic Teaser Prompt Preview */}
            {teaserPrompt && (
              <div 
                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
                className="p-3.5 rounded-2xl border space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                  <span>Voorproefje uit dit profiel</span>
                  <span>{teaserPrompt.category}</span>
                </div>
                <p className="text-xs text-[var(--text-primary)] font-medium italic leading-snug">
                  &ldquo;{teaserPrompt.prompt}&rdquo;
                </p>
                {teaserPrompt.subtitle && (
                  <p className="text-[11px] text-[var(--text-secondary)] font-light">
                    {teaserPrompt.subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleStart}
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                className="w-full h-12 rounded-2xl active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Start dit gesprek</span>
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
                className="w-full h-11 rounded-2xl border active:scale-[0.98] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 hover:bg-[var(--bg-card-hover)]"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>🎲 Ander profiel dobbelen</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

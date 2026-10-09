import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  HelpCircle,
  Users,
  Timer
} from 'lucide-react';
import { PromptItem } from '../types';

export interface RevealState {
  step: 'waiting' | 'ready_to_reveal' | 'revealed';
  p1Choice?: string;
  p2Choice?: string;
}

export interface SecretPickState {
  step: 'p1_turn' | 'pass_phone' | 'p2_turn' | 'countdown' | 'revealed';
  p1Choice?: string;
  p2Choice?: string;
}

export interface InteractionDataState {
  selectedOption?: string;
  rapidFirePicks?: Record<string, string>;
  revealState?: RevealState;
  secretPickState?: SecretPickState;
  [key: string]: unknown;
}

interface InteractionCardProps {
  prompt: PromptItem;
  interactionData?: InteractionDataState;
  onRecordInteraction: (data: Record<string, unknown>) => void;
}

export const InteractionCard: React.FC<InteractionCardProps> = ({
  prompt,
  interactionData,
  onRecordInteraction
}) => {
  switch (prompt.interactionType) {
    case 'both_answer':
      return <BothAnswerView prompt={prompt} />;
    case 'guess':
      return <GuessView prompt={prompt} />;
    case 'point':
      return <PointView prompt={prompt} />;
    case 'would_you_rather':
      return (
        <WouldYouRatherView
          prompt={prompt}
          selectedOption={interactionData?.selectedOption}
          onSelect={(opt) => onRecordInteraction({ selectedOption: opt })}
        />
      );
    case 'challenge':
      return <ChallengeView prompt={prompt} />;
    case 'finish_the_sentence':
      return <FinishSentenceView prompt={prompt} />;
    case 'rapid_fire':
      return (
        <RapidFireView
          prompt={prompt}
          userSelections={interactionData?.rapidFirePicks || {}}
          onUpdateSelections={(picks) => onRecordInteraction({ rapidFirePicks: picks })}
        />
      );
    case 'reveal':
      return (
        <RevealView
          prompt={prompt}
          state={interactionData?.revealState}
          onUpdate={(state) => onRecordInteraction({ revealState: state })}
        />
      );
    case 'secret_pick':
      return (
        <SecretPickView
          prompt={prompt}
          state={interactionData?.secretPickState}
          onUpdate={(state) => onRecordInteraction({ secretPickState: state })}
        />
      );
    case 'ask':
    default:
      return <AskView prompt={prompt} />;
  }
};

/* ----------------------------------------------------
   1. ASK VIEW (Standaard Gespreksvraag)
---------------------------------------------------- */
const AskView: React.FC<{ prompt: PromptItem }> = ({ prompt }) => {
  return (
    <div className="flex flex-col justify-between h-full py-2">
      <div className="space-y-5 my-auto">
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] leading-tight font-medium tracking-tight">
          &ldquo;{prompt.prompt}&rdquo;
        </h2>
        
        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-md font-light">
            {prompt.subtitle}
          </p>
        )}
      </div>

      {prompt.tip && (
        <div 
          style={{ borderColor: 'var(--border-subtle)' }}
          className="mt-6 pt-4 border-t flex items-start gap-2.5 text-xs text-[var(--text-muted)]"
        >
          <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
          <span><strong className="text-[var(--text-primary)] font-medium">Gesprekstip:</strong> {prompt.tip}</span>
        </div>
      )}
    </div>
  );
};

/* ----------------------------------------------------
   2. BOTH ANSWER VIEW (Beide Personen Beantwoorden)
---------------------------------------------------- */
const BothAnswerView: React.FC<{ prompt: PromptItem }> = ({ prompt }) => {
  const [activeTurn, setActiveTurn] = useState<'p1' | 'p2'>('p1');

  return (
    <div className="flex flex-col justify-between h-full py-1">
      {/* Interactive Turn Switcher */}
      <div 
        style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
        className="flex items-center justify-center p-1 rounded-xl border self-center shadow-2xs"
      >
        <button
          onClick={() => setActiveTurn('p1')}
          style={{
            backgroundColor: activeTurn === 'p1' ? 'var(--color-accent)' : 'transparent',
            color: activeTurn === 'p1' ? 'var(--color-accent-text)' : 'var(--text-secondary)'
          }}
          className="px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shadow-xs"
        >
          Persoon 1 vertelt
        </button>
        <button
          onClick={() => setActiveTurn('p2')}
          style={{
            backgroundColor: activeTurn === 'p2' ? 'var(--color-accent)' : 'transparent',
            color: activeTurn === 'p2' ? 'var(--color-accent-text)' : 'var(--text-secondary)'
          }}
          className="px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shadow-xs"
        >
          Persoon 2 vertelt
        </button>
      </div>

      <div className="my-auto space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTurn}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div 
              style={{ color: 'var(--color-accent)' }}
              className="inline-flex items-center gap-2 text-xs tracking-wider uppercase font-semibold"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Nu aan het woord: {activeTurn === 'p1' ? 'Persoon 1' : 'Persoon 2'}</span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight font-medium">
              &ldquo;{prompt.prompt}&rdquo;
            </h2>

            {prompt.subtitle && (
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md font-light">
                {prompt.subtitle}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div 
        style={{ borderColor: 'var(--border-subtle)' }}
        className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-[var(--text-secondary)]"
      >
        <span>Beide partners krijgen de tijd om rustig uit te praten.</span>
        <button
          onClick={() => setActiveTurn(activeTurn === 'p1' ? 'p2' : 'p1')}
          style={{ color: 'var(--color-accent)' }}
          className="font-medium underline underline-offset-4 cursor-pointer"
        >
          Wissel beurt
        </button>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   3. GUESS VIEW (Persoon A voorspelt B, B onthult)
---------------------------------------------------- */
const GuessView: React.FC<{ prompt: PromptItem }> = ({ prompt }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="flex flex-col justify-between h-full py-1">
      <div className="my-auto space-y-5">
        <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight font-medium">
          &ldquo;{prompt.prompt}&rdquo;
        </h2>

        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md font-light">
            {prompt.subtitle}
          </p>
        )}

        <div 
          style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
          className="rounded-2xl p-4 sm:p-5 border space-y-3 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-accent)' }}>
              Stap 1: Spreek je gok uit
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">1 ➔ 2</span>
          </div>
          
          <p className="text-[var(--text-primary)] text-sm font-medium">
            {prompt.guessDetails?.targetPrompt || 'Wat denk je dat de ander stiekem zou zeggen?'}
          </p>

          <AnimatePresence>
            {isRevealed ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ borderColor: 'var(--border-subtle)' }}
                className="pt-3 border-t text-xs leading-relaxed text-emerald-700 dark:text-emerald-400 font-medium"
              >
                Nu is de beurt aan de ander: vertel de échte waarheid! Zat de ander dichtbij of compleet mis?
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            onClick={() => setIsRevealed(!isRevealed)}
            style={{
              backgroundColor: isRevealed ? 'var(--bg-card)' : 'var(--color-accent)',
              color: isRevealed ? 'var(--text-primary)' : 'var(--color-accent-text)',
              borderColor: 'var(--border-subtle)'
            }}
            className="w-full mt-2 py-2.5 px-4 text-xs font-medium rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-xs"
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Verberg instructie</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Stap 2: Onthul de waarheid</span>
              </>
            )}
          </button>
        </div>
      </div>

      {prompt.guessDetails?.hint && (
        <p className="text-xs text-[var(--text-muted)] italic mt-4 text-center">
          Tip: {prompt.guessDetails.hint}
        </p>
      )}
    </div>
  );
};

/* ----------------------------------------------------
   4. POINT VIEW (Wijs Iemand Aan)
---------------------------------------------------- */
const PointView: React.FC<{ prompt: PromptItem }> = ({ prompt }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasPointed, setHasPointed] = useState(false);

  // Reset cleanly when prompt changes
  useEffect(() => {
    setCountdown(null);
    setHasPointed(false);
  }, [prompt.id]);

  const startCountdown = () => {
    setHasPointed(false);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 1) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 750);
      return () => clearTimeout(timer);
    } else if (countdown === 1) {
      const timer = setTimeout(() => {
        setCountdown(null);
        setHasPointed(true);
      }, 750);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setHasPointed(true);
    }
  }, [countdown]);

  return (
    <div className="flex flex-col justify-between h-full py-1 text-center">
      <div className="my-auto space-y-6">
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] leading-tight font-medium">
          &ldquo;{prompt.prompt}&rdquo;
        </h2>

        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto font-light leading-relaxed">
            {prompt.subtitle}
          </p>
        )}

        <div className="py-4">
          {countdown !== null ? (
            <motion.div
              key={countdown}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ color: 'var(--color-accent)' }}
              className="text-6xl font-editorial font-bold"
            >
              {countdown}
            </motion.div>
          ) : hasPointed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="text-3xl font-editorial text-[var(--text-primary)] font-semibold">
                👉 Wijs nu aan! 👈
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Wijs naar jezelf of naar de ander. Waarom koos je diegene?
              </p>
              <button
                onClick={startCountdown}
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                className="px-4 py-2 rounded-xl border text-xs font-medium hover:border-[var(--color-accent)] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nog een keer aftellen</span>
              </button>
            </motion.div>
          ) : (
            <button
              onClick={startCountdown}
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
              className="px-6 py-3 text-sm font-medium rounded-xl shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Tel samen af tot 3
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        Eerste ingeving telt. Niet twijfelen!
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   5. WOULD YOU RATHER (Dilemma's A vs B)
---------------------------------------------------- */
const WouldYouRatherView: React.FC<{
  prompt: PromptItem;
  selectedOption?: string;
  onSelect: (optionId: string) => void;
}> = ({ prompt, selectedOption, onSelect }) => {
  const options = prompt.options || [
    { id: 'a', text: 'Optie A' },
    { id: 'b', text: 'Optie B' }
  ];

  return (
    <div className="flex flex-col justify-between h-full py-1">
      <div className="mb-4">
        <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight font-medium">
          {prompt.prompt}
        </h2>
        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1 font-light">
            {prompt.subtitle}
          </p>
        )}
      </div>

      <div className="my-auto space-y-3.5">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.id)}
              style={{
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card-subtle)',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all relative cursor-pointer ${
                isSelected ? 'shadow-sm ring-1 ring-[var(--color-accent)]' : 'hover:border-[var(--border-focus)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Optie {idx === 0 ? 'A' : 'B'}
                  </span>
                  <div className="text-sm sm:text-base font-medium leading-snug text-[var(--text-primary)]">
                    {opt.text}
                  </div>
                  {opt.subtext && (
                    <div className="text-xs text-[var(--text-secondary)] font-light">
                      {opt.subtext}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                    borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)',
                    color: 'var(--color-accent-text)'
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors mt-0.5"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div 
        style={{ borderColor: 'var(--border-subtle)' }}
        className="mt-4 pt-3 border-t text-xs text-[var(--text-secondary)] flex items-center justify-between"
      >
        <span>Kies jouw voorkeur en verdedig het met overtuiging.</span>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   6. CHALLENGE VIEW (Kleine Sociale Opdracht)
---------------------------------------------------- */
const ChallengeView: React.FC<{ prompt: PromptItem }> = ({ prompt }) => {
  const duration = prompt.challengeDurationSec || 20;
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Reset cleanly whenever prompt changes
  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(prompt.challengeDurationSec || 20);
    setIsFinished(false);
  }, [prompt.id, prompt.challengeDurationSec]);

  // Robust timer that strictly stops at 0 and NEVER goes negative or loops
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggle = () => {
    if (isFinished || timeLeft <= 0) {
      // If already finished or at zero, restart cleanly from full duration
      setTimeLeft(duration);
      setIsFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsFinished(false);
  };

  const safeTime = Math.max(0, timeLeft);
  const minutes = String(Math.floor(safeTime / 60)).padStart(2, '0');
  const seconds = String(safeTime % 60).padStart(2, '0');

  return (
    <div className="flex flex-col justify-between h-full py-1 text-center">
      <div className="my-auto space-y-5">
        <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight font-medium">
          &ldquo;{prompt.prompt}&rdquo;
        </h2>

        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto font-light leading-relaxed">
            {prompt.subtitle}
          </p>
        )}

        <div 
          style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
          className="rounded-2xl p-5 border max-w-sm mx-auto space-y-4 shadow-2xs"
        >
          <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-accent)' }}>
            Actie
          </div>
          <div className="text-sm font-medium text-[var(--text-primary)]">
            {prompt.challengeAction || 'Voer deze uitdaging nu samen uit.'}
          </div>

          {prompt.challengeDurationSec && (
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="text-3xl font-mono tabular-nums font-semibold text-[var(--text-primary)]">
                {minutes}:{seconds}
              </div>

              {isFinished && (
                <div className="text-xs font-semibold text-[var(--color-accent)] animate-pulse">
                  🎉 Tijd is voorbij! Goed gedaan!
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggle}
                  style={{
                    backgroundColor: isRunning ? '#D97706' : isFinished ? '#059669' : 'var(--color-accent)',
                    color: '#FFFFFF'
                  }}
                  className="px-4 py-2 text-xs font-medium rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {isRunning ? (
                    <span>Pauzeren</span>
                  ) : isFinished ? (
                    <span>Opnieuw starten ↻</span>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start timer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                  className="p-2 border rounded-xl hover:text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all"
                  title="Herstarten"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)] mt-2">
        Geen competitie – het gaat om het moment samen.
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   7. FINISH THE SENTENCE (Zin Afmaken)
---------------------------------------------------- */
const FinishSentenceView: React.FC<{ prompt: PromptItem }> = ({ prompt }) => {
  return (
    <div className="flex flex-col justify-between h-full py-1">
      <div className="my-auto space-y-6">
        <div className="text-[var(--text-secondary)] text-xs sm:text-sm font-light">
          {prompt.prompt}
        </div>

        <div 
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderLeftColor: 'var(--color-accent)',
            borderLeftWidth: '4px'
          }}
          className="p-5 sm:p-6 rounded-r-2xl space-y-2 shadow-2xs"
        >
          <p className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-snug font-medium italic">
            &ldquo;{prompt.sentenceStarter || 'Als ik echt eerlijk ben...'}&rdquo;
          </p>
          <p className="text-xs text-[var(--text-secondary)] pt-2">
            ...en vul dit nu spontaan aan zonder te aarzelen.
          </p>
        </div>

        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm font-light leading-relaxed">
            {prompt.subtitle}
          </p>
        )}
      </div>

      <div 
        style={{ borderColor: 'var(--border-subtle)' }}
        className="mt-4 pt-3 border-t text-xs text-[var(--text-muted)]"
      >
        Eerste gedachte telt. Laat de censuur even los.
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   8. RAPID FIRE (Snelle This-or-That Keuzes)
---------------------------------------------------- */
const RapidFireView: React.FC<{
  prompt: PromptItem;
  userSelections: Record<string, string>;
  onUpdateSelections: (picks: Record<string, string>) => void;
}> = ({ prompt, userSelections, onUpdateSelections }) => {
  const pairs = prompt.rapidFirePairs || [
    { id: '1', optionA: 'Optie 1', optionB: 'Optie 2' }
  ];

  const handleSelect = (pairId: string, choice: string) => {
    onUpdateSelections({
      ...userSelections,
      [pairId]: choice
    });
  };

  return (
    <div className="flex flex-col justify-between h-full py-1">
      <div className="mb-2">
        <h2 className="font-editorial text-xl sm:text-2xl text-[var(--text-primary)] font-medium">
          {prompt.prompt}
        </h2>
        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-xs mt-0.5 font-light">
            {prompt.subtitle}
          </p>
        )}
      </div>

      <div className="my-auto space-y-2.5">
        {pairs.map((pair) => {
          const selected = userSelections[pair.id];
          return (
            <div
              key={pair.id}
              style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
              className="rounded-xl p-2.5 border flex items-center justify-between gap-2 shadow-2xs"
            >
              <button
                onClick={() => handleSelect(pair.id, 'a')}
                style={{
                  backgroundColor: selected === 'a' ? 'var(--color-accent)' : 'var(--bg-card)',
                  color: selected === 'a' ? 'var(--color-accent-text)' : 'var(--text-primary)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg text-center transition-all cursor-pointer border shadow-xs"
              >
                {pair.optionA}
              </button>

              <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] px-1">
                of
              </span>

              <button
                onClick={() => handleSelect(pair.id, 'b')}
                style={{
                  backgroundColor: selected === 'b' ? 'var(--color-accent)' : 'var(--bg-card)',
                  color: selected === 'b' ? 'var(--color-accent-text)' : 'var(--text-primary)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg text-center transition-all cursor-pointer border shadow-xs"
              >
                {pair.optionB}
              </button>
            </div>
          );
        })}
      </div>

      <div 
        style={{ borderColor: 'var(--border-subtle)' }}
        className="mt-3 pt-2 border-t text-[11px] text-[var(--text-muted)] text-center"
      >
        {Object.keys(userSelections).length} van de {pairs.length} keuzes gemaakt. Bespreek waar jullie botsten!
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   9. REVEAL VIEW (Blind Antwoorden, Samen Onthullen)
---------------------------------------------------- */
interface LegacyRevealState {
  p1Choice?: string;
  p2Choice?: string;
  isRevealed?: boolean;
}

const RevealView: React.FC<{
  prompt: PromptItem;
  state?: LegacyRevealState;
  onUpdate: (state: LegacyRevealState) => void;
}> = ({ prompt, state = {}, onUpdate }) => {
  const options = prompt.revealQuestion?.options || [
    'Ja, absoluut',
    'Misschien later',
    'Nog even aftasten',
    'Verras me'
  ];

  const [activeChooser, setActiveChooser] = useState<'p1' | 'p2'>('p1');

  const p1Choice = state.p1Choice;
  const p2Choice = state.p2Choice;
  const isRevealed = state.isRevealed || false;

  const handleSelect = (choice: string) => {
    if (activeChooser === 'p1') {
      onUpdate({ ...state, p1Choice: choice });
      setActiveChooser('p2');
    } else {
      onUpdate({ ...state, p2Choice: choice });
    }
  };

  const handleRevealTogether = () => {
    onUpdate({ ...state, isRevealed: true });
  };

  const handleReset = () => {
    onUpdate({ p1Choice: undefined, p2Choice: undefined, isRevealed: false });
    setActiveChooser('p1');
  };

  return (
    <div className="flex flex-col justify-between h-full py-1">
      <div>
        <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight font-medium">
          {prompt.prompt}
        </h2>
        {prompt.subtitle && (
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1 font-light">
            {prompt.subtitle}
          </p>
        )}
      </div>

      <div className="my-auto space-y-4">
        {!isRevealed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
                {activeChooser === 'p1' ? 'Persoon 1 kiest blind' : 'Persoon 2 kiest blind'}
              </span>
              <span className="text-[var(--text-muted)] font-mono">
                {p1Choice ? 'P1 ✓' : 'P1 ...'} · {p2Choice ? 'P2 ✓' : 'P2 ...'}
              </span>
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => {
                const currentChoice = activeChooser === 'p1' ? p1Choice : p2Choice;
                const isSelected = currentChoice === opt;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--bg-card-subtle)',
                      borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)',
                      color: isSelected ? 'var(--color-accent-text)' : 'var(--text-primary)'
                    }}
                    className="w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-xs"
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {p1Choice && p2Choice && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleRevealTogether}
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                className="w-full mt-3 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Samen Onthullen!
              </motion.button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
            className="space-y-3 border p-5 rounded-2xl shadow-xs"
          >
            <div className="text-xs uppercase tracking-wider font-semibold text-center" style={{ color: 'var(--color-accent)' }}>
              Onthuld!
            </div>

            <div className="grid grid-cols-2 gap-3 text-center pt-2">
              <div 
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                className="p-3 rounded-xl border shadow-2xs"
              >
                <div className="text-[11px] text-[var(--text-muted)] mb-1">Persoon 1 koos:</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  {p1Choice || 'Niet ingevuld'}
                </div>
              </div>

              <div 
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                className="p-3 rounded-xl border shadow-2xs"
              >
                <div className="text-[11px] text-[var(--text-muted)] mb-1">Persoon 2 koos:</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  {p2Choice || 'Niet ingevuld'}
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-[var(--text-secondary)] pt-2 font-light">
              {p1Choice === p2Choice
                ? 'Jullie kozen exact hetzelfde! Mooie match.'
                : 'Twee verschillende blikken – wat bracht jullie hierop?'}
            </p>

            <button
              onClick={handleReset}
              style={{ color: 'var(--color-accent)' }}
              className="w-full text-center text-xs hover:underline pt-1 cursor-pointer"
            >
              Opnieuw kiezen
            </button>
          </motion.div>
        )}
      </div>

      <div className="text-xs text-[var(--text-muted)] text-center">
        Eerst blind kiezen, dan samen lachen om het resultaat.
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   9. SECRET PICK VIEW (Blind kiezen -> Doorsturen -> 3,2,1 Reveal!)
---------------------------------------------------- */
const SecretPickView: React.FC<{
  prompt: PromptItem;
  state?: SecretPickState;
  onUpdate: (state: SecretPickState) => void;
}> = ({ prompt, state, onUpdate }) => {
  const options = prompt.secretPickDetails?.options || [
    'Optie 1',
    'Optie 2',
    'Gelijkspel'
  ];
  const questionText = prompt.secretPickDetails?.question || prompt.prompt;

  const currentStep = state?.step || 'p1_turn';
  const p1Choice = state?.p1Choice;
  const p2Choice = state?.p2Choice;
  const [countdown, setCountdown] = useState<number>(3);

  // Stable references to prevent effect re-triggering during countdown
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const p1ChoiceRef = useRef(p1Choice);
  p1ChoiceRef.current = p1Choice;
  const p2ChoiceRef = useRef(p2Choice);
  p2ChoiceRef.current = p2Choice;

  // Trigger countdown timer ONCE when entering 'countdown' step
  useEffect(() => {
    if (currentStep !== 'countdown') return;

    setCountdown(3);

    const timer1 = setTimeout(() => {
      setCountdown(2);
    }, 650);

    const timer2 = setTimeout(() => {
      setCountdown(1);
    }, 1300);

    const timer3 = setTimeout(() => {
      onUpdateRef.current({
        step: 'revealed',
        p1Choice: p1ChoiceRef.current,
        p2Choice: p2ChoiceRef.current
      });
    }, 1950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentStep]);

  const handleP1Select = (opt: string) => {
    onUpdate({
      step: 'pass_phone',
      p1Choice: opt,
      p2Choice: undefined
    });
  };

  const handleReadyForP2 = () => {
    onUpdate({
      step: 'p2_turn',
      p1Choice,
      p2Choice: undefined
    });
  };

  const handleP2Select = (opt: string) => {
    onUpdate({
      step: 'countdown',
      p1Choice,
      p2Choice: opt
    });
  };

  const handleReset = () => {
    onUpdate({
      step: 'p1_turn',
      p1Choice: undefined,
      p2Choice: undefined
    });
  };

  return (
    <div className="flex flex-col justify-between h-full py-2 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span 
            style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
            className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold border border-[var(--border-subtle)]"
          >
            Secret Pick
          </span>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            {currentStep === 'p1_turn' && 'Stap 1/2 · Persoon 1'}
            {currentStep === 'pass_phone' && 'Doorgeven 🔒'}
            {currentStep === 'p2_turn' && 'Stap 2/2 · Persoon 2'}
            {currentStep === 'countdown' && '3, 2, 1...'}
            {currentStep === 'revealed' && 'Onthuld ✨'}
          </span>
        </div>

        <h2 className="font-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug font-medium">
          &ldquo;{questionText}&rdquo;
        </h2>
      </div>

      {/* Main Interactive Stage */}
      <div className="my-auto py-2">
        <AnimatePresence mode="wait">
          {currentStep === 'p1_turn' && (
            <motion.div
              key="p1_turn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div 
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
                className="p-3 rounded-xl border text-xs text-[var(--text-secondary)] flex items-center gap-2"
              >
                <EyeOff className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <span><strong>Persoon 1:</strong> Kies in het geheim jouw keuze zonder dat de ander meekijkt.</span>
              </div>

              <div className="space-y-2">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleP1Select(opt)}
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                    className="w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium hover:border-[var(--color-accent)] hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between text-[var(--text-primary)]"
                  >
                    <span>{opt}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">Kies</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'pass_phone' && (
            <motion.div
              key="pass_phone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              className="p-6 rounded-2xl border text-center space-y-4 shadow-xs"
            >
              <div 
                style={{ backgroundColor: 'var(--color-accent-subtle)' }}
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-xl"
              >
                🔒
              </div>
              <div className="space-y-1">
                <h3 className="font-editorial text-lg text-[var(--text-primary)] font-semibold">
                  Keuze veilig opgeslagen!
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed max-w-xs mx-auto">
                  Draai het scherm weg of geef de telefoon rustig door aan <strong>Persoon 2</strong>.
                </p>
              </div>

              <button
                onClick={handleReadyForP2}
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-medium shadow-md active:scale-98 transition-transform cursor-pointer"
              >
                Ik ben Persoon 2 →
              </button>
            </motion.div>
          )}

          {currentStep === 'p2_turn' && (
            <motion.div
              key="p2_turn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div 
                style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
                className="p-3 rounded-xl border text-xs text-[var(--text-secondary)] flex items-center gap-2"
              >
                <EyeOff className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <span><strong>Persoon 2:</strong> Kies nu in stilte jouw antwoord.</span>
              </div>

              <div className="space-y-2">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleP2Select(opt)}
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                    className="w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium hover:border-[var(--color-accent)] hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between text-[var(--text-primary)]"
                  >
                    <span>{opt}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">Kies</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center space-y-3"
            >
              <div className="text-xs uppercase tracking-widest font-mono text-[var(--text-muted)]">
                Tel samen hardop af!
              </div>
              <div 
                className="text-6xl sm:text-7xl font-editorial font-bold text-[var(--color-accent)] transition-all duration-200"
              >
                {countdown}
              </div>
            </motion.div>
          )}

          {currentStep === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              className="p-5 rounded-2xl border space-y-4 shadow-xs"
            >
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--color-accent)' }}>
                  Beide keuzes onthuld!
                </span>
                <h3 className="font-editorial text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                  {p1Choice === p2Choice ? '✨ Perfecte Match!' : '👀 Verschillende keuzes!'}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center pt-2">
                <div 
                  style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
                  className="p-3.5 rounded-xl border text-center space-y-1"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Persoon 1</div>
                  <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">{p1Choice}</div>
                </div>

                <div 
                  style={{ backgroundColor: 'var(--bg-card-subtle)', borderColor: 'var(--border-subtle)' }}
                  className="p-3.5 rounded-xl border text-center space-y-1"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Persoon 2</div>
                  <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">{p2Choice}</div>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] font-light text-center leading-relaxed">
                {p1Choice === p2Choice
                  ? 'Jullie zaten direct op één lijn. Wat maakte deze keuze zo vanzelfsprekend?'
                  : 'Wie begint met uitleggen waarom deze keuze werd gemaakt?'}
              </p>

              <button
                onClick={handleReset}
                style={{ color: 'var(--color-accent)' }}
                className="w-full text-center text-xs hover:underline pt-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Opnieuw kiezen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[11px] text-[var(--text-muted)] text-center font-light pt-2 border-t border-[var(--border-subtle)]">
        Eerst in stilte kiezen, daarna samen lachen om het resultaat.
      </div>
    </div>
  );
};

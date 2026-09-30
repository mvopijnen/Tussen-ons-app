import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  Search, 
  Play, 
  Trash2, 
  Share2, 
  Check, 
  HelpCircle,
  Flame,
  Filter,
  Layers,
  X
} from 'lucide-react';
import { PromptItem, RelationshipType } from '../types';
import { PROMPTS_DATABASE } from '../data/prompts';
import { InteractionCard } from './InteractionCard';

interface FavoritesViewProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onStartCustomSession?: (prompts: PromptItem[]) => void;
  onOpenTheme?: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  onToggleFavorite,
  onBack,
  onStartCustomSession,
  onOpenTheme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreviewPrompt, setActivePreviewPrompt] = useState<PromptItem | null>(null);
  const [previewInteractionData, setPreviewInteractionData] = useState<Record<string, Record<string, unknown>>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Retrieve full prompt objects for favorited IDs
  const favoritedPrompts = useMemo(() => {
    return PROMPTS_DATABASE.filter((p) => favoriteIds.includes(p.id));
  }, [favoriteIds]);

  // Available categories within favorited items
  const categories = useMemo(() => {
    const cats = new Set<string>();
    favoritedPrompts.forEach((p) => cats.add(p.category));
    return ['all', ...Array.from(cats)];
  }, [favoritedPrompts]);

  // Filtered list
  const filteredPrompts = useMemo(() => {
    return favoritedPrompts.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = 
        !searchQuery.trim() ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [favoritedPrompts, selectedCategory, searchQuery]);

  // Suggested inspiration prompts if empty
  const inspirationPrompts = useMemo(() => {
    return [
      PROMPTS_DATABASE.find((p) => p.id === 'date-ask-2'),
      PROMPTS_DATABASE.find((p) => p.id === 'date-guess-1'),
      PROMPTS_DATABASE.find((p) => p.id === 'vriend-both-1'),
      PROMPTS_DATABASE.find((p) => p.id === 'fam-ask-1'),
    ].filter(Boolean) as PromptItem[];
  }, []);

  const handleCopy = (prompt: PromptItem) => {
    const textToCopy = `"${prompt.prompt}" - Tussen Ons`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getInteractionLabel = (type: string) => {
    switch (type) {
      case 'both_answer': return 'Beide antwoorden';
      case 'guess': return 'Raad & Onthul';
      case 'point': return 'Wijs aan';
      case 'would_you_rather': return 'Dilemma';
      case 'challenge': return 'Opdracht';
      case 'finish_the_sentence': return 'Zin afmaken';
      case 'rapid_fire': return 'Rapid Fire';
      case 'reveal': return 'Blind onthullen';
      case 'ask':
      default: return 'Gespreksvraag';
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-5 py-6 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer"
            aria-label="Terug naar menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1.5" style={{ color: 'var(--color-accent)' }}>
              <Heart className="w-3.5 h-3.5 fill-[var(--color-accent)]" />
              Opgeslagen
            </span>
            <h1 className="font-editorial text-2xl text-[var(--text-primary)] font-medium leading-tight">
              Jullie Favorieten
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span 
            style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
            className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full border border-[var(--border-subtle)]"
          >
            {favoriteIds.length} {favoriteIds.length === 1 ? 'vraag' : 'vragen'}
          </span>
        </div>
      </div>

      {/* Main Body */}
      {favoritedPrompts.length === 0 ? (
        /* Empty State with Warm Inspiration */
        <div className="flex-1 flex flex-col justify-center py-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div 
              style={{ backgroundColor: 'var(--color-accent-subtle)', borderColor: 'var(--border-subtle)' }}
              className="w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto shadow-xs"
            >
              <Heart className="w-8 h-8 text-[var(--color-accent)] opacity-80" />
            </div>
            <h2 className="font-editorial text-2xl text-[var(--text-primary)] font-medium">
              Nog geen favorieten bewaard
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-light max-w-xs mx-auto leading-relaxed">
              Tik tijdens een gesprek op het hartje (<Heart className="w-3 h-3 inline fill-[var(--color-accent)] text-[var(--color-accent)]" />) rechtsboven om bijzondere vragen hier te bewaren en later te herbeleven.
            </p>
          </motion.div>

          {/* Quick inspiration section */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
              <span>Inspiratie om te bewaren</span>
            </div>

            <div className="space-y-2.5">
              {inspirationPrompts.map((item) => (
                <div
                  key={item.id}
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                  className="border rounded-2xl p-4 shadow-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                      {item.category} · {item.subcategory}
                    </span>
                    <p className="font-editorial text-sm text-[var(--text-primary)] font-medium leading-snug">
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    style={{ 
                      backgroundColor: 'var(--color-accent-subtle)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--color-accent)'
                    }}
                    className="p-2 rounded-xl border hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                    title="Voeg toe aan favorieten"
                  >
                    <Heart className="w-4 h-4 fill-[var(--color-accent)]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onBack}
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
            className="w-full h-12 rounded-xl active:scale-[0.98] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-4"
          >
            <span>Start een sessie en ontdek vragen</span>
          </button>
        </div>
      ) : (
        /* Populated Favorites List */
        <div className="flex-1 flex flex-col space-y-4 pt-4">
          {/* Quick Play Favorites Session Banner */}
          {onStartCustomSession && favoritedPrompts.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ backgroundColor: 'var(--color-accent-subtle)', borderColor: 'var(--border-subtle)' }}
              className="border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--color-accent)' }}>
                  Exclusieve Speelronde
                </span>
                <h3 className="font-editorial text-sm font-semibold text-[var(--text-primary)]">
                  Favorieten Ronde Spelen
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] font-light">
                  Speel enkel met jullie {favoritedPrompts.length} bewaarde vragen.
                </p>
              </div>

              <button
                onClick={() => onStartCustomSession(favoritedPrompts)}
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                className="px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Starten</span>
              </button>
            </motion.div>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek in jullie favorieten..."
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const label = cat === 'all' ? 'Alles' : cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--color-accent-text)' : 'var(--text-secondary)',
                      borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                    }}
                    className="px-3 py-1.5 rounded-full border text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer shadow-2xs"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-3 pb-8">
            <AnimatePresence>
              {filteredPrompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                  className="border rounded-2xl p-4 sm:p-5 shadow-xs transition-all space-y-3 relative group"
                >
                  {/* Top Category & Interaction Type Badges */}
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-secondary)]">{prompt.category}</span>
                      <span>·</span>
                      <span className="font-light">{prompt.subcategory}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span 
                        style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-secondary)' }}
                        className="text-[10px] px-2 py-0.5 rounded-md font-mono"
                      >
                        {getInteractionLabel(prompt.interactionType)}
                      </span>

                      {/* Intensity dots */}
                      <div className="flex items-center gap-0.5 ml-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              backgroundColor: i < prompt.intensity ? 'var(--color-accent)' : 'var(--border-subtle)'
                            }}
                            className="w-1.5 h-1.5 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="font-editorial text-lg sm:text-xl text-[var(--text-primary)] font-medium leading-snug">
                    &ldquo;{prompt.prompt}&rdquo;
                  </h3>

                  {prompt.subtitle && (
                    <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                      {prompt.subtitle}
                    </p>
                  )}

                  {/* Actions Strip */}
                  <div 
                    style={{ borderColor: 'var(--border-subtle)' }}
                    className="pt-2 border-t flex items-center justify-between"
                  >
                    <button
                      onClick={() => setActivePreviewPrompt(prompt)}
                      style={{ color: 'var(--color-accent)' }}
                      className="text-xs font-semibold flex items-center gap-1.5 hover:underline cursor-pointer py-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Speel vraag</span>
                    </button>

                    <div className="flex items-center gap-1 text-[var(--text-muted)]">
                      <button
                        onClick={() => handleCopy(prompt)}
                        className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
                        title="Kopieer vraag naar klembord"
                        aria-label="Kopieer vraag"
                      >
                        {copiedId === prompt.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onToggleFavorite(prompt.id)}
                        className="p-1.5 rounded-lg hover:text-red-500 hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
                        title="Verwijder uit favorieten"
                        aria-label="Verwijder favoriet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPrompts.length === 0 && searchQuery && (
              <div className="text-center py-10 space-y-2">
                <Search className="w-6 h-6 mx-auto text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-secondary)]">
                  Geen favoriete vragen gevonden voor &ldquo;{searchQuery}&rdquo;.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-screen Card Preview Modal for single questions */}
      <AnimatePresence>
        {activePreviewPrompt && (
          <motion.div
            key="preview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={() => setActivePreviewPrompt(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--card-shadow)' }}
              className="relative w-full max-w-sm rounded-3xl border p-6 z-10 space-y-4 max-h-[85vh] flex flex-col justify-between overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePreviewPrompt(null)}
                style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-secondary)' }}
                className="absolute top-4 right-4 p-2 rounded-full hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="Sluiten"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold" style={{ color: 'var(--color-accent)' }}>
                  {activePreviewPrompt.category} · {activePreviewPrompt.subcategory}
                </span>
              </div>

              {/* Interactive Card embed */}
              <div className="py-2 flex-1">
                <InteractionCard
                  prompt={activePreviewPrompt}
                  interactionData={previewInteractionData[activePreviewPrompt.id]}
                  onRecordInteraction={(data) => {
                    setPreviewInteractionData((prev) => ({
                      ...prev,
                      [activePreviewPrompt.id]: data
                    }));
                  }}
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(activePreviewPrompt)}
                  style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-primary)' }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === activePreviewPrompt.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Gekopieerd!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Vraag delen</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActivePreviewPrompt(null)}
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <span>Klaar</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

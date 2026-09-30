import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, User } from 'lucide-react';
import { UserProfile } from '../types';

export const AVATAR_OPTIONS = [
  { id: '✨', label: 'Magisch', emoji: '✨' },
  { id: '🍷', label: 'Lounge', emoji: '🍷' },
  { id: '🌿', label: 'Botanisch', emoji: '🌿' },
  { id: '☕', label: 'Koffielover', emoji: '☕' },
  { id: '🌙', label: 'Nachtvlinder', emoji: '🌙' },
  { id: '🎭', label: 'Speels', emoji: '🎭' },
  { id: '🕯️', label: 'Intiem', emoji: '🕯️' },
  { id: '🌊', label: 'Kalm & Diep', emoji: '🌊' },
  { id: '🪩', label: 'Feestelijk', emoji: '🪩' },
  { id: '🧭', label: 'Ontdekker', emoji: '🧭' },
  { id: '🔥', label: 'Energiek', emoji: '🔥' },
  { id: '🦁', label: 'Dapper', emoji: '🦁' }
];

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [name, setName] = useState(profile.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || '✨');

  useEffect(() => {
    setName(profile.name || '');
    setSelectedAvatar(profile.avatar || '✨');
  }, [profile, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Jij';
    onSave({
      name: finalName,
      avatar: selectedAvatar
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="profile-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            className="relative w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 select-none"
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
          <div className="space-y-1 mb-5">
            <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
              Jouw Profiel
            </span>
            <h2 className="font-editorial text-2xl text-[var(--text-primary)] font-medium leading-tight">
              Wie start het gesprek?
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-light">
              Kies een naam en een avatar die bij jouw energie passen.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="user-name-input" className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                Jouw voornaam of roepnaam
              </label>
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bijv. Alex of Sam"
                maxLength={24}
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                autoFocus
              />
            </div>

            {/* Avatar Grid */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--text-secondary)] font-medium">
                Kies jouw avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((item) => {
                  const isSelected = selectedAvatar === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedAvatar(item.id)}
                      style={{
                        backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--bg-card-subtle)',
                        borderColor: isSelected ? 'var(--color-accent)' : 'var(--border-subtle)'
                      }}
                      className={`h-13 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        isSelected
                          ? 'ring-1 ring-[var(--color-accent)] scale-105 shadow-xs'
                          : 'hover:border-[var(--border-focus)]'
                      }`}
                      title={item.label}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-[9px] text-[var(--text-muted)] mt-0.5 font-light truncate max-w-[90%]">
                        {item.label}
                      </span>
                      {isSelected && (
                        <div 
                          style={{ backgroundColor: 'var(--color-accent)' }}
                          className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                        >
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}
                className="w-full h-12 rounded-xl active:scale-[0.98] font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                Opslaan & Doorgaan
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

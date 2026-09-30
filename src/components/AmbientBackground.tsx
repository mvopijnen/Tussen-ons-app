import React from 'react';
import { motion } from 'motion/react';

export const AmbientBackground: React.FC = () => {
  return (
    <div 
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Subtle organic light shape 1 (Top right, accent tone) */}
      <motion.div
        animate={{
          x: [0, 24, -18, 12, 0],
          y: [0, -32, 16, -12, 0],
          scale: [1, 1.14, 0.94, 1.08, 1],
          opacity: [0.18, 0.28, 0.16, 0.24, 0.18],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          backgroundColor: 'var(--color-accent)',
          filter: 'blur(64px)',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity'
        }}
        className="absolute -top-16 -right-16 w-72 h-72 rounded-full"
      />

      {/* Subtle organic light shape 2 (Middle left, warm secondary glow) */}
      <motion.div
        animate={{
          x: [0, -28, 18, -14, 0],
          y: [0, 36, -22, 18, 0],
          scale: [1, 0.92, 1.12, 0.96, 1],
          opacity: [0.12, 0.22, 0.14, 0.20, 0.12],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          backgroundColor: 'var(--border-focus)',
          filter: 'blur(72px)',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity'
        }}
        className="absolute top-1/3 -left-24 w-80 h-80 rounded-full"
      />

      {/* Subtle organic light shape 3 (Bottom right, elevated surface drift) */}
      <motion.div
        animate={{
          x: [0, 22, -16, 8, 0],
          y: [0, -24, 28, -14, 0],
          scale: [0.94, 1.10, 0.98, 1.06, 0.94],
          opacity: [0.15, 0.26, 0.12, 0.22, 0.15],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{
          backgroundColor: 'var(--color-accent-subtle)',
          filter: 'blur(60px)',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity'
        }}
        className="absolute -bottom-20 -right-12 w-68 h-68 rounded-full"
      />

      {/* Subtle organic light shape 4 (Center-drifting gentle luminescence) */}
      <motion.div
        animate={{
          x: [0, 18, -24, 14, 0],
          y: [0, -18, 22, -10, 0],
          scale: [1, 1.18, 0.92, 1.05, 1],
          opacity: [0.08, 0.18, 0.10, 0.16, 0.08],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6
        }}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          filter: 'blur(80px)',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity'
        }}
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
      />
    </div>
  );
};

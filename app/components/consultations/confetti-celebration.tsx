'use client';

import { useEffect } from 'react';

/**
 * Type definition for canvas-confetti library
 */
interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  ticks?: number;
  gravity?: number;
  scalar?: number;
  drift?: number;
}

type ConfettiFunction = (options?: ConfettiOptions) => void;

interface WindowWithConfetti extends Window {
  confetti?: ConfettiFunction;
}

/**
 * Confetti celebration effect
 * Uses canvas-confetti library if available, falls back to CSS animation
 */
export function celebrateWithConfetti(options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
}) {
  // Check if canvas-confetti is available
  const windowWithConfetti = typeof window !== 'undefined' ? (window as WindowWithConfetti) : null;
  if (windowWithConfetti?.confetti) {
    const confetti = windowWithConfetti.confetti;

    confetti({
      particleCount: options?.particleCount || 100,
      spread: options?.spread || 70,
      origin: options?.origin || { y: 0.6 },
      colors: options?.colors || [
        'hsl(var(--primary))',
        'hsl(var(--primary) / 0.9)',
        'hsl(var(--primary) / 0.75)',
        'hsl(var(--background))',
      ],
      ticks: 200,
      gravity: 1,
      scalar: 1.2,
      drift: 0,
    });
  } else {
    // Fallback: Simple CSS animation (create floating elements)
    createCSSConfetti();
  }
}

function createCSSConfetti() {
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--primary) / 0.9)',
    'hsl(var(--primary) / 0.75)',
  ];
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      opacity: 1;
      pointer-events: none;
      z-index: 9999;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      animation: confetti-fall ${2 + Math.random() * 2}s ease-in forwards;
    `;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 4000);
  }

  // Add animation keyframes if not already present
  if (!document.getElementById('confetti-keyframes')) {
    const style = document.createElement('style');
    style.id = 'confetti-keyframes';
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Component wrapper for triggering confetti
 */
export function ConfettiTrigger({
  trigger,
  children,
}: {
  trigger: boolean;
  children?: React.ReactNode;
}) {
  useEffect(() => {
    if (trigger) {
      celebrateWithConfetti();
    }
  }, [trigger]);

  return <>{children}</>;
}

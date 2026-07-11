/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';

// The dedication. Edit the copy here.
export const RUTH_MESSAGE = {
  eyebrow: 'mischief managed',
  title: 'A little magic',
  body: 'For Ruth — who mends hearts for a living and stole mine on the side. Shifts survived, patients cared for, one very lucky guy adored.',
  sig: 'always yours',
};

const GLYPHS = ['◆', '✦', '✧', '◇', '💜'];

interface RuthEasterEggProps {
  active: boolean; // colour phase on (purple wash visible)
  reveal: boolean; // message + sparkles visible
  onClose: () => void;
}

// Optional upgrade: after `npm i @fontsource/eb-garamond` + importing it in
// index.css, change this to: `"'EB Garamond', ui-serif, Georgia, serif"`.
const SERIF = "ui-serif, Georgia, 'Times New Roman', serif";

export default function RuthEasterEgg({ active, reveal, onClose }: RuthEasterEggProps) {
  // Regenerate sparkle field each time the note is revealed.
  const [runId, setRunId] = useState(0);
  useEffect(() => {
    if (reveal) setRunId((n) => n + 1);
  }, [reveal]);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const glyph = GLYPHS[i % GLYPHS.length];
        return {
          id: i,
          glyph,
          left: Math.round(Math.random() * 100),
          size: glyph === '💜' ? 13 : 9 + Math.round(Math.random() * 14),
          delay: (Math.random() * 2.6).toFixed(2),
          duration: (2.4 + Math.random() * 2.2).toFixed(2),
          drift: Math.round((Math.random() - 0.5) * 70),
          rise: 260 + Math.round(Math.random() * 260),
          rot: Math.round((Math.random() - 0.5) * 200),
          color: glyph === '💜' ? undefined : Math.random() < 0.5 ? '#9333ea' : '#7e22ce',
        };
      }),
    [runId],
  );

  return (
    <div
      aria-hidden={!active}
      onClick={onClose}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden text-center"
      style={{
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
      }}
    >
      <style>{`
        @keyframes ruth-rise {
          0%   { transform: translate(0,0) rotate(0deg) scale(0.6); opacity: 0; }
          14%  { opacity: 0.95; }
          70%  { opacity: 0.95; }
          100% { transform: translate(var(--drift), calc(-1 * var(--rise))) rotate(var(--rot)) scale(1); opacity: 0; }
        }
      `}</style>

      {/* purple gradient backdrop — crossfades over the teal dashboard */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(168deg,#faf5ff 0%,#f3e8ff 44%,#e9d5ff 78%,#d8b4fe 100%)',
        }}
      />

      {/* drifting sparkles / diamonds */}
      {reveal && (
        <div key={runId} className="pointer-events-none absolute inset-0 overflow-hidden">
          {sparkles.map((s) => (
            <span
              key={s.id}
              style={{
                position: 'absolute',
                left: `${s.left}%`,
                bottom: -24,
                fontSize: s.size,
                color: s.color,
                opacity: 0,
                filter: 'drop-shadow(0 0 5px rgba(255,255,255,.9))',
                animation: `ruth-rise ${s.duration}s ${s.delay}s ease-in infinite`,
                // custom props consumed by the keyframe
                ['--rise' as string]: `${s.rise}px`,
                ['--drift' as string]: `${s.drift}px`,
                ['--rot' as string]: `${s.rot}deg`,
              } as React.CSSProperties}
            >
              {s.glyph}
            </span>
          ))}
        </div>
      )}

      {/* the note */}
      <div
        className="relative px-9"
        style={{
          maxWidth: 300,
          opacity: reveal ? 1 : 0,
          transform: reveal ? 'translateY(0)' : 'translateY(10px)',
          transition:
            'opacity 0.6s ease 0.15s, transform 0.7s cubic-bezier(.22,1,.36,1) 0.15s',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: '#7e22ce',
          }}
        >
          {RUTH_MESSAGE.eyebrow}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 31,
            lineHeight: 1.1,
            color: '#6b21a8',
            marginTop: 14,
            textShadow: '0 2px 20px rgba(255,255,255,.6)',
          }}
        >
          {RUTH_MESSAGE.title}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 17.5,
            lineHeight: 1.62,
            color: '#5b21b6',
            marginTop: 18,
          }}
        >
          {RUTH_MESSAGE.body}
        </div>
        <div
          style={{
            width: reveal ? 140 : 0,
            height: 1,
            margin: '24px auto 0',
            background: 'linear-gradient(90deg,transparent,#c084fc,transparent)',
            transition: 'width 0.8s ease 0.5s',
          }}
        />
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: '#7e22ce',
            marginTop: 22,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#9333ea' }}>◆</span>
          {RUTH_MESSAGE.sig}
          <span style={{ color: '#9333ea' }}>◆</span>
        </div>
      </div>

      {/* close hint */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-4 text-[10px] tracking-wide"
        style={{
          color: '#7e22ce',
          opacity: reveal ? 0.75 : 0,
          transition: 'opacity 0.6s ease 0.9s',
        }}
      >
        tap anywhere to close
      </div>
    </div>
  );
}

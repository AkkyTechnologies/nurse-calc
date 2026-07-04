/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { Pencil, Star, Trash2 } from 'lucide-react';
import { FavoriteItem } from '../types';

interface PresetCarouselProps<T extends FavoriteItem> {
  presets: T[];
  activeId: string | null;
  onLoad: (preset: T) => void;
  editing: boolean;
  onDelete: (id: string) => void;
  onRename: (preset: T) => void;
  renderMeta: (preset: T) => React.ReactNode;
  emptyLabel?: string;
}

// Flat, center-emphasis horizontal snap-scroll favorites picker. Fixed height
// regardless of how many favorites exist, so it never obstructs the calculator
// below it. Centered card is scaled up, neighbors partially visible, no 3D
// tilt. Tapping any visible card — center or side — loads it immediately.
// Reused across any screen with a favorites list (Dosage, Pediatric, ...).
export default function PresetCarousel<T extends FavoriteItem>({
  presets,
  activeId,
  onLoad,
  editing,
  onDelete,
  onRename,
  renderMeta,
  emptyLabel = 'No favorites saved yet.',
}: PresetCarouselProps<T>) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startScroll: 0 });

  const update = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    Array.from(el.children).forEach((child) => {
      const card = child as HTMLElement;
      const center = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.min(Math.abs(mid - center) / (el.clientWidth * 0.6), 1);
      card.style.transform = `scale(${(1.05 - distance * 0.13).toFixed(3)})`;
      card.style.opacity = String(1 - distance * 0.35);
    });
  }, []);

  const centerCard = useCallback((index: number, smooth: boolean) => {
    const el = wrapRef.current;
    if (!el || !el.children[index]) return;
    const card = el.children[index] as HTMLElement;
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    if (smooth) el.scrollTo({ left, behavior: 'smooth' });
    else el.scrollLeft = left;
  }, []);

  useEffect(() => {
    const index = presets.findIndex((p) => p.id === activeId);
    centerCard(index >= 0 ? index : 0, false);
    update();
    // Only on mount — re-centering on every preset change would fight the user's own scroll position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    update();
  }, [presets.length, editing, update]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    drag.current = { down: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = wrapRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };

  const empty = presets.length === 0;

  return (
    <div
      ref={wrapRef}
      onScroll={update}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className="flex gap-2.5 overflow-x-auto items-stretch bg-slate-50 border border-slate-200 rounded-2xl no-scrollbar"
      style={{
        scrollSnapType: 'x mandatory',
        padding: empty ? 0 : '10px calc(50% - 88px)',
        height: 84,
        cursor: empty ? 'default' : 'grab',
        touchAction: 'pan-x',
      }}
    >
      {empty && (
        <div className="m-auto flex items-center gap-2 text-slate-400 text-xs font-semibold italic">
          <Star className="w-3.5 h-3.5" strokeWidth={2.5} />
          {emptyLabel}
        </div>
      )}
      {presets.map((preset, i) => {
        const selected = preset.id === activeId;
        return (
          <div
            key={preset.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (drag.current.moved) {
                drag.current.moved = false;
                return;
              }
              if (editing) return;
              onLoad(preset);
              centerCard(i, true);
            }}
            style={{ scrollSnapAlign: 'center' }}
            className={`relative flex-none w-44 flex flex-col items-center justify-center gap-0.5 rounded-2xl border-2 shadow-xs transition-[transform,opacity,border-color,background-color] duration-150 ${
              editing ? 'cursor-default' : 'cursor-pointer'
            } ${selected ? 'bg-teal-50 border-teal-500' : 'bg-white border-slate-200'}`}
          >
            <span className={`text-xs font-bold truncate max-w-[140px] ${selected ? 'text-teal-700' : 'text-slate-700'}`}>
              {preset.name}
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-400">{renderMeta(preset)}</span>

            {editing && (
              <div className="absolute top-1.5 right-1.5 flex gap-1">
                <button
                  type="button"
                  title="Rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename(preset);
                  }}
                  className="w-[22px] h-[22px] inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-xs"
                >
                  <Pencil className="w-3 h-3" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(preset.id);
                  }}
                  className="w-[22px] h-[22px] inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-rose-600 shadow-xs"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

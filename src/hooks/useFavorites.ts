/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { FavoriteItem } from '../types';

// Shared CRUD + localStorage persistence for any screen's favorites/presets list.
export function useFavorites<T extends FavoriteItem>(storageKey: string, initial: T[]) {
  const [favorites, setFavorites] = useState<T[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [storageKey, favorites]);

  const add = (favorite: Omit<T, 'id'>): string => {
    const id = `fav_${Date.now()}`;
    setFavorites((prev) => [...prev, { ...favorite, id } as T]);
    return id;
  };

  const update = (id: string, patch: Partial<T>) => {
    setFavorites((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const rename = (id: string, name: string) => {
    setFavorites((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const remove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return { favorites, add, update, rename, remove };
}

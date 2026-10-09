'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Saved listings (favorites), stored per user in localStorage.
 * Prototype only — will move to m3_discovery.favorites once write APIs exist.
 */
const key = (userId: string) => `mapnest_favs_${userId}`;
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; codes: string[] }>();
const EMPTY: string[] = [];

const DEFAULT_SAVED = ['UD-00101', 'UD-00102', 'UD-00104'];

function read(userId: string | undefined): string[] {
  if (!userId) return EMPTY;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key(userId));
    if (raw === null) {
      localStorage.setItem(key(userId), JSON.stringify(DEFAULT_SAVED));
      raw = JSON.stringify(DEFAULT_SAVED);
    }
  } catch {
    return EMPTY;
  }
  const hit = cache.get(userId);
  if (hit && hit.raw === raw) return hit.codes; // stable reference for useSyncExternalStore
  let codes: string[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    codes = Array.isArray(parsed) ? parsed.filter((c) => typeof c === 'string') : EMPTY;
  } catch {
    codes = EMPTY;
  }
  cache.set(userId, { raw, codes });
  return codes;
}

function write(userId: string, codes: string[]) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(codes));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
}

export function useFavorites() {
  const { user } = useAuth();
  const userId = user?.id;
  const codes = useSyncExternalStore(subscribe, () => read(userId), () => EMPTY);

  const isFavorite = useCallback((code: string) => codes.includes(code), [codes]);

  const toggle = useCallback(
    (code: string) => {
      if (!userId) return;
      const cur = read(userId);
      write(userId, cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]);
    },
    [userId]
  );

  const remove = useCallback(
    (code: string) => {
      if (!userId) return;
      write(userId, read(userId).filter((c) => c !== code));
    },
    [userId]
  );

  return { codes, isFavorite, toggle, remove, canSave: !!userId };
}

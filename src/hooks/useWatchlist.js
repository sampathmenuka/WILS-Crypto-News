import { useCallback, useSyncExternalStore } from 'react';

// Watchlist of coin ids persisted in localStorage and shared across every component
// that uses this hook (starring a coin on Markets updates CoinDetail/Home instantly).
const STORAGE_KEY = 'wils:watchlist';
const listeners = new Set();

const read = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

let snapshot = read();

const write = (next) => {
  snapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode / quota) – keep the in-memory list.
  }
  listeners.forEach((l) => l());
};

const subscribe = (listener) => {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      snapshot = read();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
};

export default function useWatchlist() {
  const watchlist = useSyncExternalStore(subscribe, () => snapshot);

  const isWatched = useCallback((id) => watchlist.includes(id), [watchlist]);

  const toggle = useCallback((id) => {
    write(snapshot.includes(id) ? snapshot.filter((x) => x !== id) : [...snapshot, id]);
  }, []);

  return { watchlist, isWatched, toggle };
}

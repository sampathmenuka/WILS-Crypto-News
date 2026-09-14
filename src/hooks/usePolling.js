import { useCallback, useEffect, useRef, useState } from 'react';

// usePolling: repeatedly calls an async fetcher at a given interval.
// Polling pauses while the tab is hidden and resumes (with an immediate refresh) when visible.
// Returns { data, loading, error, lastUpdated, refresh }
export default function usePolling(fetcher, intervalMs = 30000, startImmediately = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(startImmediately));
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      setLoading(true);
      const result = await fetcherRef.current();
      if (!mountedRef.current) return;
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e?.message || 'Failed to refresh');
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    run();
    timerRef.current = setInterval(run, intervalMs);
  }, [intervalMs, run, stop]);

  useEffect(() => {
    mountedRef.current = true;
    if (!startImmediately) return undefined;

    if (!document.hidden) start();
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mountedRef.current = false;
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, [startImmediately, start, stop]);

  return { data, loading, error, lastUpdated, refresh: run, start, stop };
}

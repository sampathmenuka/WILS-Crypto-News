import { useEffect, useRef, useState } from 'react';

// usePolling: repeatedly calls an async fetcher at a given interval.
// Returns { data, loading, error, lastUpdated, refresh }
export default function usePolling(fetcher, intervalMs = 30000, startImmediately = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(startImmediately));
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  const run = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      if (!mountedRef.current) return;
      setData(result);
      setLastUpdated(new Date());
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e?.message || 'Failed to refresh');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const start = () => {
    // Clear any existing
    if (timerRef.current) clearInterval(timerRef.current);
    // Kick off immediately and then interval
    run();
    timerRef.current = setInterval(run, intervalMs);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (startImmediately) {
      start();
    }
    return () => {
      mountedRef.current = false;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return { data, loading, error, lastUpdated, refresh: run, start, stop };
}

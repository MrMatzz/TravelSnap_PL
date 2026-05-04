import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string, init?: RequestInit): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initString = init ? JSON.stringify(init) : '';

  const fetchData = useCallback(async (isCancelled: () => boolean = () => false) => {
    if (!url) {
      if (!isCancelled()) setLoading(false);
      return;
    }

    let hasValidCache = false;
    const cacheKey = `cache:v1:${url}`;

    try {
      const cachedStr = await AsyncStorage.getItem(cacheKey);
      if (cachedStr) {
        const cachedObj = JSON.parse(cachedStr);
        if (Date.now() - cachedObj.ts < 24 * 60 * 60 * 1000) {
          if (!isCancelled()) {
            setData(cachedObj.data);
            setLoading(false);
            hasValidCache = true;
          }
        }
      }
    } catch (e) {
    }

    try {
      const initObj = initString ? JSON.parse(initString) : undefined;
      const response = await fetch(url, initObj);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const json = await response.json();
      
      if (!isCancelled()) {
        setData(json);
        setError(null);
      }

      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        ts: Date.now(),
        data: json
      }));
    } catch (err) {
      if (!isCancelled() && !hasValidCache) {
        setError(String(err));
      }
    } finally {
      if (!isCancelled()) {
        setLoading(false);
      }
    }
  }, [url, initString]);

  useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    fetchData(() => cancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
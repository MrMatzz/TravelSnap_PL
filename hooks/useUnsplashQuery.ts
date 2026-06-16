import { useQuery } from '@tanstack/react-query';
import { UNSPLASH_ACCESS_KEY, UNSPLASH_BASE_URL } from '../constants/api';
import { useNetworkStatus } from './useNetworkStatus';

export function useUnsplashQuery(searchTerm: string) {
  const { isConnected } = useNetworkStatus();

  return useQuery({
    queryKey: ['unsplash', searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=10`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      );
      if (!res.ok) throw new Error(`Unsplash error: ${res.status}`);
      return res.json();
    },
    enabled: isConnected && !!searchTerm,
    staleTime: 1000 * 60 * 30,
  });
}
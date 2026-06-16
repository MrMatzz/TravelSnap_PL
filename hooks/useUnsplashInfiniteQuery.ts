import { useInfiniteQuery } from '@tanstack/react-query';
import { UNSPLASH_ACCESS_KEY, UNSPLASH_BASE_URL } from '../constants/api';

const PAGE_SIZE = 10;

export function useUnsplashInfiniteQuery(searchTerm: string) {
  return useInfiniteQuery({
    queryKey: ['unsplash', searchTerm, 'infinite'],
    
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(searchTerm)}&page=${pageParam}&per_page=${PAGE_SIZE}`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      );
      if (!res.ok) throw new Error(`Unsplash error: ${res.status}`);
      return res.json();
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length === PAGE_SIZE ? allPages.length + 1 : undefined;
    },
  });
}
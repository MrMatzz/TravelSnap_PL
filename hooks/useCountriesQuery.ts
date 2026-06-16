import { useQuery } from '@tanstack/react-query';
import { RESTCOUNTRIES_BASE_URL } from '../constants/api';
import type { Country } from '../types/country';
import { useNetworkStatus } from './useNetworkStatus';

export function useCountriesQuery() {
  const { isConnected } = useNetworkStatus();

  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: () => fetch(`${RESTCOUNTRIES_BASE_URL}/all`).then((r) => r.json()),
    staleTime: 1000 * 60 * 60,
    enabled: isConnected,
  });
}
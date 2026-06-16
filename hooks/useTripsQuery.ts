import { useQuery } from '@tanstack/react-query';
import type { Trip } from '../types/trip';
import { loadTrips } from '../utils/tripStorage';

export function useTripsQuery() {
  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: loadTrips,
    staleTime: Infinity,
  });
}
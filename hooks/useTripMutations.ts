import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Trip, TripData } from '../types/trip';
import { deleteTrip, saveTrips, updateTrip } from '../utils/tripStorage';

export function useAddTrip() {
  const qc = useQueryClient();

  return useMutation<Trip, Error, TripData, { previous: Trip[] }>({
    mutationFn: async (tripData: TripData) => {
      const trip: Trip = { ...tripData, id: `server-${Date.now()}` };
      await saveTrips([trip]);
      return trip;
    },
    
    onMutate: async (newData) => {
      await qc.cancelQueries({ queryKey: ['trips'] });
      
      const previous = qc.getQueryData<Trip[]>(['trips']) ?? [];

      const optimistic: Trip = {
        ...newData,
        id: `optimistic-${Date.now()}`,
      };
      
      qc.setQueryData<Trip[]>(['trips'], [optimistic, ...previous]);

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(['trips'], ctx.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();

  return useMutation<void, Error, string, { previous: Trip[] }>({
    mutationFn: deleteTrip, 

    onMutate: async (tripId) => {
      await qc.cancelQueries({ queryKey: ['trips'] });
      
      const previous = qc.getQueryData<Trip[]>(['trips']) ?? [];

      qc.setQueryData<Trip[]>(
        ['trips'],
        previous.filter((t) => t.id !== tripId)
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(['trips'], ctx.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();

  return useMutation<Trip, Error, { id: string; data: Partial<TripData> }, { previous: Trip[] }>({
    mutationFn: ({ id, data }) => updateTrip(id, data),

    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['trips'] });

      const previous = qc.getQueryData<Trip[]>(['trips']) ?? [];

      qc.setQueryData<Trip[]>(['trips'], (old) => {
        return old?.map((trip) => 
          trip.id === id ? { ...trip, ...data } : trip
        );
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(['trips'], ctx.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
import React, { createContext, useContext, useState } from 'react';
import { TripData } from '../types/trip';

interface TripContextType {
  trips: TripData[];
  addTrip: (trip: TripData) => void;
  deleteTrip: (id: string) => void;
  updateTrip: (id: string, updatedData: Partial<TripData>) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<TripData[]>([]);

  const addTrip = (newTrip: TripData) => {
    setTrips(prev => [...prev, newTrip]);
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const updateTrip = (id: string, updatedData: Partial<TripData>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, ...updatedData } : trip
    ));
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip, updateTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within a TripProvider');
  return context;
}
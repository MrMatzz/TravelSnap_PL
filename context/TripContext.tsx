import React, { createContext, useContext, useState } from 'react';

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  deleteTrip: (id: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);

  const addTrip = (newTripData: Omit<Trip, 'id'>) => {
    const newTrip = { id: Date.now().toString(), ...newTripData };
    setTrips(prev => [...prev, newTrip]);
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within a TripProvider');
  return context;
}
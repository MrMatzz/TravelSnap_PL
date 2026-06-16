import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, TripData } from '../types/trip';

export const saveTrips = async (trips: Trip[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(trips);
    await AsyncStorage.setItem('travelsnap_trips', jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const updateTrip = async (id: string, data: Partial<TripData>): Promise<Trip> => {
  const trips = await loadTrips();
  let updatedTrip: Trip | undefined;

  const updatedTrips = trips.map((t) => {
    if (t.id === id) {
      updatedTrip = { ...t, ...data };
      return updatedTrip;
    }
    return t;
  });

  if (!updatedTrip) {
    throw new Error(`Trip with id ${id} not found`);
  }
  await saveTrips(updatedTrips);

  return updatedTrip;
};

export const loadTrips = async (): Promise<Trip[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('travelsnap_trips');
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const saveTrip = async (tripData: TripData): Promise<Trip> => {
  const currentTrips = await loadTrips();
  
  const newTrip: Trip = {
    ...tripData,
    id: Date.now().toString(), 
  };

  await saveTrips([newTrip, ...currentTrips]);

  return newTrip;
};

export const deleteTrip = async (id: string): Promise<void> => {
  const currentTrips = await loadTrips();
  const updatedTrips = currentTrips.filter(trip => trip.id !== id);
  await saveTrips(updatedTrips);
}
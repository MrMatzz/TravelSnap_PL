import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '../types/trip';

export const saveTrips = async (trips: Trip[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(trips);
    await AsyncStorage.setItem('travelsnap_trips', jsonValue);
  } catch (e) {
    console.error(e);
  }
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
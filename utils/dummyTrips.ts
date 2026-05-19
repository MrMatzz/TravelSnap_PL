import { TripFormData } from '../types/tripSchema';

export const generateDummyTrips = (count: number): (TripFormData & { id: string })[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `dummy-${index}`,
    title: `Wycieczka testowa ${index + 1}`,
    destination: `Kraj ${index + 1}`,
    date: `2024-12-01`,
    rating: Math.floor(Math.random() * 5) + 1,
    imageUri: `https://picsum.photos/seed/${index}/400/300`,
    galleryUris: [],
  }));
};
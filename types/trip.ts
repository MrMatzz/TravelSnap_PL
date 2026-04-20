export interface TripData {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
  imageUri?: string;
  galleryUris?: string[];
}
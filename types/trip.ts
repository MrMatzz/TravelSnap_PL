export interface TripData {
  coordinates?:
  {
    latitude: number;
    longitude: number;
  };
  title: string;
  destination: string;
  date: string;
  rating: number;
  imageUri?: string;
  galleryUris?: string[];
}

export interface Trip extends TripData {
  id: string;
}
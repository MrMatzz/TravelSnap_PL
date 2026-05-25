import { z } from 'zod';

export const tripSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  title: z.string()
    .min(3, 'Tytuł musi mieć co najmniej 3 znaki')
    .max(60, 'Tytuł może mieć maksymalnie 60 znaków')
    .trim(),
  destination: z.string()
    .min(1, 'Cel podróży jest wymagany')
    .max(80, 'Cel podróży: maks 80 znaków'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data w formacie YYYY-MM-DD'),
  rating: z.number()
    .int('Ocena musi być liczbą całkowitą')
    .min(1, 'Min 1 gwiazdka')
    .max(5, 'Max 5 gwiazdek'),
  imageUri: z.string().optional(),
  galleryUris: z.array(z.string()).optional(),
});

export type TripFormData = z.infer<typeof tripSchema>;
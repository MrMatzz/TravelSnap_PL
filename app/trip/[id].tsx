import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CountryCard from '../../components/CountryCard';
import ErrorView from '../../components/ErrorView';
import RatingStars from '../../components/RatingStars';
import { UNSPLASH_ACCESS_KEY, UNSPLASH_BASE_URL } from '../../constants/api';
import { Colors } from '../../constants/Colors';
import { useTrips } from '../../context/TripContext';
import { useFetch } from '../../hooks/useFetch';
import { UnsplashResponse } from '../../types/unsplash';
import { extractCountry } from '../../utils/destination';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trips, deleteTrip } = useTrips();
  
  const trip = trips.find(t => t.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

  const unsplashUrl = trip ? `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(trip.destination)}&per_page=1` : '';

  const { data: photoData, loading: photoLoading, refetch: refetchPhoto } = useFetch<UnsplashResponse>(
    unsplashUrl, 
    { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
  );

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const status = await AsyncStorage.getItem(`@favorite_${id}`);
        if (status !== null) {
          setIsFavorite(JSON.parse(status));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadFavoriteStatus();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const newStatus = !isFavorite;
      setIsFavorite(newStatus);
      await AsyncStorage.setItem(`@favorite_${id}`, JSON.stringify(newStatus));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    await deleteTrip(id);
    router.back();
  };

  const confirmDelete = () => {
    Alert.alert(
      "Usuń podróż",
      "Tej operacji nie można cofnąć. Czy na pewno?",
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Usuń", style: "destructive", onPress: handleDelete }
      ]
    );
  };

    if (!trip) {
    return (
      <ErrorView 
        message="Nie znaleziono podróży" 
        onRetry={() => router.back()} 
        retryLabel="Wróć" 
      />
    );
  }
  const galleryCount = trip.galleryUris?.length || 0;
  
  const heroUri = photoData?.results?.[0]?.urls?.regular ?? trip.imageUri;
  const photographerName = photoData?.results?.[0]?.user?.name;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <Stack.Screen 
        options={{ 
          title: trip.title,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <Link href={`/trip/edit/${trip.id}` as any} asChild>
                <Pressable>
                  <Ionicons name="create-outline" size={24} color={Colors.textPrimary} />
                </Pressable>
              </Link>
              <Pressable onPress={toggleFavorite}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? Colors.accent : Colors.textSecondary} 
                />
              </Pressable>
            </View>
          )
        }} 
      />

      <View style={styles.heroContainer}>
        {heroUri ? (
          <Image source={{ uri: heroUri }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color="#4A6FA5" />
            <Text style={styles.placeholderText}>Brak zdjęcia</Text>
          </View>
        )}
        
        {photoLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        )}
      </View>

      {photographerName && (
        <Text style={styles.attributionText}>Photo by {photographerName} on Unsplash</Text>
      )}
      
      <View style={styles.content}>
        
        <CountryCard countryName={extractCountry(trip.destination)} />
        
        <Text style={styles.title}>{trip.title}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{trip.destination}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{trip.date}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <RatingStars rating={trip.rating} />
        </View>

        <Link href={`/trip/gallery/${trip.id}` as any} asChild>
          <Pressable style={styles.galleryLinkButton}>
            <Ionicons name="images-outline" size={20} color={Colors.primary} />
            <Text style={styles.galleryLinkText}>Galeria ({galleryCount})</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Powrót do listy</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={confirmDelete}>
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Usuń podróż</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#1A2744',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#4A6FA5',
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 22, 34, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attributionText: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 16,
    fontStyle: 'italic',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  ratingContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  galleryLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  galleryLinkText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#E94560',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
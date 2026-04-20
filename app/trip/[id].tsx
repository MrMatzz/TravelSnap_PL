import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import RatingStars from '../../components/RatingStars';
import { Colors } from '../../constants/Colors';
import { useTrips } from '../../context/TripContext';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trips } = useTrips();
  
  const trip = trips.find(t => t.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

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

  if (!trip) return <View style={styles.container} />;

  const galleryCount = trip.galleryUris?.length || 0;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <Stack.Screen 
        options={{ 
          title: trip.title,
          headerRight: () => (
            <Pressable onPress={toggleFavorite}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? Colors.accent : Colors.textSecondary} 
              />
            </Pressable>
          )
        }} 
      />

      {trip.imageUri ? (
        <Image source={{ uri: trip.imageUri }} style={styles.heroImage} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={64} color="#4A6FA5" />
          <Text style={styles.placeholderText}>Brak zdjęcia</Text>
        </View>
      )}
      
      <View style={styles.content}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  placeholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#1A2744',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#4A6FA5',
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
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
});
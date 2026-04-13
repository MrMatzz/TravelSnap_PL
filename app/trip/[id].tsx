import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import RatingStars from '../../components/RatingStars';
import { Colors } from '../../constants/Colors';

export default function TripDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const title = params.title as string;
  const destination = params.destination as string;
  const date = params.date as string;
  const rating = Number(params.rating);

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

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: title,
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
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{destination}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{date}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <RatingStars rating={rating} />
        </View>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Powrót do listy</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  content: {
    flex: 1,
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
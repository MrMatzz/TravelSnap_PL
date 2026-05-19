import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UNSPLASH_ACCESS_KEY, UNSPLASH_BASE_URL } from '../constants/api';
import { Colors } from '../constants/Colors';
import { useFetch } from '../hooks/useFetch';
import { UnsplashResponse } from '../types/unsplash';
import ErrorView from './ErrorView';

interface DestinationCardProps {
  city: string;
}

export default function DestinationCard({ city }: DestinationCardProps) {
  const url = `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(city)}&per_page=1`;
  const { data, loading, error, refetch } = useFetch<UnsplashResponse>(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
  });

  if (loading) {
    return <View style={[styles.card, styles.skeleton]} />;
  }

  if (error || !data?.results?.[0]) {
    return (
      <View style={[styles.card, styles.errorContainer]}>
        <ErrorView message="Błąd pobierania danych" onRetry={refetch} />
      </View>
    );
  }

  const imageUrl = data.results[0].urls.regular;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.overlay}>
        <Text style={styles.cityText}>{city}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
  },
  skeleton: {
    backgroundColor: '#1A2744',
  },
  errorContainer: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cityText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
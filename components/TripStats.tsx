import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

interface TripStatsProps {
  trips: Trip[];
}

export default function TripStats({ trips }: TripStatsProps) {
  const count = trips.length;
  
  const avgRating = count > 0 
    ? (trips.reduce((sum, trip) => sum + trip.rating, 0) / count).toFixed(1) 
    : '0.0';
    
  const uniqueCountries = new Set(trips.map(t => t.destination)).size;

  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Text style={styles.number}>{count}</Text>
        <Text style={styles.label}>Podróże</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.number}>{avgRating}</Text>
        <Text style={styles.label}>Śr. ocena</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.number}>{uniqueCountries}</Text>
        <Text style={styles.label}>Kraje</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
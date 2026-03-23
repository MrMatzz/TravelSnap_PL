import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import RatingStars from './RatingStars';

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
  onDelete: (id: string) => void;
}

export default function TripCard({ id, title, destination, date, rating, onDelete }: TripCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={() => onDelete(id)}>
          <Ionicons name="trash-outline" size={24} color="#F44336" />
        </Pressable>
      </View>
      
      <RatingStars rating={rating} />
      
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{destination}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
});
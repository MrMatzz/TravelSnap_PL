import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
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
        <Pressable onPress={() => onDelete(id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color={Colors.accent} />
        </Pressable>
      </View>
      
      <RatingStars rating={rating} />
      
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={Colors.primary} />
        <Text style={styles.infoText}>{destination}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
        <Text style={styles.infoText}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 8 
      },
      android: { elevation: 4 },
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.2)' },
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
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: Colors.accent + '26',
    borderRadius: 12,
    padding: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
});
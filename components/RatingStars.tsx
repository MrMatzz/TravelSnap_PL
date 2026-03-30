import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

export default function RatingStars({ rating, maxStars = 5 }: RatingStarsProps) {
  const stars = [];
  
  for (let i = 1; i <= maxStars; i++) {
    const iconName = i <= rating ? 'star' : 'star-outline';
    stars.push(
      <Ionicons key={i} name={iconName} size={16} color={Colors.accent} style={styles.star} />
    );
  }

  return <View style={styles.row}>{stars}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  star: {
    marginRight: 2,
  },
});
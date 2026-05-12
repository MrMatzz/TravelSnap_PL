import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface RatingStarsProps {
  rating: number;
  onChange?: (value: number) => void; 
}

export default function RatingStars({ rating, onChange }: RatingStarsProps) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable 
          key={star} 
          onPress={() => onChange && onChange(star)} 
          disabled={!onChange}
        >
          <Ionicons 
            name={star <= rating ? "star" : "star-outline"} 
            size={32} 
            color="#FFD700" 
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
});
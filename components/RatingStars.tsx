import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  maxStars?: number;
}

export default function RatingStars({ rating, onChange, maxStars = 5 }: RatingStarsProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (containerWidth === 0 || !onChange) return;
      
      const starWidth = containerWidth / maxStars;
      let newRating = Math.ceil(e.x / starWidth);
      
      if (newRating < 1) newRating = 1;
      if (newRating > maxStars) newRating = maxStars;
      
      if (newRating !== rating) {
        runOnJS(onChange)(newRating);
      }
    });

  const tapGesture = Gesture.Tap()
    .onEnd((e) => {
      if (containerWidth === 0 || !onChange) return;
      const starWidth = containerWidth / maxStars;
      let newRating = Math.ceil(e.x / starWidth);
      runOnJS(onChange)(newRating);
    });

  const composed = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <GestureDetector gesture={composed}>
      <View 
        style={styles.container}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {[...Array(maxStars)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < rating ? 'star' : 'star-outline'}
            size={24}
            color={Colors.accent}
          />
        ))}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'flex-start',
  },
});
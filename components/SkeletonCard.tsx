import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

export function SkeletonCard() {
  const shimmer = useSharedValue(0.3);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <Animated.View style={[styles.card, shimmerStyle]}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.titlePlaceholder} />
      <View style={styles.subtitlePlaceholder} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E1E9EE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    height: 200,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#CCC',
    borderRadius: 8,
    marginBottom: 12,
  },
  titlePlaceholder: {
    height: 20,
    width: '70%',
    backgroundColor: '#CCC',
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitlePlaceholder: {
    height: 16,
    width: '40%',
    backgroundColor: '#CCC',
    borderRadius: 4,
  },
});
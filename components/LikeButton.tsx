import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

interface LikeButtonProps {
  isLiked: boolean;
  onPress: () => void;
  size?: number;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export default function LikeButton({ isLiked, onPress, size = 24 }: LikeButtonProps) {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(isLiked ? 1 : 0);

  useEffect(() => {
    colorProgress.value = withTiming(isLiked ? 1 : 0, { duration: 300 });
  }, [isLiked]);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.4, { damping: 10, stiffness: 200 }),
      withSpring(1.0, { damping: 10, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorProgress.value,
      [0, 1],
      [Colors.textSecondary, Colors.accent] // Серый -> Красный (Accent)
    ),
  }));

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <Animated.View style={animatedStyle}>
        <AnimatedIcon 
          name={isLiked ? "heart" : "heart-outline"} 
          size={size} 
          style={iconStyle} 
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DestinationCard from '../../components/DestinationCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Colors } from '../../constants/Colors';

const POPULAR = [
  "Tokyo", "Lisbon", "Reykjavik", "Bali", 
  "Cape Town", "Kyoto", "Marrakech", "Patagonia"
];

export default function ExploreScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listKey, setListKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const refetchAll = useCallback(() => {
    setIsRefreshing(true);
    setListKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <FlatList
      key={`list-${listKey}`}
      data={POPULAR}
      keyExtractor={(city) => city}
      renderItem={({ item, index }) => {
        const column = index % 2; 
        const delay = index * 100 + (column * 50);

        return (
          <Animated.View entering={FadeInDown.delay(delay).springify()}>
            <DestinationCard city={item} />
        </Animated.View>
      );
    }}
    contentContainerStyle={styles.listContent}
    refreshing={isRefreshing}
    onRefresh={refetchAll}
  />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
});
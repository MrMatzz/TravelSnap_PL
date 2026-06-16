import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedTripCard } from '../../components/AnimatedTripCard';
import EmptyState from '../../components/EmptyState';
import { SkeletonCard } from '../../components/SkeletonCard';
import TripStats from '../../components/TripStats';
import { Colors } from '../../constants/Colors';
import { useDeleteTrip } from '../../hooks/useTripMutations';
import { useTripsQuery } from '../../hooks/useTripsQuery';
import { generateDummyTrips } from '../../utils/dummyTrips';

const CARD_HEIGHT = 350;
const DUMMY_DATA = generateDummyTrips(200);

export default function TripsListScreen() {
  const { data: trips = [], isLoading } = useTripsQuery();
  const { mutate: deleteTrip } = useDeleteTrip();
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const allSortedTrips = useMemo(() => {
    return [...trips, ...DUMMY_DATA].sort((a, b) => b.rating - a.rating);
  }, [trips]);

  const visibleTrips = useMemo(() => {
    return allSortedTrips.slice(0, visibleCount);
  }, [allSortedTrips, visibleCount]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= allSortedTrips.length) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 20);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, visibleCount, allSortedTrips.length]);

  const handleTripPress = useCallback((id: string) => {
    router.push(`/trip/${id}`);
  }, [router]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <TripStats trips={trips} />
      
      {visibleTrips.length === 0 ? (
        <EmptyState />
      ) : (
        <Animated.FlatList
          data={visibleTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent} 
          itemLayoutAnimation={LinearTransition.springify()}
          renderItem={({ item, index }) => (
            <AnimatedTripCard
              trip={item}
              index={index}
              onPress={() => handleTripPress(item.id)}
              onDelete={() => deleteTrip(item.id)} 
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
            ) : null
          }
        />
      )}
      <Link href="/trip/add-trip" asChild>
        <Pressable style={styles.fab}>
          <Ionicons name="add" size={32} color={Colors.background} />
        </Pressable>
      </Link>
    </SafeAreaView>
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
    paddingBottom: 100,
  },
  loader: {
    marginVertical: 20,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
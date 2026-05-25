import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import TripCard from '../../components/TripCard';
import TripStats from '../../components/TripStats';
import { Colors } from '../../constants/Colors';
import { useTrips } from '../../context/TripContext';
import { generateDummyTrips } from '../../utils/dummyTrips';

const CARD_HEIGHT = 350;
const DUMMY_DATA = generateDummyTrips(200);

export default function TripsListScreen() {
  const { trips } = useTrips();
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

  return (
    <SafeAreaView style={styles.container}>
      <TripStats trips={trips} />
      
      {visibleTrips.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={visibleTrips}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, index) => ({
            length: CARD_HEIGHT,
            offset: CARD_HEIGHT * index,
            index,
          })}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TripCard trip={item} onPress={handleTripPress} />
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
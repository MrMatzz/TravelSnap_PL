import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import TripCard from '../../components/TripCard';
import TripStats from '../../components/TripStats';
import { Colors } from '../../constants/Colors';
import { useTrips } from '../../context/TripContext';

const studentName = "[Matsvei Buniankou]";

export default function HomeScreen() {
  const { trips, deleteTrip, loading } = useTrips();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader tripCount={trips.length} />
        
        <TripStats trips={trips} />

        {trips.length === 0 
          ? <EmptyState /> 
          : trips.map(trip => (
              <Link 
                key={trip.id} 
                href={{
                  pathname: '/trip/[id]' as any,
                  params: { ...trip }
                }} 
                asChild
              >
                <Pressable>
                  <TripCard
                    {...trip}
                    onDelete={() => deleteTrip(trip.id)}
                  />
                </Pressable>
              </Link>
            ))
        }

        <View style={styles.footerContainer}>
          <Text style={styles.authorLabel}>Autor: {studentName}</Text>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/add-trip')}>
        <Ionicons name="add" size={32} color={Colors.background} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, 
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  authorLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
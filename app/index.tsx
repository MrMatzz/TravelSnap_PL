import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTripForm from '../components/AddTripForm';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import TripCard from '../components/TripCard';
import TripStats from '../components/TripStats';
import { Colors } from '../constants/Colors';

const studentName = "[Marsvei Buniankou]";

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = (newTripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      ...newTripData,
    };
    setTrips([...trips, newTrip]);
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

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
        
        <AddTripForm onAdd={handleAddTrip} />

        {trips.length === 0 
          ? <EmptyState /> 
          : trips.map(trip => (
              <TripCard
                key={trip.id}
                {...trip}
                onDelete={() => handleDeleteTrip(trip.id)}
              />
            ))
        }

        <View style={styles.footerContainer}>
          <Text style={styles.authorLabel}>Autor: {studentName}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, 
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  authorLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
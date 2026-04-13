import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AddTripForm from '../components/AddTripForm';
import { Colors } from '../constants/Colors';
import { useTrips } from '../context/TripContext';

export default function AddTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();

  const handleAdd = (tripData: { title: string; destination: string; date: string; rating: number }) => {
    addTrip(tripData);
    router.back();
  };

  return (
    <View style={styles.container}>
      <AddTripForm onAdd={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
});
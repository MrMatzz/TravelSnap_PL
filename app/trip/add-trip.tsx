import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AddTripForm from '../../components/AddTripForm';
import { Colors } from '../../constants/Colors';
import { useTrips } from '../../context/TripContext';
import { TripData } from '../../types/trip';

export default function AddTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();

  const handleAdd = (tripData: TripData) => {
    addTrip(tripData);
    router.back();
  };

  return (
    <View style={styles.container}>
      <AddTripForm />
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
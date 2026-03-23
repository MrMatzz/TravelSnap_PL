import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import TripCard from '../components/TripCard';

const studentName = "[TU WPISZ SWOJE IMIĘ I NAZWISKO]";

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handleAddTrip = () => {
    if (!title.trim() || !destination.trim() || !date.trim() || !rating.trim()) {
      Alert.alert('Błąd walidacji', 'Wszystkie pola muszą być wypełnione.');
      return;
    }

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      Alert.alert('Błąd walidacji', 'Ocena musi być liczbą z przedziału 1-5.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Błąd walidacji', 'Data musi być w formacie YYYY-MM.');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: parsedRating,
    };

    setTrips([...trips, newTrip]);
    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
        <Ionicons name="airplane-outline" size={60} color="#2196F3" style={styles.icon} />
        <View>
          <Text style={styles.title}>TravelSnap</Text>
          <Text style={styles.subtitle}>Twój dziennik podróży</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Dodaj nową podróż</Text>
        <TextInput style={styles.input} placeholder="Tytuł" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Cel podróży" value={destination} onChangeText={setDestination} />
        <TextInput style={styles.input} placeholder="Data (YYYY-MM)" value={date} onChangeText={setDate} />
        <TextInput style={styles.input} placeholder="Ocena (1-5)" value={rating} onChangeText={setRating} keyboardType="numeric" />
        
        <Pressable 
          style={({ pressed }) => [styles.addButton, { backgroundColor: pressed ? '#388E3C' : '#4CAF50' }]} 
          onPress={handleAddTrip}
        >
          <Text style={styles.buttonText}>Dodaj</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.listHeaderContainer}>
        <Text style={styles.sectionTitle}>Moje podróże</Text>
        <Text style={styles.tripCountBadge}>Liczba podróży: {trips.length}</Text>
      </View>

      <View style={styles.cardsContainer}>
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            id={trip.id}
            title={trip.title}
            destination={trip.destination}
            date={trip.date}
            rating={trip.rating}
            onDelete={handleDeleteTrip}
          />
        ))}
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.authorLabel}>Autor: {studentName}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
    }),
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 24,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  tripCountBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardsContainer: {
    width: '100%',
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 20,
  },
  authorLabel: {
    fontSize: 14,
    color: '#888',
  },
});
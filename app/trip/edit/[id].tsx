import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useTrips } from '../../../context/TripContext';

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trips, updateTrip } = useTrips();
  
  const trip = trips.find(t => t.id === id);

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDestination(trip.destination);
      setDate(trip.date);
      setRating(trip.rating.toString());
    }
  }, [trip]);

  if (!trip) return null;

  const handleSave = async () => {
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

    await updateTrip(id, {
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: parsedRating,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Edytuj podróż' }} />
      <View style={styles.formContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Tytuł" 
          placeholderTextColor={Colors.textSecondary}
          value={title} 
          onChangeText={setTitle} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Cel podróży" 
          placeholderTextColor={Colors.textSecondary}
          value={destination} 
          onChangeText={setDestination} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Data (YYYY-MM)" 
          placeholderTextColor={Colors.textSecondary}
          value={date} 
          onChangeText={setDate} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Ocena (1-5)" 
          placeholderTextColor={Colors.textSecondary}
          value={rating} 
          onChangeText={setRating} 
          keyboardType="numeric" 
        />
        
        <Pressable 
          style={({ pressed }) => [styles.saveButton, { opacity: pressed ? 0.8 : 1 }]} 
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Zapisz zmiany</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  formContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.3)' },
    }),
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    color: Colors.textPrimary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
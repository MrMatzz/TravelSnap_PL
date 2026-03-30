import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface AddTripFormProps {
  onAdd: (trip: { title: string; destination: string; date: string; rating: number }) => void;
}

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handlePress = () => {
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

    onAdd({
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: parsedRating,
    });

    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Dodaj nową podróż</Text>
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
        style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.8 : 1 }]} 
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>Dodaj</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.3)' },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
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
  addButton: {
    backgroundColor: Colors.accent, // Изменено с primary на accent
    paddingVertical: 14,
    borderRadius: 12, // Изменено с 8 на 12
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: Colors.textPrimary, // Белый текст
    fontSize: 16,
    fontWeight: 'bold',
  },
});
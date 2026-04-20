import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { saveImageToTrip } from '../utils/imageStorage';

interface AddTripFormProps {
  onAdd: (trip: { id: string; title: string; destination: string; date: string; rating: number; imageUri?: string }) => void;
}

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const [draftId, setDraftId] = useState(() => Date.now().toString());
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const savedUri = await saveImageToTrip(result.assets[0].uri, draftId);
      setImageUri(savedUri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Brak uprawnień', 'Potrzebujemy dostępu do aparatu.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const savedUri = await saveImageToTrip(result.assets[0].uri, draftId);
      setImageUri(savedUri);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert('Dodaj zdjęcie', 'Wybierz źródło', [
      { text: 'Galeria', onPress: pickImage },
      { text: 'Kamera', onPress: takePhoto },
      { text: 'Anuluj', style: 'cancel' },
    ]);
  };

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
      id: draftId,
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: parsedRating,
      imageUri: imageUri,
    });

    setDraftId(Date.now().toString());
    setTitle('');
    setDestination('');
    setDate('');
    setRating('');
    setImageUri(undefined);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Dodaj nową podróż</Text>
      
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <Pressable onPress={handleAddPhoto} style={styles.changeImageButton}>
            <Text style={styles.changeImageText}>Zmień zdjęcie</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={handleAddPhoto} style={styles.photoPlaceholder}>
          <Ionicons name="camera-outline" size={32} color={Colors.textSecondary} />
          <Text style={styles.photoText}>Dodaj zdjęcie</Text>
        </Pressable>
      )}

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
  photoPlaceholder: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoText: {
    color: Colors.textSecondary,
    marginTop: 8,
    fontSize: 16,
  },
  imageContainer: {
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeImageText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
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
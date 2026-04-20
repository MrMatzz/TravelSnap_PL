import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, Modal, NativeScrollEvent, NativeSyntheticEvent, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useTrips } from '../../../context/TripContext';
import { deleteImage, saveImageToTrip } from '../../../utils/imageStorage';

const { width } = Dimensions.get('window');
const itemSize = (width - 16) / 3;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, updateTrip } = useTrips();
  const trip = trips.find(t => t.id === id);

  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const galleryUris = trip?.galleryUris || [];

  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentScrollY < lastScrollY.current) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    lastScrollY.current = currentScrollY;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100 || gestureState.dy < -100) {
          setSelectedUri(null);
        }
      },
    })
  ).current;

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const savedUri = await saveImageToTrip(result.assets[0].uri, id);
      updateTrip(id, { galleryUris: [...galleryUris, savedUri] });
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Brak uprawnień', 'Potrzebujemy dostępu do aparatu.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      const savedUri = await saveImageToTrip(result.assets[0].uri, id);
      updateTrip(id, { galleryUris: [...galleryUris, savedUri] });
    }
  };

  const handleAddPhoto = () => {
    Alert.alert('Dodaj zdjęcie', 'Wybierz źródło', [
      { text: 'Galeria', onPress: handlePickImage },
      { text: 'Kamera', onPress: handleTakePhoto },
      { text: 'Anuluj', style: 'cancel' },
    ]);
  };

  const handleDeletePhoto = async () => {
    if (!selectedUri) return;

    Alert.alert(
      'Usuń zdjęcie',
      'Czy na pewno chcesz usunąć to zdjęcie?',
      [
        { text: 'Anuluj', style: 'cancel' },
        { 
          text: 'Usuń', 
          style: 'destructive', 
          onPress: async () => {
            await deleteImage(selectedUri);
            updateTrip(id, { 
              galleryUris: galleryUris.filter(uri => uri !== selectedUri) 
            });
            setSelectedUri(null);
          } 
        },
      ]
    );
  };

  const handleSetMainPhoto = () => {
    if (selectedUri) {
      updateTrip(id, { imageUri: selectedUri });
      Alert.alert('Sukces', 'Zdjęcie zostało ustawione jako główne.');
    }
  };

  if (!trip) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${trip.title} — ${galleryUris.length} zdjęć` }} />

      {galleryUris.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Brak zdjęć - dodaj pierwsze!</Text>
        </View>
      ) : (
        <FlatList
          data={galleryUris}
          keyExtractor={(item) => item}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedUri(item)}>
              <Image source={{ uri: item }} style={styles.gridImage} />
            </Pressable>
          )}
        />
      )}

      <AnimatedPressable 
        style={[styles.fab, { transform: [{ translateY }] }]} 
        onPress={handleAddPhoto}
      >
        <Ionicons name="camera-outline" size={28} color={Colors.background} />
      </AnimatedPressable>

      <Modal visible={!!selectedUri} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          
          <View style={styles.panContainer} {...panResponder.panHandlers}>
            {selectedUri && (
              <Image source={{ uri: selectedUri }} style={styles.fullImage} resizeMode="contain" />
            )}
          </View>
          
          <Pressable style={styles.closeButton} onPress={() => setSelectedUri(null)}>
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDeletePhoto}>
            <Ionicons name="trash-outline" size={28} color="#FF4444" />
          </Pressable>

          <Pressable style={styles.mainPhotoButton} onPress={handleSetMainPhoto}>
            <Ionicons name="star" size={28} color="#FFD700" />
            <Text style={styles.mainPhotoText}>Główne</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
  gridContent: {
    padding: 4,
    paddingBottom: 100,
  },
  gridRow: {
    gap: 4,
    marginBottom: 4,
  },
  gridImage: {
    width: itemSize,
    height: itemSize,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  mainPhotoButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
    padding: 10,
  },
  mainPhotoText: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
});
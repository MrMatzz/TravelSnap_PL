import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import RatingStars from '../../../components/RatingStars';
import { Colors } from '../../../constants/Colors';
import { useTrips } from '../../../context/TripContext';
import { TripFormData, tripSchema } from '../../../types/tripSchema';

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { trips, updateTrip } = useTrips();
  const submittedRef = useRef(false);

  const destinationRef = useRef<TextInput>(null);
  const dateRef = useRef<TextInput>(null);

  const trip = useMemo(() => trips.find((t) => t.id === id), [trips, id]);

  const existingTitles = useMemo(
    () => trips.filter((t) => t.id !== trip?.id).map((t) => t.title.toLowerCase()),
    [trips, trip?.id]
  );

  const schema = useMemo(
    () =>
      tripSchema.extend({
        title: tripSchema.shape.title.refine(
          async (val) => {
            await new Promise((r) => setTimeout(r, 150));
            return !existingTitles.includes(val.toLowerCase());
          },
          { message: 'Tytuł już istnieje – wybierz inny' }
        ),
      }),
    [existingTitles]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValidating, isDirty },
  } = useForm<TripFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      destination: '',
      date: '',
      rating: 3,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (trip) {
      reset({
        title: trip.title,
        destination: trip.destination,
        date: trip.date,
        rating: trip.rating,
        imageUri: trip.imageUri,
        galleryUris: trip.galleryUris,
      });
    }
  }, [trip, reset]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty || submittedRef.current) return;
      e.preventDefault();
      Alert.alert(
        'Odrzucić zmiany?',
        'Masz niezapisane zmiany. Odrzucić je?',
        [
          { text: 'Zostań', style: 'cancel' },
          { text: 'Odrzuć', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) }
        ]
      );
    });
    return unsubscribe;
  }, [navigation, isDirty]);

  const pickImage = async (onChange: (val: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Brak uprawnień', 'Musisz zezwolić na dostęp do galerii.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: TripFormData) => {
    if (!trip) return;
    await updateTrip(trip.id, data);
    submittedRef.current = true;
    router.back();
  };

  if (!trip) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nie znaleziono podróży.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Wróć</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardWrapper}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <Stack.Screen options={{ title: 'Edytuj podróż' }} />
        <View style={styles.formContainer}>
          
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Tytuł</Text>
                  {isValidating && <ActivityIndicator size="small" color={Colors.reactBlue} />}
                </View>
                <TextInput
                  style={[styles.input, fieldState.error && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="np. Wycieczka do Paryża"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                  onSubmitEditing={() => destinationRef.current?.focus()}
                />
                {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="destination"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Cel podróży</Text>
                <TextInput
                  ref={destinationRef}
                  style={[styles.input, fieldState.error && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="np. Paryż, Francja"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                  onSubmitEditing={() => dateRef.current?.focus()}
                />
                {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                  ref={dateRef}
                  style={[styles.input, fieldState.error && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="done"
                />
                {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="rating"
            render={({ field: { onChange, value }, fieldState }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Ocena</Text>
                <RatingStars rating={value} onChange={onChange} />
                {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="imageUri"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Zdjęcie okładkowe (opcjonalnie)</Text>
                {value ? (
                  <Image source={{ uri: value }} style={styles.preview} />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Text style={{ color: '#6B7280' }}>Brak zdjęcia</Text>
                  </View>
                )}
                <Pressable onPress={() => pickImage(onChange)} style={styles.pickBtn}>
                  <Text style={styles.pickBtnText}>
                    {value ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'}
                  </Text>
                </Pressable>
              </View>
            )}
          />

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.darkBg} />
            ) : (
              <Text style={styles.submitBtnText}>Zapisz zmiany</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardWrapper: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  emptyText: { color: Colors.textPrimary, fontSize: 18, marginBottom: 16 },
  backButton: { backgroundColor: Colors.reactBlue, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: Colors.darkBg, fontSize: 16, fontWeight: 'bold' },
  formContainer: { backgroundColor: Colors.card, padding: 16, borderRadius: 12 },
  field: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#4B5563', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: Colors.textPrimary, backgroundColor: Colors.inputBg },
  inputError: { borderColor: Colors.accent, borderWidth: 1.5 },
  errorText: { fontSize: 12, color: Colors.accent, marginTop: 4 },
  submitBtn: { backgroundColor: Colors.reactBlue, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: Colors.darkBg, fontSize: 16, fontWeight: '700' },
  preview: { width: '100%', height: 200, borderRadius: 8, marginTop: 8 },
  previewPlaceholder: { width: '100%', height: 200, borderRadius: 8, backgroundColor: Colors.inputBg, justifyContent: 'center', alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#4B5563', borderStyle: 'dashed' },
  pickBtn: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.reactBlue, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  pickBtnText: { color: Colors.reactBlue, fontWeight: '600', fontSize: 16 },
});
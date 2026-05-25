import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTrips } from '../context/TripContext';
import { TripFormData, tripSchema } from '../types/tripSchema';
import RatingStars from './RatingStars';

export default function AddTripForm() {
  const { trips, addTrip } = useTrips();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const destinationRef = useRef<TextInput>(null);
  const dateRef = useRef<TextInput>(null);

  const existingTitles = useMemo(
    () => trips.map((t) => t.title.toLowerCase()),
    [trips]
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
    trigger,
    formState: { isSubmitting, isValidating },
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

  const goNext = async () => {
    const fields = step === 1 ? (['title', 'destination'] as const) : (['date', 'rating'] as const);
    const ok = await trigger(fields);
    if (ok) {
      setStep((s) => (s + 1) as 1 | 2 | 3);
    }
  };

  const goBack = () => {
    setStep((s) => (s - 1) as 1 | 2 | 3);
  };

  const pickImage = async (onChange: (val: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Brak uprawnień', 'Musisz zezwolić na dostęp do galerii, aby dodać zdjęcie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: TripFormData) => {
  let coordinates;

    try {
      const geocodeResults = await Location.geocodeAsync(data.destination);
    
      if (geocodeResults.length > 0){
        coordinates = {
          latitude: geocodeResults[0].latitude,
          longitude: geocodeResults[0].longitude,
        };
      }
    } catch (error) {
    
  }

  const newTrip = {
    id: Date.now().toString(),
    ...data,
    ...(coordinates && { coordinates })
  };

  addTrip(newTrip);
  router.back();
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.keyboardWrapper}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={[styles.dot, step === s && styles.dotActive]} />
            ))}
          </View>

          {step === 1 && (
            <>
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
                      autoFocus={true}
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
                      returnKeyType="done"
                      onSubmitEditing={goNext}
                    />
                    {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
                  </View>
                )}
              />

              <Pressable onPress={goNext} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Dalej</Text>
              </Pressable>
            </>
          )}

          {step === 2 && (
            <>
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
                      onSubmitEditing={goNext}
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
                  <RatingStars
                    rating={Number(value)} 
                    onChange={(val: number) => onChange(val)} 
                  />
                  {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
                </View>
               )}
              />

              <View style={styles.actionsRow}>
                <Pressable onPress={goBack} style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>Wstecz</Text>
                </Pressable>
                <Pressable onPress={goNext} style={[styles.submitBtn, { flex: 1, marginTop: 0 }]}>
                  <Text style={styles.submitBtnText}>Dalej</Text>
                </Pressable>
              </View>
            </>
          )}

          {step === 3 && (
            <>
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

              <View style={styles.actionsRow}>
                <Pressable onPress={goBack} style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>Wstecz</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  style={[styles.submitBtn, { flex: 1, marginTop: 0 }, isSubmitting && styles.submitBtnDisabled]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={Colors.darkBg} />
                  ) : (
                    <Text style={styles.submitBtnText}>Dodaj podróż</Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardWrapper: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  formContainer: { backgroundColor: Colors.card, padding: 16, borderRadius: 12 },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24, marginTop: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4B5563' },
  dotActive: { backgroundColor: Colors.reactBlue },
  field: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#4B5563', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: Colors.textPrimary, backgroundColor: Colors.inputBg },
  inputError: { borderColor: Colors.accent, borderWidth: 1.5 },
  errorText: { fontSize: 12, color: Colors.accent, marginTop: 4 },
  submitBtn: { backgroundColor: Colors.reactBlue, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: Colors.darkBg, fontSize: 16, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4B5563', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
  preview: { width: '100%', height: 200, borderRadius: 8, marginTop: 8 },
  previewPlaceholder: { width: '100%', height: 200, borderRadius: 8, backgroundColor: Colors.inputBg, justifyContent: 'center', alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#4B5563', borderStyle: 'dashed' },
  pickBtn: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.reactBlue, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  pickBtnText: { color: Colors.reactBlue, fontWeight: '600', fontSize: 16 },
});
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { darkMapStyle } from '../../constants/mapStyle';
import { useTrips } from '../../context/TripContext';
import { useLocation } from '../../hooks/useLocation';

export default function MapScreen() {
  const { location, error, loading } = useLocation();
  const { trips } = useTrips();
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const [isDark, setIsDark] = useState(false);

  const tripsWithCoords = useMemo(() => trips.filter(t => t.coordinates), [trips]);

  useEffect(() => {
    const coords = tripsWithCoords.map(t => t.coordinates!);

    if (coords.length === 1 && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    } else if (coords.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [tripsWithCoords]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.button} onPress={() => Linking.openSettings()}>
          <Text style={styles.buttonText}>Otwórz ustawienia</Text>
        </Pressable>
      </View>
    );
  }

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : {
        latitude: 52.2297,
        longitude: 21.0122,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef} 
        style={styles.map} 
        initialRegion={initialRegion}
        customMapStyle={isDark ? darkMapStyle : undefined}
        userInterfaceStyle={isDark ? "dark" : "light"}
      >
        {tripsWithCoords.map((trip) => (
          <Marker 
            key={trip.id} 
            coordinate={trip.coordinates!}
          >
            <View style={styles.customMarker}>
              <Image 
                source={{ uri: trip.imageUri }} 
                style={styles.markerImage} 
              />
            </View>

            <Callout onPress={() => router.push(`/trip/${trip.id}`)}>
              <View style={styles.calloutContainer}>
                <Image
                  source={{ uri: trip.imageUri }}
                  style={styles.calloutImage}
                />
                <View style={styles.calloutText}>
                  <Text style={styles.calloutTitle} numberOfLines={1}>{trip.title}</Text>
                  <Text style={styles.calloutDestination} numberOfLines={1}>{trip.destination}</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.switchContainer}>
        <View style={styles.switchInner}>
          <Text style={styles.switchLabel}>Dark Mode</Text>
          <Switch 
            value={isDark} 
            onValueChange={setIsDark} 
            trackColor={{ false: '#767577', true: Colors.primary }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: 20 },
  errorText: { color: Colors.textPrimary, fontSize: 16, marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: Colors.background, fontWeight: 'bold' },
  customMarker: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.primary, overflow: 'hidden', backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  markerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  calloutContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: 200 },
  calloutImage: { width: 60, height: 60, borderRadius: 8 },
  calloutText: { flex: 1, justifyContent: 'center' },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, color: Colors.textPrimary, marginBottom: 2 },
  calloutDestination: { fontSize: 12, color: Colors.textSecondary },
  switchContainer: { position: 'absolute', top: 50, right: 20 },
  switchInner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  switchLabel: { marginRight: 8, fontWeight: 'bold', color: '#333' }
});
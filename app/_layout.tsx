import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';
import { TripProvider } from '../context/TripContext';

export default function RootLayout() {
  return (
    <TripProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textPrimary,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="trip/[id]" 
          options={{ 
            title: 'Trip Details',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="add-trip" 
          options={{ 
            presentation: 'modal',
            title: 'Dodaj podróż',
            headerStyle: { backgroundColor: Colors.card }
          }} 
        />
      </Stack>
      <StatusBar style="light" />
    </TripProvider>
  );
}
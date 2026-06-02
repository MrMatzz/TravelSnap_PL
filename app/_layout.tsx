import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../constants/Colors';
import { TripProvider } from '../context/TripContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              title: 'Szczegóły podróży',
              animation: 'slide_from_bottom'
            }} 
          />
          <Stack.Screen 
            name="trip/add-trip" 
            options={{ 
              presentation: 'modal',
              title: 'Dodaj podróż',
              headerStyle: { backgroundColor: Colors.card }
            }} 
          />
          <Stack.Screen 
            name="trip/edit/[id]" 
            options={{ 
              presentation: 'modal',
              title: 'Edytuj podróż',
              headerStyle: { backgroundColor: Colors.card }
            }} 
          />
          <Stack.Screen 
            name="trip/gallery/[id]" 
            options={{ 
              title: 'Galeria',
              headerStyle: { backgroundColor: Colors.background }
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </TripProvider>
    </GestureHandlerRootView>
  );
}
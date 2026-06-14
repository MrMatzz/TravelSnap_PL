import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="airplane-outline" size={64} color={Colors.primary} />
      <Text style={styles.mainText}>Brak podróży</Text>
      <Text style={styles.subText}>Dodaj swoją pierwszą podróż!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  mainText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
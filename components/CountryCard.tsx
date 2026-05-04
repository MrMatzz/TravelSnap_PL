import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RESTCOUNTRIES_BASE_URL } from '../constants/api';
import { Colors } from '../constants/Colors';
import { useFetch } from '../hooks/useFetch';
import { Country } from '../types/country';

interface CountryCardProps {
  countryName: string;
}

export default function CountryCard({ countryName }: CountryCardProps) {
  const url = `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(countryName)}`;
  const { data, loading, error } = useFetch<Country[]>(url);

  if (loading) {
    return <View style={styles.skeleton} />;
  }

  if (error || !data || !data[0]) {
    return null; 
  }

  const country = data[0];
  const currencyKeys = country.currencies ? Object.keys(country.currencies) : [];
  const currency = currencyKeys.length > 0 && country.currencies ? country.currencies[currencyKeys[0]] : undefined;
  
  const capital = country.capital && country.capital.length > 0 ? country.capital[0] : '—';
  const currencyText = currency ? `${currency.name} (${currency.symbol})` : '—';

  return (
    <View style={styles.card}>
      <Image source={{ uri: country.flags.png }} style={styles.flag} />
      <View style={styles.info}>
        <Text style={styles.countryName}>{country.name.common}</Text>
        <Text style={styles.detailText}>Stolica: {capital}</Text>
        <Text style={styles.detailText}>Waluta: {currencyText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    height: 72,
    backgroundColor: '#1A2744', 
    borderRadius: 12,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 4,
    marginRight: 16,
    backgroundColor: '#1A2744',
  },
  info: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
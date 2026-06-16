import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Colors } from '../../constants/Colors';

import CountryCard from '../../components/CountryCard';
import ErrorView from '../../components/ErrorView';
import { useCountriesQuery } from '../../hooks/useCountriesQuery';

export default function ExploreScreen() {
  const { 
    data: countries = [], 
    isLoading, 
    isError, 
    refetch 
  } = useCountriesQuery();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return <ErrorView message="Nie udało się załadować krajów" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.cca2} 
        renderItem={({ item, index }) => {
          const column = index % 2; 
          const delay = index * 50 + (column * 25);

          return (
            <Animated.View entering={FadeInDown.delay(delay).springify()}>
              <CountryCard {...({ country: item } as any)} />
            </Animated.View>
          );
        }}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
});
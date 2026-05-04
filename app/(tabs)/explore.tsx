import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import DestinationCard from '../../components/DestinationCard';
import { Colors } from '../../constants/Colors';

const POPULAR = [
  "Tokyo", "Lisbon", "Reykjavik", "Bali", 
  "Cape Town", "Kyoto", "Marrakech", "Patagonia"
];

export default function ExploreScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listKey, setListKey] = useState(0);

  const refetchAll = useCallback(() => {
    setIsRefreshing(true);
    setListKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        key={`list-${listKey}`}
        data={POPULAR}
        keyExtractor={(city) => city}
        renderItem={({ item }) => <DestinationCard city={item} />}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={refetchAll}
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
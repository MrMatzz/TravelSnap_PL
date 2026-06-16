import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { TripFormData } from '../types/tripSchema';
import RatingStars from './RatingStars';

interface TripCardProps {
  trip: TripFormData & { id: string };
  onPress?: (id: string) => void;
  onDelete?: (id: string) => void; 
}

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

const TripCard = React.memo(function TripCard({ trip, onPress }: TripCardProps) {
  return (
    <Pressable 
      style={styles.cardContainer} 
      onPress={() => onPress && onPress(trip.id)}
    >
      {trip.imageUri ? (
        <AnimatedExpoImage 
          source={{ uri: trip.imageUri }}
          // @ts-ignore
          sharedTransitionTag={`trip-image-${trip.id}`}
          style={styles.cardImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      ) : (
        <View style={[styles.cardImage, styles.placeholder]}>
          <Ionicons name="image-outline" size={48} color="#4A6FA5" />
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{trip.title}</Text>
        </View>
        
        <RatingStars rating={trip.rating} />
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{trip.destination}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{trip.date}</Text>
        </View>
      </View>

      {trip.galleryUris && trip.galleryUris.length > 0 && (
        <View style={styles.galleryBadge}>
          <Ionicons name="images" size={14} color={Colors.background} />
          <Text style={styles.galleryBadgeText}>{trip.galleryUris.length}</Text>
        </View>
      )}
    </Pressable>
  );
});

export default TripCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 4 },
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.2)' },
    }),
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  galleryBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  galleryBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholder: {
    backgroundColor: '#1A2744',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface HospitalCardProps {
  name: string;
  location: string;
  distance: string;
  rating: string;
  status: string;
  imageSource?: any;
}

export default function HospitalCard({ name, location, distance, rating, status, imageSource }: HospitalCardProps) {
  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image source={imageSource} style={styles.hospitalImage} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.location}>{location}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker" size={14} color={Colors.primary} />
            <Text style={styles.infoText}>{distance}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.infoText}>{rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    alignItems: 'center',
  },
  hospitalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
  },
  statusContainer: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  status: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

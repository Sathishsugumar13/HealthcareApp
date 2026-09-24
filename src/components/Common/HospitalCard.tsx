import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';

export interface HospitalCardProps {
  name: string;
  location?: string; // made optional to support address
  address?: string;
  distance?: string;
  rating: string;
  status?: string;
  imageSource?: any;
  onPress?: () => void;
  doctors?: string[];
}

export default function HospitalCard({ name, location, address, distance, rating, status, imageSource, onPress, doctors }: HospitalCardProps) {
  const displayLocation = address || location || '';
  
  return (
    <TouchableOpacity style={hospitalCardStyles.container} onPress={onPress} disabled={!onPress}>
      {imageSource ? (
        <Image source={imageSource} style={hospitalCardStyles.hospitalImage} />
      ) : (
        <View style={hospitalCardStyles.imagePlaceholder} />
      )}
      <View style={hospitalCardStyles.details}>
        <Text style={hospitalCardStyles.name}>{name}</Text>
        <Text style={hospitalCardStyles.location} numberOfLines={1}>{displayLocation}</Text>
        <View style={hospitalCardStyles.infoRow}>
          {distance && (
            <View style={hospitalCardStyles.infoItem}>
              <MaterialCommunityIcons name="map-marker" size={14} color={Colors.primary} />
              <Text style={hospitalCardStyles.infoText}>{distance}</Text>
            </View>
          )}
          <View style={hospitalCardStyles.infoItem}>
            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            <Text style={hospitalCardStyles.infoText}>{rating}</Text>
          </View>
        </View>
        {doctors && doctors.length > 0 && (
          <Text style={hospitalCardStyles.doctorsText} numberOfLines={1}>
            <Text style={{fontWeight: 'bold'}}>Doctors: </Text>{doctors.join(', ')}
          </Text>
        )}
      </View>
      {status && (
        <View style={hospitalCardStyles.statusContainer}>
          <Text style={hospitalCardStyles.status}>{status}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const hospitalCardStyles = StyleSheet.create({
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
  doctorsText: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 4,
  }
});

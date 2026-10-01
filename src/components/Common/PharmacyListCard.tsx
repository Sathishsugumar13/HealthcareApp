import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface PharmacyListCardProps {
  pharmacy: any;
  onSelect: (pharmacy: any) => void;
}

export default function PharmacyListCard({ pharmacy, onSelect }: PharmacyListCardProps) {
  return (
    <TouchableOpacity style={styles.pharmacyCard} onPress={() => onSelect(pharmacy)}>
      <View style={styles.pharmacyImageWrapper}>
        <Image source={pharmacy.image} style={styles.pharmacyImage} />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={Colors.colorFFF} />
          <Text style={styles.ratingText}>{pharmacy.rating}</Text>
        </View>
      </View>
      <View style={styles.pharmacyInfo}>
        <View style={styles.pharmacyTitleRow}>
          <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
          <View style={styles.distanceBadge}>
            <Ionicons name="location-outline" size={12} color={Colors.color3C72F2} />
            <Text style={styles.distanceText}>{pharmacy.distance}</Text>
          </View>
        </View>
        <Text style={styles.pharmacyAddress} numberOfLines={1}>{pharmacy.address}</Text>
        
        <View style={styles.pharmacyTabletsPreview}>
          {pharmacy.availableTablets.slice(0, 2).map((tablet: string, idx: number) => (
             <View key={idx} style={styles.miniTabletPill}>
                <Text style={styles.miniTabletText}>{tablet}</Text>
             </View>
          ))}
          {pharmacy.availableTablets.length > 2 && (
             <View style={styles.miniTabletPillMore}>
                <Text style={styles.miniTabletTextMore}>+{pharmacy.availableTablets.length - 2}</Text>
             </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pharmacyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.colorFFF,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.colorEAEAEA,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pharmacyImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  pharmacyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlay60,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: Colors.colorFFF,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  pharmacyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  pharmacyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.color333,
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colorE8F0FE,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 11,
    color: Colors.color3C72F2,
    fontWeight: '600',
    marginLeft: 2,
  },
  pharmacyAddress: {
    fontSize: 13,
    color: Colors.color666,
    marginBottom: 8,
  },
  pharmacyTabletsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  miniTabletPill: {
    backgroundColor: Colors.colorF0F5FF,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  miniTabletText: {
    color: Colors.color3C72F2,
    fontSize: 10,
    fontWeight: '600',
  },
  miniTabletPillMore: {
    backgroundColor: Colors.colorF5F5F5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  miniTabletTextMore: {
    color: Colors.color666,
    fontSize: 10,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';

export interface PharmacyCardProps {
  medicine: string;
  dosage: string;
  time: string;
  status: string;
}

export default function PharmacyCard({ medicine, dosage, time, status }: PharmacyCardProps) {
  return (
    <View style={pharmacyCardStyles.container}>
      <View style={pharmacyCardStyles.iconContainer}>
        <MaterialCommunityIcons name="pill" size={24} color={Colors.primary} />
      </View>
      <View style={pharmacyCardStyles.details}>
        <Text style={pharmacyCardStyles.medicine}>{medicine}</Text>
        <Text style={pharmacyCardStyles.dosage}>{dosage} • {time}</Text>
      </View>
      <View style={pharmacyCardStyles.statusContainer}>
        <Text style={pharmacyCardStyles.status}>{status}</Text>
      </View>
    </View>
  );
}

const pharmacyCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  medicine: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  statusContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  status: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
});

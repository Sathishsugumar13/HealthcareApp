import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PharmacyCardProps {
  medicine: string;
  dosage: string;
  time: string;
  status: string;
}

export default function PharmacyCard({ medicine, dosage, time, status }: PharmacyCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="pill" size={24} color={Colors.primary} />
      </View>
      <View style={styles.details}>
        <Text style={styles.medicine}>{medicine}</Text>
        <Text style={styles.dosage}>{dosage} • {time}</Text>
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

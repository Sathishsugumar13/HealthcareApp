import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ContactActionButtons from './ContactActionButtons';
import { Colors } from '../../theme/colors';

interface DoctorInfoCardProps {
  doctor: any;
  hideName?: boolean;
}

export default function DoctorInfoCard({ doctor, hideName = false }: DoctorInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.doctorProfileRow}>
        <View style={styles.doctorImageWrapper}>
          <Image source={doctor.image} style={styles.doctorImage} />
        </View>
        <View style={styles.doctorInfoText}>
          {!hideName && <Text style={styles.doctorName}>{doctor.name}</Text>}
          <View style={styles.specializationPill}>
            <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          </View>
          <View style={styles.ratingRow}>
            <View style={styles.statRow}>
              <Ionicons name="star" size={14} color={Colors.colorFFB800} />
              <Text style={styles.statText}>{doctor.rating}</Text>
            </View>
            <View style={styles.statRow}>
              <Ionicons name="briefcase-outline" size={14} color={Colors.color777} />
              <Text style={styles.statText}>{doctor.experience}</Text>
            </View>
          </View>
          {doctor.phone && (
            <View style={[styles.ratingRow, { marginTop: 6 }]}>
              <Ionicons name="call-outline" size={14} color={Colors.color777} />
              <Text style={styles.statText}>{doctor.phone}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.statsDivider} />
      
      <ContactActionButtons recipientName={doctor.name} phoneNumber={doctor.phone} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.colorFFF,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.colorEAEAEA,
  },
  doctorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  doctorInfoText: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 4,
  },
  specializationPill: {
    marginBottom: 6,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: Colors.color666,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: Colors.color555,
    marginLeft: 4,
  },
  statsDivider: {
    height: 1,
    backgroundColor: Colors.colorEAEAEA,
    marginVertical: 16,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Doctor } from '../HomeComponent/doctorsList/doctorsList';

interface DoctorCardProps {
  item: Doctor;
  onPress: (item: Doctor) => void;
  onChatPress: (item: Doctor) => void;
}

export default function DoctorCard({ item, onPress, onChatPress }: DoctorCardProps) {
  return (
    <View style={styles.doctorCardWrapper}>
      <TouchableOpacity style={styles.doctorCardTop} onPress={() => onPress(item)}>
        <View style={styles.doctorImageWrapper}>
          <Image source={item.image} style={styles.doctorImage} />
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.specializationPill}>
            <Text style={styles.doctorSpecialization}>{item.specialization}</Text>
          </View>
          <View style={styles.doctorStats}>
            <View style={styles.statRow}>
              <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
              <Text style={styles.statText}>{item.rating}</Text>
            </View>
            <View style={styles.statRow}>
              <MaterialCommunityIcons name="briefcase-variant-outline" size={14} color="#777" />
              <Text style={styles.statText}>{item.experience}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sideActions}>
          <View style={styles.sideIconsColumn}>
            <TouchableOpacity 
              style={[styles.actionIconButton, { backgroundColor: '#EDE9FE' }]}
              onPress={() => onChatPress(item)}
            >
              <MaterialCommunityIcons name="message-processing-outline" size={16} color="#8B5CF6" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionIconButton, { marginTop: 8, backgroundColor: '#E6F9F0' }]}>
              <MaterialCommunityIcons name="phone-in-talk-outline" size={16} color="#00C473" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  doctorCardWrapper: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  doctorCardTop: {
    flexDirection: 'row',
    padding: 12,
  },
  doctorImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    marginRight: 14,
    position: 'relative',
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  specializationPill: {
    backgroundColor: '#E5F1F8',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  doctorSpecialization: {
    fontSize: 11,
    color: '#3C72F2',
    fontWeight: '600',
  },
  doctorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
    fontWeight: '500',
  },
  sideActions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  sideIconsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5F1F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

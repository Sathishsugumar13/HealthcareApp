import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Colors } from '../../../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppointmentCardProps {
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Confirmed';
  imageSource?: any;
  onPressAction?: () => void;
  containerStyle?: any;
}

export default function AppointmentCard({
  doctorName,
  specialization,
  date,
  time,
  status,
  imageSource,
  onPressAction,
  containerStyle
}: AppointmentCardProps) {
  const isConfirmed = status === 'Confirmed';

  return (
    <View style={[styles.appointmentCard, containerStyle]}>
      <View style={styles.appointmentHeader}>
        <View style={styles.doctorInfoRow}>
          <View style={styles.doctorImageSmallPlaceholder}>
            {imageSource && <Image source={imageSource} style={styles.smallAvatarImage} />}
          </View>
          <View>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.doctorSpecialization}>{specialization}</Text>
          </View>
        </View>
        <View style={[styles.appointmentStatus, isConfirmed && { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statusText, isConfirmed && { color: '#4CAF50' }]}>{status}</Text>
        </View>
      </View>
      <View style={styles.appointmentDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="calendar-month-outline" size={16} color={Colors.secondaryText} />
          <Text style={styles.detailText}>{date}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.secondaryText} />
          <Text style={styles.detailText}>{time}</Text>
        </View>
      </View>
      <Pressable style={[styles.joinButton, isConfirmed && { backgroundColor: '#4CAF50' }]} onPress={onPressAction}>
        <Text style={styles.joinButtonText}>{isConfirmed ? 'Reschedule' : 'Join Consultation'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  doctorInfoRow: {
    flexDirection: 'row',
  },
  doctorImageSmallPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E8E8',
    marginRight: 12,
    overflow: 'hidden',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  appointmentStatus: {
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentDetails: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.text,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  joinButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  smallAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

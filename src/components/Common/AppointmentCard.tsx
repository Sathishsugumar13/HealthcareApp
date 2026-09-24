import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';

export interface AppointmentCardProps {
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
    <View style={[appointmentCardStyles.appointmentCard, containerStyle]}>
      <View style={appointmentCardStyles.appointmentHeader}>
        <View style={appointmentCardStyles.doctorInfoRow}>
          <View style={appointmentCardStyles.doctorImageSmallPlaceholder}>
            {imageSource && <Image source={imageSource} style={appointmentCardStyles.smallAvatarImage} />}
          </View>
          <View>
            <Text style={appointmentCardStyles.doctorName}>{doctorName}</Text>
            <Text style={appointmentCardStyles.doctorSpecialization}>{specialization}</Text>
          </View>
        </View>
        <View style={[appointmentCardStyles.appointmentStatus, isConfirmed && { backgroundColor: '#E8F5E9' }]}>
          <Text style={[appointmentCardStyles.statusText, isConfirmed && { color: '#4CAF50' }]}>{status}</Text>
        </View>
      </View>
      <View style={appointmentCardStyles.appointmentDetails}>
        <View style={appointmentCardStyles.detailItem}>
          <MaterialCommunityIcons name="calendar-month-outline" size={16} color={Colors.secondaryText} />
          <Text style={appointmentCardStyles.detailText}>{date}</Text>
        </View>
        <View style={appointmentCardStyles.detailItem}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.secondaryText} />
          <Text style={appointmentCardStyles.detailText}>{time}</Text>
        </View>
      </View>
      <Pressable style={[appointmentCardStyles.joinButton, isConfirmed && { backgroundColor: '#4CAF50' }]} onPress={onPressAction}>
        <Text style={appointmentCardStyles.joinButtonText}>{isConfirmed ? 'Reschedule' : 'Join Consultation'}</Text>
      </Pressable>
    </View>
  );
}

const appointmentCardStyles = StyleSheet.create({
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

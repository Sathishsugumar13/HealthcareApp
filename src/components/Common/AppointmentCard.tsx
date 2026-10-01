import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export interface AppointmentCardProps {
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Confirmed';
  imageSource?: any;
  patientName?: string;
  phone?: string;
  paymentMethod?: string;
  paymentStatus?: string;
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
  patientName,
  phone,
  paymentMethod,
  paymentStatus,
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
        <View style={[appointmentCardStyles.appointmentStatus, isConfirmed && { backgroundColor: Colors.successBg }]}>
          <Text style={[appointmentCardStyles.statusText, isConfirmed && { color: Colors.success }]}>{status}</Text>
        </View>
      </View>

      {}
      {patientName && (
        <View style={appointmentCardStyles.extraDetailsContainer}>
          <View style={appointmentCardStyles.infoRow}>
            <View style={appointmentCardStyles.infoRowLeft}>
              <Ionicons name="person-outline" size={16} color={Colors.color64748B} />
              <Text style={appointmentCardStyles.infoLabel}>Patient</Text>
            </View>
            <Text style={appointmentCardStyles.infoValue}>{patientName}</Text>
          </View>
          
          {phone && (
            <View style={appointmentCardStyles.infoRow}>
              <View style={appointmentCardStyles.infoRowLeft}>
                <Ionicons name="call-outline" size={16} color={Colors.color64748B} />
                <Text style={appointmentCardStyles.infoLabel}>Phone</Text>
              </View>
              <Text style={appointmentCardStyles.infoValue}>{phone}</Text>
            </View>
          )}

          <View style={appointmentCardStyles.divider} />

          <View style={appointmentCardStyles.infoRow}>
            <View style={appointmentCardStyles.infoRowLeft}>
              <Ionicons name="card-outline" size={16} color={Colors.color64748B} />
              <Text style={appointmentCardStyles.infoLabel}>Method</Text>
            </View>
            <Text style={appointmentCardStyles.infoValue}>{paymentMethod || 'Pay at Clinic'}</Text>
          </View>

          <View style={appointmentCardStyles.infoRow}>
            <View style={appointmentCardStyles.infoRowLeft}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.color64748B} />
              <Text style={appointmentCardStyles.infoLabel}>Status</Text>
            </View>
            <Text style={[
              appointmentCardStyles.infoValue, 
              { color: paymentStatus === 'Paid' ? Colors.color00C473 : Colors.colorFF9800 }
            ]}>
              {paymentStatus || 'Pending'}
            </Text>
          </View>
        </View>
      )}

      <View style={appointmentCardStyles.appointmentDetails}>
        <View style={appointmentCardStyles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={Colors.secondaryText} />
          <Text style={appointmentCardStyles.detailText}>{date}</Text>
        </View>
        <View style={appointmentCardStyles.detailItem}>
          <Ionicons name="time-outline" size={16} color={Colors.secondaryText} />
          <Text style={appointmentCardStyles.detailText}>{time}</Text>
        </View>
      </View>
      <Pressable style={[appointmentCardStyles.joinButton, isConfirmed && { backgroundColor: Colors.success }]} onPress={onPressAction}>
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
    borderColor: Colors.colorF0F0F0,
    shadowColor: Colors.color000,
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
    backgroundColor: Colors.border,
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
    backgroundColor: Colors.colorFFF4E5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.colorFF9800,
    fontSize: 12,
    fontWeight: '600',
  },
  extraDetailsContainer: {
    backgroundColor: Colors.colorF8FAFC,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.colorE2E8F0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.color64748B,
    marginLeft: 6,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: Colors.color334155,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.colorE2E8F0,
    marginVertical: 8,
  },
  appointmentDetails: {
    flexDirection: 'row',
    backgroundColor: Colors.colorF5F5F5,
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

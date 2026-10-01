import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export interface PharmacyCardProps {
  medicine: string;
  dosage: string;
  time: string;
  status: string;
  patientName?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export default function PharmacyCard({ 
  medicine, dosage, time, status, 
  patientName, phone, address, paymentMethod, paymentStatus 
}: PharmacyCardProps) {
  
  return (
    <View style={pharmacyCardStyles.container}>
      <View style={pharmacyCardStyles.headerRow}>
        <View style={pharmacyCardStyles.iconContainer}>
          <Ionicons name="medkit-outline" size={24} color={Colors.primary} />
        </View>
        <View style={pharmacyCardStyles.details}>
          <Text style={pharmacyCardStyles.medicine} numberOfLines={2}>{medicine}</Text>
          <Text style={pharmacyCardStyles.dosage}>{dosage} • {time}</Text>
        </View>
        <View style={pharmacyCardStyles.statusContainer}>
          <Text style={pharmacyCardStyles.status}>{status}</Text>
        </View>
      </View>
      
      {patientName && (
        <View style={pharmacyCardStyles.extraDetailsContainer}>
          <View style={pharmacyCardStyles.infoRow}>
            <View style={pharmacyCardStyles.infoRowLeft}>
              <Ionicons name="person-outline" size={16} color={Colors.color64748B} />
              <Text style={pharmacyCardStyles.infoLabel}>Patient</Text>
            </View>
            <Text style={pharmacyCardStyles.infoValue}>{patientName}</Text>
          </View>
          
          {phone && (
            <View style={pharmacyCardStyles.infoRow}>
              <View style={pharmacyCardStyles.infoRowLeft}>
                <Ionicons name="call-outline" size={16} color={Colors.color64748B} />
                <Text style={pharmacyCardStyles.infoLabel}>Phone</Text>
              </View>
              <Text style={pharmacyCardStyles.infoValue}>{phone}</Text>
            </View>
          )}

          {address && (
            <View style={[pharmacyCardStyles.infoRow, { alignItems: 'flex-start' }]}>
              <View style={pharmacyCardStyles.infoRowLeft}>
                <Ionicons name="location-outline" size={16} color={Colors.color64748B} />
                <Text style={pharmacyCardStyles.infoLabel}>Address</Text>
              </View>
              <Text style={[pharmacyCardStyles.infoValue, { flex: 1, textAlign: 'right', marginLeft: 16 }]} numberOfLines={2}>{address}</Text>
            </View>
          )}

          <View style={pharmacyCardStyles.divider} />
          
          <View style={pharmacyCardStyles.infoRow}>
            <View style={pharmacyCardStyles.infoRowLeft}>
              <Ionicons name="card-outline" size={16} color={Colors.color64748B} />
              <Text style={pharmacyCardStyles.infoLabel}>Method</Text>
            </View>
            <Text style={pharmacyCardStyles.infoValue}>{paymentMethod || 'N/A'}</Text>
          </View>

          <View style={pharmacyCardStyles.infoRow}>
            <View style={pharmacyCardStyles.infoRowLeft}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.color64748B} />
              <Text style={pharmacyCardStyles.infoLabel}>Status</Text>
            </View>
            <Text style={[
              pharmacyCardStyles.infoValue, 
              { color: paymentStatus === 'Paid' ? Colors.color10B981 : Colors.colorF59E0B }
            ]}>
              {paymentStatus || 'N/A'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const pharmacyCardStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.colorE6F0FF,
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
    backgroundColor: Colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  status: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  extraDetailsContainer: {
    backgroundColor: Colors.colorF8FAFC,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.colorE2E8F0,
    marginTop: 8,
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
});

import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EmergencyButton() {
  return (
    <View style={styles.emergencyContainer}>
      <Pressable style={styles.emergencyCallButton} onPress={() => Alert.alert('Emergency', 'Calling Ambulance 108...')}>
        <View style={styles.emergencyCallIconCircle}>
          <MaterialCommunityIcons name="phone-in-talk" size={26} color="#FFF" />
        </View>
        <View style={styles.emergencyCallTextWrapper}>
          <Text style={styles.emergencyCallTitle}>Call Ambulance</Text>
          <Text style={styles.emergencyCallSub}>Dial 108 immediately</Text>
        </View>
        <MaterialCommunityIcons name="ambulance" size={28} color="#FFD1D1" style={{ opacity: 0.5 }} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emergencyContainer: {
    paddingBottom: 40,
  },
  emergencyCallButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyCallIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyCallTextWrapper: {
    flex: 1,
  },
  emergencyCallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  emergencyCallSub: {
    fontSize: 13,
    color: '#FFE4E4',
    fontWeight: '500',
  },
});

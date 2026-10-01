import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function EmergencyButton() {
  return (
    <View style={styles.emergencyContainer}>
      <Pressable style={styles.emergencyCallButton} onPress={() => { Linking.openURL('tel:+917904176040').catch(err => console.error('Failed to open dialer', err)); }}>
        <View style={styles.emergencyCallIconCircle}>
          <Ionicons name="call" size={26} color={Colors.colorFFF} />
        </View>
        <View style={styles.emergencyCallTextWrapper}>
          <Text style={styles.emergencyCallTitle}>Call Ambulance</Text>
          <Text style={styles.emergencyCallSub}>Dial +917904176040 immediately</Text>
        </View>
        <FontAwesome5 name="ambulance" size={28} color={Colors.colorFFD1D1} style={styles.inlineOpacity05} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineOpacity05: { opacity: 0.5 },

  emergencyContainer: {
    paddingBottom: 40,
  },
  emergencyCallButton: {
    flexDirection: 'row',
    backgroundColor: Colors.colorEF4444,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.colorEF4444,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyCallIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightOverlay20,
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
    color: Colors.colorFFF,
    marginBottom: 4,
  },
  emergencyCallSub: {
    fontSize: 13,
    color: Colors.colorFFE4E4,
    fontWeight: '500',
  },
});

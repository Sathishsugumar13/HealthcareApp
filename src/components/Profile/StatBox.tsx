import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export interface StatBoxProps {
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  iconName: string;
  label: string;
  value: string;
}

export default function StatBox({ iconFamily, iconName, label, value }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      {iconFamily === 'Ionicons' ? (
        <Ionicons name={iconName as any} size={24} color="#4A80F0" />
      ) : (
        <MaterialCommunityIcons name={iconName as any} size={24} color="#4A80F0" />
      )}
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statBox: {
    alignItems: 'center',
    width: '30%',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  statValue: {
    color: '#4A80F0',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

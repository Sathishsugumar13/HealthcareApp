import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export interface StatBoxProps {
  iconFamily: 'Ionicons' | 'FontAwesome5' | 'MaterialCommunityIcons';
  iconName: string;
  label: string;
  value: string;
}

export default function StatBox({ iconFamily, iconName, label, value }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      {iconFamily === 'FontAwesome5' ? (
        <FontAwesome5 name={iconName as any} size={24} color={Colors.color4A80F0} />
      ) : iconFamily === 'MaterialCommunityIcons' ? (
        <MaterialCommunityIcons name={iconName as any} size={24} color={Colors.color4A80F0} />
      ) : (
        <Ionicons name={iconName as any} size={24} color={Colors.color4A80F0} />
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
    color: Colors.color888,
    fontSize: 12,
    marginTop: 5,
  },
  statValue: {
    color: Colors.color4A80F0,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

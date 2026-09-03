import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DailyHealthTipCardProps {
  tip: string;
  containerStyle?: any;
}

export default function DailyHealthTipCard({ tip, containerStyle }: DailyHealthTipCardProps) {
  return (
    <View style={[styles.tipCard, containerStyle]}>
      <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFB300" style={styles.tipIcon} />
      <Text style={styles.tipText}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  }
});

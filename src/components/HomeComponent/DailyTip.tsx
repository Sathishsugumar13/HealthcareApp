import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function DailyTip() {
  return (
    <View style={styles.dailyTipCard}>
      <View style={styles.dailyTipIconContainer}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={Colors.colorFFA500} />
      </View>
      <Text style={styles.dailyTipText}>Drink enough water and stay hydrated every day.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dailyTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colorFDF7E5,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.colorFFA500,
  },
  dailyTipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.colorFFF,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dailyTipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.color333,
    lineHeight: 20,
  },
});

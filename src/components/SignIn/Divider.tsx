/**
 * Component: Divider
 * Originally created for: Sign In Page
 * Usage: "OR" divider line in auth screens
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface DividerProps {
  text: string;
}

export default function Divider({ text }: DividerProps) {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  text: {
    marginHorizontal: 10,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
});

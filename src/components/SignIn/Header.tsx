/**
 * Component: Header
 * Originally created for: Sign In Page
 * Usage: Reusable header across multiple screens
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from '../../theme/colors';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
}

export default function Header({ title, onBackPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      {onBackPress ? (
        <Pressable onPress={onBackPress} style={styles.backBtn}>
          <Feather name="chevron-left" size={32} color={Colors.text} />
        </Pressable>
      ) : (
        <View style={styles.backBtn} />
      )}
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.backBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 10,
  },
  backBtn: {
    width: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
});

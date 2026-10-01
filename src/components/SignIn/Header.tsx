
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import BackButton from '../Common/BackButton';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
}

export default function Header({ title, onBackPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      {onBackPress ? (
        <View style={styles.backBtn}>
          <BackButton iconFamily="Ionicons" onPress={onBackPress} size={32} color={Colors.text} style={styles.inlineMarginleft10} />
        </View>
      ) : (
        <View style={styles.backBtn} />
      )}
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.backBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  inlineMarginleft10: { marginLeft: -10 },

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

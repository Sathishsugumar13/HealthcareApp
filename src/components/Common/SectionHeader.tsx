import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';

export interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export default function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={sectionHeaderStyles.container}>
      <Text style={sectionHeaderStyles.title}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={sectionHeaderStyles.seeAll}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

const sectionHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ServiceCardProps {
  title: string;
  icon: any;
}

export default function ServiceCard({ title, icon }: ServiceCardProps) {
  return (
    <Pressable style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 70,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Make it a circle
    backgroundColor: '#3C72F2', // Blue matching image
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

interface HealthBannerProps {
  title: string;
  description: string;
}

export default function HealthBanner({ title, description }: HealthBannerProps) {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{title}</Text>
        <Text style={styles.bannerDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#E6F0FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  bannerContent: {
    width: '70%',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  bannerDesc: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});

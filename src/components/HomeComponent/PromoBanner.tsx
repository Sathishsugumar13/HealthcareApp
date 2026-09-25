import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PromoBanner() {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerTitle}>Your Health, Our Priority</Text>
        <Text style={styles.bannerDescription}>Take care of your health every day.</Text>
      </View>
      <View style={styles.bannerImageContainer}>
        <MaterialCommunityIcons name="heart-pulse" size={48} color="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#3C72F2',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    overflow: 'hidden',
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#E5F1F8',
    lineHeight: 20,
  },
  bannerImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

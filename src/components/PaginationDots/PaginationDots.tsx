/**
 * Component: PaginationDots
 * Originally created for: Onboarding Page
 * Usage: Indicators for swiping pages
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface PaginationDotsProps {
  totalPages: number;
  currentPage: number;
}

export default function PaginationDots({ totalPages, currentPage }: PaginationDotsProps) {
  const dots = [];
  for (let i = 1; i <= totalPages; i++) {
    dots.push(
      <View key={i} style={i === currentPage ? styles.activeDash : styles.inactiveDash} />
    );
  }

  return <View style={styles.paginationContainer}>{dots}</View>;
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 15,
  },
  activeDash: {
    width: 22,
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  inactiveDash: {
    width: 22,
    height: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 3,
  },
});

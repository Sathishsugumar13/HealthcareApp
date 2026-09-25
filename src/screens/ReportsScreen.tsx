import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReportsContent from '../components/Reports/ReportsContent';

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ReportsContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  }
});


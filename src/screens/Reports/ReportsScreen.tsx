import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ReportsContent from '../../components/Reports/ReportsContent';

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

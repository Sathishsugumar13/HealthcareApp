import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationContent from '../../components/Notification/NotificationContent';

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <NotificationContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  }
});

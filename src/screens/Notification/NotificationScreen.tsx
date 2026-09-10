import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
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

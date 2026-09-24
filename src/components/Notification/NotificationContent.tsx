import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useGlobalNotifications } from '../../context/NotificationContext';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationCard from '../Common/NotificationCard';

export default function NotificationContent() {
  const { notifications, readIds, markAsRead } = useGlobalNotifications();
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const unreadList = notifications.filter(n => !readIds.includes(n.request.identifier));
  const readList = notifications.filter(n => readIds.includes(n.request.identifier));

  const handleNotificationPress = (item: any, isUnread: boolean) => {
    if (isUnread) markAsRead(item.request.identifier);
    setSelectedNotification(item);
  };

  const renderNotification = (item: any, isUnread: boolean) => (
    <NotificationCard 
      key={item.request.identifier} 
      item={item} 
      isUnread={isUnread} 
      onPress={handleNotificationPress} 
    />
  );

  return (
    <View style={styles.mainBox}>
      {notifications.length === 0 ? (
        <View style={styles.centerBox}>
          <Image 
            source={require('../../assets/images/no_data.png')} 
            style={styles.imageStyle} 
          />
          <Text style={{ marginTop: 20, fontSize: 16, color: 'gray' }}>No new notifications</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false}>
          {unreadList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>New Notifications</Text>
              {unreadList.map(item => renderNotification(item, true))}
            </>
          )}

          {readList.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: unreadList.length > 0 ? 20 : 0 }]}>Old Notifications</Text>
              {readList.map(item => renderNotification(item, false))}
            </>
          )}
        </ScrollView>
      )}

      {/* Unique Popup Modal for Notification Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedNotification}
        onRequestClose={() => setSelectedNotification(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Minimalist Clean Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderLeft}>
                <Image 
                  source={require('../../assets/images/healthcare-logo.png')} 
                  style={styles.headerLogo} 
                  resizeMode="contain"
                />
                <Text style={styles.modalAppName}>Healthcare App</Text>
              </View>
              <Text style={styles.modalTimeSmall}>Just now</Text>
            </View>
            
            <ScrollView style={styles.modalBodyScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {selectedNotification?.request.content.title || 'Notification'}
              </Text>
              <Text style={styles.modalBodyText}>
                {selectedNotification?.request.content.body}
              </Text>
            </ScrollView>

            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={styles.simpleCloseButton} 
                onPress={() => setSelectedNotification(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.simpleCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    padding: 20,
    paddingTop: 50, // giving space for top status bar
    backgroundColor: 'white',
    flex: 1, // using flex to allow centering
  },
  centerBox: {
    flex: 1, // this makes it take full available height
    alignItems: 'center',
    justifyContent: 'center', // perfect center vertically
  },
  imageStyle: {
    width: 350, // made image even bigger
    height: 350,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 16,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  modalAppName: {
    fontSize: 14,
    color: '#223A6A',
    marginLeft: 6,
    fontWeight: '700',
  },
  modalTimeSmall: {
    fontSize: 12,
    color: '#999',
  },
  modalBodyScroll: {
    width: '100%',
    marginBottom: 20,
    maxHeight: 250,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalBodyText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  modalActionRow: {
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 10,
  },
  simpleCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#EEF3FF',
  },
  simpleCloseButtonText: {
    color: '#3572E1',
    fontSize: 16,
    fontWeight: '600',
  }
});

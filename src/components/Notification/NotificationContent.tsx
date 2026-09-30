import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useGlobalNotifications } from '../../context/NotificationContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import NotificationCard from '../Common/NotificationCard';
import { images } from '../../assets/images';
import { Colors } from '../../theme/colors';

export default function NotificationContent() {
  const { notifications, readIds, markAsRead, deleteNotification } = useGlobalNotifications();
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
      onDelete={() => setDeleteConfirmId(item.request.identifier)}
    />
  );

  return (
    <View style={styles.mainBox}>
      {notifications.length === 0 ? (
        <View style={styles.centerBox}>
          <Image 
            source={images.common.noData} 
            style={styles.imageStyle} 
          />
          <Text style={styles.inlineMargintop20Fontsize16Col}>No new notifications</Text>
        </View>
      ) : (
        <ScrollView style={styles.inlineFlex1Width100} showsVerticalScrollIndicator={false}>
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

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedNotification}
        onRequestClose={() => setSelectedNotification(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderLeft}>
                <Image 
                  source={images.common.healthcareLogo} 
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!deleteConfirmId}
        onRequestClose={() => setDeleteConfirmId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Delete Notification</Text>
            <Text style={styles.confirmModalBody}>Are you sure you want to delete this notification?</Text>
            <View style={styles.confirmActionRow}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setDeleteConfirmId(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmBtn} 
                onPress={() => {
                  if (deleteConfirmId) {
                    deleteNotification(deleteConfirmId);
                  }
                  setDeleteConfirmId(null);
                }}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineMargintop20Fontsize16Col: { marginTop: 20, fontSize: 16, color: Colors.gray },
  inlineFlex1Width100: { flex: 1, width: '100%' },

  mainBox: {
    padding: 20,
    paddingTop: 50, 
    backgroundColor: Colors.white,
    flex: 1, 
  },
  centerBox: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center', 
  },
  imageStyle: {
    width: 350, 
    height: 350,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.color333
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.colorFFF,
    borderRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 16,
    maxHeight: '75%',
    shadowColor: Colors.color000,
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
    color: Colors.brandDark,
    marginLeft: 6,
    fontWeight: '700',
  },
  modalTimeSmall: {
    fontSize: 12,
    color: Colors.color999,
  },
  modalBodyScroll: {
    width: '100%',
    marginBottom: 20,
    maxHeight: 250,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 10,
  },
  modalBodyText: {
    fontSize: 16,
    color: Colors.color555,
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
    backgroundColor: Colors.colorEEF3FF,
  },
  simpleCloseButtonText: {
    color: Colors.color3572E1,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmModalContent: {
    width: '80%',
    backgroundColor: Colors.colorFFF,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 10,
    textAlign: 'center'
  },
  confirmModalBody: {
    fontSize: 16,
    color: Colors.color555,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.colorF5F5F5,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.color555,
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

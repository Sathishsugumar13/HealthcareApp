import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal } from 'react-native';
import { Colors } from '../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  profileImage: string | null;
  onChangePhoto: () => void;
  onLogout: () => void;
}

export default function ProfileModal({
  visible,
  onClose,
  user,
  profileImage,
  onChangePhoto,
  onLogout
}: ProfileModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Profile Info</Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </Pressable>
          </View>
          
          <View style={styles.modalBody}>
            <Pressable onPress={onChangePhoto} style={styles.modalAvatarContainer}>
              <View style={styles.modalAvatar}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <MaterialCommunityIcons name="account" size={50} color={Colors.gray} />
                )}
              </View>
              <View style={styles.editBadge}>
                <MaterialCommunityIcons name="camera" size={16} color="#FFF" />
              </View>
            </Pressable>
            
            <Text style={styles.modalNameText}>{user?.name || 'User'}</Text>
            <Text style={styles.modalEmailText}>{user?.email || 'user@example.com'}</Text>

            <Pressable style={styles.logoutButton} onPress={onLogout}>
              <MaterialCommunityIcons name="logout" size={20} color="#FF4D4D" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    alignItems: 'center',
    width: '100%',
  },
  modalAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3C72F2',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#3C72F2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  modalNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalEmailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE6E6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4D4D',
    marginLeft: 8,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';

interface ProfileModalProps {
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  profileImageHook: any;
  user: any;
  handleUserLogout: () => void;
}

export default function ProfileModal({
  isProfileModalOpen,
  setIsProfileModalOpen,
  profileImageHook,
  user,
  handleUserLogout,
}: ProfileModalProps) {
  return (
    <Modal visible={isProfileModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsProfileModalOpen(false)}>
      <View style={styles.profileModalOverlay}>
        <View style={styles.profileModalContent}>
          <View style={styles.profileModalHeader}>
            <Text style={styles.profileModalTitle}>Profile Info</Text>
            <Pressable onPress={() => setIsProfileModalOpen(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </Pressable>
          </View>
          <View style={styles.profileModalBody}>
            <Pressable onPress={profileImageHook.onChangePhoto} style={styles.profileModalAvatarContainer}>
              <View style={styles.profileModalAvatar}>
                {profileImageHook.profileImage ? (
                  <Image source={{ uri: profileImageHook.profileImage }} style={styles.avatarImage} />
                ) : (
                  <MaterialCommunityIcons name="account" size={50} color={Colors.gray} />
                )}
              </View>
              <View style={styles.editBadge}>
                <MaterialCommunityIcons name="camera" size={16} color="#FFF" />
              </View>
            </Pressable>
            <Text style={styles.profileModalNameText}>{user?.name || 'User'}</Text>
            <Text style={styles.profileModalEmailText}>{user?.email || 'user@example.com'}</Text>
            <Pressable style={styles.logoutButton} onPress={handleUserLogout}>
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
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContent: {
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
  profileModalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileModalBody: {
    alignItems: 'center',
    width: '100%',
  },
  profileModalAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileModalAvatar: {
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
  profileModalNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileModalEmailText: {
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

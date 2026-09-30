import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface ProfileModalProps {
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  profileImageHook: any;
  user: any;
  handleUserLogout: () => void;
  onUpdateUser?: (updatedUser: any) => void;
}

export default function ProfileModal({
  isProfileModalOpen,
  setIsProfileModalOpen,
  profileImageHook,
  user,
  handleUserLogout,
  onUpdateUser
}: ProfileModalProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [modalView, setModalView] = useState<'info' | 'photo'>('info');
  
  const [editName, setEditName] = useState(user?.name || 'User');
  const [editEmail, setEditEmail] = useState(user?.email || 'user@example.com');

  useEffect(() => {
    if (user) {
      setEditName(user.name || 'User');
      setEditEmail(user.email || 'user@example.com');
    }
  }, [user]);

  const handleSaveName = () => {
    if (onUpdateUser) {
      onUpdateUser({ ...user, name: editName });
    }
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    if (onUpdateUser) {
      onUpdateUser({ ...user, email: editEmail });
    }
    setIsEditingEmail(false);
  };

  const handleClose = () => {
    setIsEditingName(false);
    setIsEditingEmail(false);
    setModalView('info');
    setIsProfileModalOpen(false);
    if (user) {
      setEditName(user.name || 'User');
      setEditEmail(user.email || 'user@example.com');
    }
  };

  const handlePhotoAction = async (actionFn: () => Promise<void>) => {
    await actionFn();
    setModalView('info');
  };

  return (
    <Modal visible={isProfileModalOpen} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <View style={styles.profileModalOverlay}>
        <View style={styles.profileModalContent}>
          <View style={styles.profileModalHeader}>
            <Text style={styles.profileModalTitle}>Profile Info</Text>
            <Pressable onPress={handleClose}>
              <MaterialCommunityIcons name="close" size={24} color={Colors.color333} />
            </Pressable>
          </View>
          {modalView === 'info' ? (
            <View style={styles.profileModalBody}>
              <Pressable onPress={() => setModalView('photo')} style={styles.profileModalAvatarContainer}>
                <View style={styles.profileModalAvatar}>
                  {profileImageHook.profileImage ? (
                    <Image source={{ uri: profileImageHook.profileImage }} style={styles.avatarImage} />
                  ) : (
                    <MaterialCommunityIcons name="account" size={50} color={Colors.gray} />
                  )}
                </View>
                <View style={styles.editBadge}>
                  <MaterialCommunityIcons name="camera" size={16} color={Colors.colorFFF} />
                </View>
              </Pressable>

              {/* Name Section */}
              <View style={styles.fieldContainer}>
                {isEditingName ? (
                  <View style={styles.editInlineRow}>
                    <TextInput 
                      style={styles.inlineInput} 
                      value={editName} 
                      onChangeText={setEditName} 
                      placeholder="Enter your name"
                    />
                    <View style={styles.inlineActions}>
                      <Pressable style={styles.iconBtn} onPress={() => setIsEditingName(false)}>
                        <MaterialCommunityIcons name="close-circle" size={24} color={Colors.error} />
                      </Pressable>
                      <Pressable style={styles.iconBtn} onPress={handleSaveName}>
                        <MaterialCommunityIcons name="check-circle" size={24} color={Colors.success} />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoRow}>
                    <Text style={styles.profileModalNameText}>{user?.name || 'User'}</Text>
                    <View style={styles.editIconContainer}>
                      <Pressable onPress={() => setIsEditingName(true)} style={styles.editIconBtn}>
                        <MaterialCommunityIcons name="pencil" size={18} color={Colors.color3C72F2} />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>

              {/* Email Section */}
              <View style={styles.fieldContainer}>
                {isEditingEmail ? (
                  <View style={styles.editInlineRow}>
                    <TextInput 
                      style={styles.inlineInput} 
                      value={editEmail} 
                      onChangeText={setEditEmail} 
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <View style={styles.inlineActions}>
                      <Pressable style={styles.iconBtn} onPress={() => setIsEditingEmail(false)}>
                        <MaterialCommunityIcons name="close-circle" size={24} color={Colors.error} />
                      </Pressable>
                      <Pressable style={styles.iconBtn} onPress={handleSaveEmail}>
                        <MaterialCommunityIcons name="check-circle" size={24} color={Colors.success} />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoRow}>
                    <Text style={styles.profileModalEmailText}>{user?.email || 'user@example.com'}</Text>
                    <View style={styles.editIconContainer}>
                      <Pressable onPress={() => setIsEditingEmail(true)} style={styles.editIconBtn}>
                        <MaterialCommunityIcons name="pencil" size={18} color={Colors.color3C72F2} />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>

              <Pressable style={styles.logoutButton} onPress={handleUserLogout}>
                <MaterialCommunityIcons name="logout" size={20} color={Colors.error} />
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.profileModalBody}>
              <View style={styles.profileModalAvatarContainer}>
                <View style={[styles.profileModalAvatar, { width: 120, height: 120, borderRadius: 60 }]}>
                  {profileImageHook.profileImage ? (
                    <Image source={{ uri: profileImageHook.profileImage }} style={[styles.avatarImage, { width: 120, height: 120, borderRadius: 60 }]} />
                  ) : (
                    <MaterialCommunityIcons name="account" size={60} color={Colors.gray} />
                  )}
                </View>
              </View>

              <Pressable style={styles.photoActionButton} onPress={() => handlePhotoAction(profileImageHook.takePhoto)}>
                <MaterialCommunityIcons name="camera" size={24} color={Colors.color3C72F2} />
                <Text style={styles.photoActionText}>Take Photo</Text>
              </Pressable>

              <Pressable style={styles.photoActionButton} onPress={() => handlePhotoAction(profileImageHook.pickImage)}>
                <MaterialCommunityIcons name="image" size={24} color={Colors.color3C72F2} />
                <Text style={styles.photoActionText}>Choose from Gallery</Text>
              </Pressable>

              <Pressable style={[styles.photoActionButton, { borderBottomWidth: 0 }]} onPress={() => handlePhotoAction(profileImageHook.removePhoto)}>
                <MaterialCommunityIcons name="delete" size={24} color={Colors.error} />
                <Text style={[styles.photoActionText, { color: Colors.error }]}>Remove Photo</Text>
              </Pressable>

              <Pressable style={styles.backButton} onPress={() => setModalView('info')}>
                <Text style={styles.backText}>Back</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  profileModalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContent: {
    width: '85%',
    backgroundColor: Colors.colorFFF,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.color000,
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
    color: Colors.color333,
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
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.color3C72F2,
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
    backgroundColor: Colors.color3C72F2,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.colorFFF,
  },
  fieldContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingVertical: 5,
  },
  profileModalNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  profileModalEmailText: {
    fontSize: 14,
    color: Colors.color666,
  },
  editIconContainer: {
    position: 'absolute',
    right: 15,
  },
  editIconBtn: {
    padding: 6,
    backgroundColor: Colors.colorF0F0F0,
    borderRadius: 15,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  inlineInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    color: Colors.color333,
  },
  inlineActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconBtn: {
    marginLeft: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colorFFE6E6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
    marginLeft: 8,
  },
  photoActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorF0F0F0,
  },
  photoActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.color333,
    marginLeft: 15,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: Colors.colorF0F0F0,
    borderRadius: 25,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.color333,
  },
});

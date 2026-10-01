import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../../theme/colors';

interface AttachmentUploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  onUploadSuccess: (fileName: string) => void;
  allowDocument?: boolean;
}

export default function AttachmentUploadModal({ 
  isVisible, 
  onClose, 
  title, 
  onUploadSuccess,
  allowDocument = true 
}: AttachmentUploadModalProps) {
  
  const handleCamera = async () => {
    onClose();
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop() || 'photo.jpg';
      onUploadSuccess(fileName);
    }
  };

  const handleGallery = async () => {
    onClose();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop() || 'gallery_image.jpg';
      onUploadSuccess(fileName);
    }
  };

  const handleDocument = async () => {
    onClose();
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled) {
      
      const fileName = result.assets ? result.assets[0].name : 'document.pdf';
      onUploadSuccess(fileName);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.uploadModalContainer} activeOpacity={1} onPress={() => {}}>
          <Text style={styles.uploadModalTitle}>{title}</Text>
          
          <TouchableOpacity style={styles.uploadOptionButton} onPress={handleCamera}>
            <Ionicons name="camera-outline" size={24} color={Colors.color3C72F2} />
            <Text style={styles.uploadOptionText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.uploadOptionButton} onPress={handleGallery}>
            <Ionicons name="image-outline" size={24} color={Colors.color3C72F2} />
            <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          {allowDocument && (
            <TouchableOpacity style={styles.uploadOptionButton} onPress={handleDocument}>
              <Ionicons name="document-text-outline" size={24} color={Colors.color3C72F2} />
              <Text style={styles.uploadOptionText}>Choose Document</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.uploadOptionButton, { borderBottomWidth: 0 }]} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.error} />
            <Text style={[styles.uploadOptionText, { color: Colors.error }]}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay40,
    justifyContent: 'flex-end',
  },
  uploadModalContainer: {
    backgroundColor: Colors.colorFFF,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: Colors.colorEAEAEA,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorEBEBEB,
  },
  uploadOptionText: {
    fontSize: 16,
    color: Colors.color333,
    marginLeft: 16,
    fontWeight: '500',
  }
});

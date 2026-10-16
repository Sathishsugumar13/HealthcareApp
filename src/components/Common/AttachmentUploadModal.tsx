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
  onUploadSuccess: (fileName: string, uri?: string) => void;
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
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take a picture of your prescription.');
        return;
      }
      onClose();
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        // When taking a photo for prescription, mark as doctor prescription photo
        const fileName = 'Doctor_Prescription_Camera.jpg';
        onUploadSuccess(fileName, uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not open camera.');
    }
  };

  const handleGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery access is needed to select a prescription image.');
        return;
      }
      onClose();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const rawName = asset.fileName || asset.uri.split('/').pop() || 'photo.jpg';
        const isExplicitNonRx = ['non_prescription', 'other_photo', 'sample_photo', 'normal_image', 'scenery', 'wallpaper', 'selfie', 'car', 'dog', 'cat'].some(kw => rawName.toLowerCase().includes(kw));
        const fileName = allowDocument 
          ? (isExplicitNonRx ? rawName : (rawName.toLowerCase().includes('prescription') ? rawName : `Doctor_Prescription_${rawName}`))
          : rawName;
        onUploadSuccess(fileName, asset.uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not open gallery.');
    }
  };

  const handleDocument = async () => {
    try {
      onClose();
      const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name || 'Doctor_Prescription_Document.pdf';
        onUploadSuccess(fileName, asset.uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not select document.');
    }
  };

  const handleSamplePrescription = () => {
    onClose();
    onUploadSuccess('Doctor_Prescription_Apollo_Clinic.jpg', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800');
  };

  const handleSampleNonPrescription = () => {
    onClose();
    onUploadSuccess('Other_Photo_Non_Prescription.jpg', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800');
  };

  const handleSampleBlurryPrescription = () => {
    onClose();
    onUploadSuccess('Blurry_Unreadable_Prescription.jpg', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400');
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.uploadModalContainer} activeOpacity={1} onPress={() => {}}>
          <Text style={styles.uploadModalTitle}>{title}</Text>
          
          <TouchableOpacity style={styles.uploadOptionButton} onPress={handleCamera}>
            <Ionicons name="camera-outline" size={24} color={Colors.color3C72F2} />
            <Text style={styles.uploadOptionText}>{allowDocument ? 'Take Photo of Prescription' : 'Take Photo'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.uploadOptionButton} onPress={handleGallery}>
            <Ionicons name="image-outline" size={24} color={Colors.color3C72F2} />
            <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          {allowDocument && (
            <>
              <TouchableOpacity style={styles.uploadOptionButton} onPress={handleDocument}>
                <Ionicons name="document-text-outline" size={24} color={Colors.color3C72F2} />
                <Text style={styles.uploadOptionText}>Choose Document (PDF/Scan)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadOptionButton} onPress={handleSamplePrescription}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#059669" />
                <Text style={[styles.uploadOptionText, { color: '#059669', fontWeight: '700' }]}>Sample Doctor Prescription (Valid)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadOptionButton} onPress={handleSampleNonPrescription}>
                <Ionicons name="alert-circle-outline" size={24} color="#DC2626" />
                <Text style={[styles.uploadOptionText, { color: '#DC2626', fontWeight: '700' }]}>Sample Non-Prescription Photo (Other Image)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadOptionButton} onPress={handleSampleBlurryPrescription}>
                <Ionicons name="eye-off-outline" size={24} color="#D97706" />
                <Text style={[styles.uploadOptionText, { color: '#D97706', fontWeight: '700' }]}>Sample Blurry / Unreadable Prescription</Text>
              </TouchableOpacity>
            </>
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

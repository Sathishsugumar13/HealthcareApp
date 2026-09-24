import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../Common/BackButton';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// --- Types ---
export interface PharmacyData {
  id: string;
  name: string;
  address: string;
  rating: string;
  distance: string;
  image: any;
  availableTablets: string[];
}

// --- Mock Data ---
const MOCK_PHARMACIES: PharmacyData[] = [
  { 
    id: 'p1', name: 'Apollo Pharmacy', address: '123 Main Street, Salem', rating: '4.8', distance: '1.2 km', 
    image: require('../../../assets/images/hospital_city.jpg'),
    availableTablets: ['Paracetamol', 'Dolo 650', 'Amoxicillin', 'Cetirizine', 'Azithromycin']
  },
  { 
    id: 'p2', name: 'MedPlus', address: '45 Second Avenue, Salem', rating: '4.5', distance: '2.5 km', 
    image: require('../../../assets/images/hospital_sks.jpg'),
    availableTablets: ['Crocin', 'Aspirin', 'Vitamin C', 'Zincovit', 'Pantoprazole']
  },
  { 
    id: 'p3', name: 'Netmeds Pharmacy', address: '78 Third Street, Salem', rating: '4.7', distance: '3.0 km', 
    image: require('../../../assets/images/hospital_city.jpg'),
    availableTablets: ['Ibuprofen', 'Metformin', 'Amlodipine', 'Omeprazole', 'Atorvastatin']
  },
  { 
    id: 'p4', name: 'Wellness Forever', address: '90 Fourth Cross, Salem', rating: '4.9', distance: '4.1 km', 
    image: require('../../../assets/images/hospital_sks.jpg'),
    availableTablets: ['Diclofenac', 'Tramadol', 'Ambroxol', 'B-Complex', 'Liv52']
  },
  { 
    id: 'p5', name: 'Thulasi Pharmacies', address: '112 Fifth Avenue, Salem', rating: '4.6', distance: '1.8 km', 
    image: require('../../../assets/images/hospital_city.jpg'),
    availableTablets: ['Azel', 'Augmentin', 'Allegra', 'Becosules', 'Crocine']
  },
  { 
    id: 'p6', name: 'Sanjivani Pharmacy', address: '33 Sixth Main Road, Salem', rating: '4.4', distance: '5.5 km', 
    image: require('../../../assets/images/hospital_sks.jpg'),
    availableTablets: ['Montair LC', 'Zifi 200', 'Shelcal 500', 'Pan D', 'Thyronorm']
  },
];

export default function PharmacyComponent() {
  const navigation = useNavigation<any>();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyData | null>(null);
  
  // Order states
  const [message, setMessage] = useState('');

  const handleBack = () => {
    if (selectedPharmacy) {
      setSelectedPharmacy(null);
    } else {
      navigation.goBack();
    }
  };

  const handlePharmacyPress = (pharmacy: PharmacyData) => {
    setSelectedPharmacy(pharmacy);
  };

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadType, setUploadType] = useState<'prescription' | 'tablet' | null>(null);

  const handleUploadPrescription = () => {
    setUploadType('prescription');
    setIsUploadModalVisible(true);
  };

  const handleUploadTabletImage = () => {
    setUploadType('tablet');
    setIsUploadModalVisible(true);
  };

  const handleBuy = () => {
    Alert.alert('Success', 'Your order has been placed successfully!');
    setMessage('');
    setSelectedPharmacy(null);
  };

  const renderPharmacyItem = ({ item }: { item: PharmacyData }) => (
    <TouchableOpacity style={styles.pharmacyCard} onPress={() => handlePharmacyPress(item)}>
      <View style={styles.pharmacyImageWrapper}>
        <Image source={item.image} style={styles.pharmacyImage} />
        <View style={styles.ratingBadge}>
          <MaterialCommunityIcons name="star" size={12} color="#FFF" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.pharmacyInfo}>
        <View style={styles.pharmacyTitleRow}>
          <Text style={styles.pharmacyName}>{item.name}</Text>
          <View style={styles.distanceBadge}>
            <MaterialCommunityIcons name="map-marker-outline" size={12} color="#3C72F2" />
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
        </View>
        <Text style={styles.pharmacyAddress} numberOfLines={1}>{item.address}</Text>
        
        <View style={styles.pharmacyTabletsPreview}>
          {item.availableTablets.slice(0, 2).map((tablet, idx) => (
             <View key={idx} style={styles.miniTabletPill}>
                <Text style={styles.miniTabletText}>{tablet}</Text>
             </View>
          ))}
          {item.availableTablets.length > 2 && (
             <View style={styles.miniTabletPillMore}>
                <Text style={styles.miniTabletTextMore}>+{item.availableTablets.length - 2}</Text>
             </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>
          {selectedPharmacy ? selectedPharmacy.name : 'Pharmacies'}
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {!selectedPharmacy ? (
          // --- State 1: Pharmacy List ---
          <View style={styles.content}>
            <FlatList
              data={MOCK_PHARMACIES}
              keyExtractor={(item) => item.id}
              renderItem={renderPharmacyItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        ) : (
          // --- State 2: Pharmacy Details & Order ---
          <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            {/* Contact Buttons */}
            <View style={styles.contactButtonsRow}>
              <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#E8F0FE', borderColor: '#E8F0FE', marginRight: 6 }]} onPress={() => navigation.navigate('Chat', { recipientName: selectedPharmacy.name })}>
                <MaterialCommunityIcons name="message-processing-outline" size={20} color="#1A73E8" />
                <Text style={[styles.contactButtonText, { color: '#1A73E8' }]}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#E6F4EA', borderColor: '#E6F4EA', marginLeft: 6 }]} onPress={() => Alert.alert('Calling', `Dialing ${selectedPharmacy.name}...`)}>
                <MaterialCommunityIcons name="phone-in-talk-outline" size={20} color="#137333" />
                <Text style={[styles.contactButtonText, { color: '#137333' }]}>Call</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="pill" size={22} color="#3C72F2" />
              <Text style={styles.sectionTitle}>Available Tablets</Text>
            </View>
            
            <View style={styles.tabletsContainer}>
              {selectedPharmacy.availableTablets.map((tablet, index) => (
                <View key={index} style={styles.tabletPill}>
                  <Text style={styles.tabletText}>{tablet}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clipboard-edit-outline" size={22} color="#3C72F2" />
              <Text style={styles.sectionTitle}>Order Medicines</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type tablet names or describe your health issue..."
                placeholderTextColor="#A0AAB5"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: '#FFF5EB', borderColor: '#FFD6B3' }]} onPress={handleUploadPrescription}>
                <View style={[styles.uploadIconWrapper, { backgroundColor: '#FFE4CC' }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color="#FF7A00" />
                </View>
                <Text style={styles.uploadButtonTitle}>Prescription</Text>
                <Text style={styles.uploadButtonSub}>Tap to upload</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]} onPress={handleUploadTabletImage}>
                <View style={[styles.uploadIconWrapper, { backgroundColor: '#DCFCE7' }]}>
                  <MaterialCommunityIcons name="camera-outline" size={24} color="#16A34A" />
                </View>
                <Text style={styles.uploadButtonTitle}>Tablet Image</Text>
                <Text style={styles.uploadButtonSub}>Tap to upload</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
              <MaterialCommunityIcons name="cart-outline" size={22} color="#FFF" style={styles.buyIcon} />
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>

          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <Modal visible={isUploadModalVisible} transparent animationType="slide" onRequestClose={() => setIsUploadModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsUploadModalVisible(false)}>
          <TouchableOpacity style={styles.uploadModalContainer} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.uploadModalTitle}>
              {uploadType === 'prescription' ? 'Upload Prescription' : 'Upload Tablet Image'}
            </Text>
            
            <TouchableOpacity style={styles.uploadOptionButton} onPress={async () => {
              setIsUploadModalVisible(false);
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
              });
              if (!result.canceled) {
                Alert.alert('Success', 'Photo attached successfully!');
              }
            }}>
              <MaterialCommunityIcons name="camera-outline" size={24} color="#3C72F2" />
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadOptionButton} onPress={async () => {
              setIsUploadModalVisible(false);
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
              });
              if (!result.canceled) {
                Alert.alert('Success', 'Photo attached successfully!');
              }
            }}>
              <MaterialCommunityIcons name="image-outline" size={24} color="#3C72F2" />
              <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {uploadType === 'prescription' && (
              <TouchableOpacity style={styles.uploadOptionButton} onPress={async () => {
                setIsUploadModalVisible(false);
                const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
                if (!result.canceled) {
                  Alert.alert('Success', 'Document attached successfully!');
                }
              }}>
                <MaterialCommunityIcons name="file-document-outline" size={24} color="#3C72F2" />
                <Text style={styles.uploadOptionText}>Choose Document</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.uploadOptionButton, { borderBottomWidth: 0 }]} onPress={() => setIsUploadModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#FF4D4D" />
              <Text style={[styles.uploadOptionText, { color: '#FF4D4D' }]}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  pharmacyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  pharmacyImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F0F4F8',
    marginRight: 14,
    position: 'relative',
  },
  pharmacyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },
  pharmacyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  pharmacyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pharmacyName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginRight: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F1F8',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    color: '#3C72F2',
    fontWeight: '600',
    marginLeft: 2,
  },
  pharmacyAddress: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  pharmacyTabletsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniTabletPill: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  miniTabletText: {
    fontSize: 10,
    color: '#555',
    fontWeight: '600',
  },
  miniTabletPillMore: {
    backgroundColor: '#E5F1F8',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniTabletTextMore: {
    fontSize: 10,
    color: '#3C72F2',
    fontWeight: '700',
  },
  
  // Details Styles
  detailsContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 8,
  },
  tabletsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tabletPill: {
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabletText: {
    fontSize: 14,
    color: '#3C72F2',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 20,
  },
  inputContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 15,
    color: '#333',
    minHeight: 100,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  uploadButton: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  uploadIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  uploadButtonSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
    textAlign: 'center',
  },
  buyButton: {
    flexDirection: 'row',
    backgroundColor: '#3C72F2',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 50,
  },
  buyIcon: {
    marginRight: 8,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  uploadModalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  uploadOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  }
});

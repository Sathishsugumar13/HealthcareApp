import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePharmacy } from '../../../context/PharmacyContext';
import BackButton from '../../Common/BackButton';
import ContactActionButtons from '../../Common/ContactActionButtons';
import AttachmentUploadModal from '../../Common/AttachmentUploadModal';
import PharmacyListCard from '../../Common/PharmacyListCard';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';



import { MOCK_PHARMACIES, PharmacyData } from '../../../data/mockData';
import { Colors } from '../../../theme/colors';

export default function PharmacyComponent() {
  const navigation = useNavigation<any>();
  const { addOrder } = usePharmacy();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyData | null>(null);
  
  
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
    if (selectedPharmacy) {
      navigation.navigate('PharmacyCheckout', {
        pharmacy: selectedPharmacy,
        message: message
      });
    } else {
      Alert.alert('Error', 'Please select a pharmacy first.');
    }
  };

  const renderPharmacyItem = ({ item }: { item: PharmacyData }) => (
    <PharmacyListCard 
      pharmacy={item} 
      onSelect={(pharmacy) => {
        handlePharmacyPress(pharmacy);
      }} 
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>
          {selectedPharmacy ? selectedPharmacy.name : 'Pharmacies'}
        </Text>
        <View style={styles.spacerWidth48} />
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {!selectedPharmacy ? (
          
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
          
          <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            <ContactActionButtons recipientName={selectedPharmacy.name} />

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="pill" size={22} color={Colors.color3C72F2} />
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
              <MaterialCommunityIcons name="clipboard-edit-outline" size={22} color={Colors.color3C72F2} />
              <Text style={styles.sectionTitle}>Order Medicines</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type tablet names or describe your health issue..."
                placeholderTextColor={Colors.colorA0AAB5}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: Colors.colorFFF5EB, borderColor: Colors.colorFFD6B3 }]} onPress={handleUploadPrescription}>
                <View style={[styles.uploadIconWrapper, { backgroundColor: Colors.colorFFE4CC }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color={Colors.colorFF7A00} />
                </View>
                <Text style={styles.uploadButtonTitle}>Prescription</Text>
                <Text style={styles.uploadButtonSub}>Tap to upload</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: Colors.colorF0FDF4, borderColor: Colors.colorBBF7D0 }]} onPress={handleUploadTabletImage}>
                <View style={[styles.uploadIconWrapper, { backgroundColor: Colors.colorDCFCE7 }]}>
                  <MaterialCommunityIcons name="camera-outline" size={24} color={Colors.color16A34A} />
                </View>
                <Text style={styles.uploadButtonTitle}>Tablet Image</Text>
                <Text style={styles.uploadButtonSub}>Tap to upload</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
              <MaterialCommunityIcons name="cart-outline" size={22} color={Colors.colorFFF} style={styles.buyIcon} />
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>

          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <AttachmentUploadModal 
        isVisible={isUploadModalVisible} 
        onClose={() => setIsUploadModalVisible(false)} 
        title={uploadType === 'prescription' ? 'Upload Prescription' : 'Upload Tablet Image'} 
        onUploadSuccess={() => Alert.alert('Success', 'Attached successfully!')} 
        allowDocument={uploadType === 'prescription'}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  spacerWidth48: { width: 48 },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorF5F5F5,
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
    backgroundColor: Colors.colorFFF,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorE0E0E0,
  },
  backButton: {
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
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
    backgroundColor: Colors.colorFFF,
    padding: 14,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.colorF0F4F8,
  },
  pharmacyImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.colorF0F4F8,
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
    backgroundColor: Colors.colorFFB800,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.colorFFF,
  },
  ratingText: {
    color: Colors.colorFFF,
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
    color: Colors.color2C3E50,
    marginRight: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colorE5F1F8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    color: Colors.color3C72F2,
    fontWeight: '600',
    marginLeft: 2,
  },
  pharmacyAddress: {
    fontSize: 12,
    color: Colors.color888,
    marginBottom: 10,
  },
  pharmacyTabletsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniTabletPill: {
    backgroundColor: Colors.colorF8F9FA,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.colorEBEBEB,
  },
  miniTabletText: {
    fontSize: 10,
    color: Colors.color555,
    fontWeight: '600',
  },
  miniTabletPillMore: {
    backgroundColor: Colors.colorE5F1F8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniTabletTextMore: {
    fontSize: 10,
    color: Colors.color3C72F2,
    fontWeight: '700',
  },
  
  
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
    color: Colors.color2C3E50,
    marginLeft: 8,
  },
  tabletsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tabletPill: {
    backgroundColor: Colors.colorF0F4F8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabletText: {
    fontSize: 14,
    color: Colors.color3C72F2,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.colorEBEBEB,
    marginVertical: 20,
  },
  inputContainer: {
    backgroundColor: Colors.colorF8F9FA,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 15,
    color: Colors.color333,
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
    color: Colors.color333,
    textAlign: 'center',
    marginBottom: 4,
  },
  uploadButtonSub: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.color888,
    textAlign: 'center',
  },
  buyButton: {
    flexDirection: 'row',
    backgroundColor: Colors.color3C72F2,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.color3C72F2,
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
    color: Colors.colorFFF,
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.transparent,
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




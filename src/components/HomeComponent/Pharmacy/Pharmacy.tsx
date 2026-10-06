import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  
  
  const [message, setMessage] = useState('1. ');
  const [selectedTablets, setSelectedTablets] = useState<string[]>([]);
  

  const handleMessageChange = (text: string) => {
    // If text was cleared
    if (text.length === 0) {
      setMessage('1. ');
      return;
    }
    
    // First character typed
    if (message.length === 0 && text.length === 1) {
      setMessage('1. ' + text);
      return;
    }

    // User pressed enter (added a newline)
    if (text.length > message.length && text.endsWith('\n')) {
      const lines = text.split('\n');
      const nextNum = lines.length;
      setMessage(text + nextNum + '. ');
      return;
    }

    setMessage(text);
  };

  const handleBack = () => {
    if (selectedPharmacy) {
      setSelectedPharmacy(null);
      setSelectedTablets([]);
      setMessage('');
      setHasUploadedPrescription(false);
      setHasUploadedTabletImage(false);
    } else {
      navigation.goBack();
    }
  };

  const handleTabletSelect = (tablet: string) => {
    if (selectedTablets.includes(tablet)) {
      setSelectedTablets(selectedTablets.filter(t => t !== tablet));
    } else {
      setSelectedTablets([...selectedTablets, tablet]);
    }
  };

  const handlePharmacyPress = (pharmacy: PharmacyData) => {
    setSelectedPharmacy(pharmacy);
  };

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadType, setUploadType] = useState<'prescription' | 'tablet' | null>(null);
  const [hasUploadedPrescription, setHasUploadedPrescription] = useState(false);
  const [hasUploadedTabletImage, setHasUploadedTabletImage] = useState(false);

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
      if (
        selectedTablets.length === 0 && 
        message.replace(/^\d+\.\s*/g, '').trim() === '' && 
        !hasUploadedPrescription && 
        !hasUploadedTabletImage
      ) {
        Alert.alert(
          'Missing Information', 
          'Please select at least one tablet, or enter medicines, or upload a prescription/image to proceed.'
        );
        return;
      }
      navigation.navigate('Payment', {
        pharmacy: selectedPharmacy,
        message: message,
        selectedTablets: selectedTablets
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
            
            
            <View style={{ backgroundColor: Colors.white, padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F5FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="location-outline" size={20} color={Colors.color3C72F2} />
                </View>
                <Text style={{ fontSize: 14, color: Colors.color555, flex: 1, lineHeight: 20 }}>{selectedPharmacy.address} ({selectedPharmacy.distance})</Text>
              </View>

              {selectedPharmacy.phone && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F5FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Ionicons name="call-outline" size={20} color={Colors.color3C72F2} />
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.color333 }}>{selectedPharmacy.phone}</Text>
                </View>
              )}
            </View>

            <ContactActionButtons recipientName={selectedPharmacy.name} phoneNumber={selectedPharmacy.phone} hideVideo={true} />

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Ionicons name="medkit-outline" size={22} color={Colors.color3C72F2} />
              <Text style={styles.sectionTitle}>Available Tablets</Text>
            </View>
            
            <View style={styles.tabletsContainer}>
              {selectedPharmacy.availableTablets.map((tablet, index) => (
                
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.tabletPill, 
                    selectedTablets.includes(tablet) && styles.tabletPillSelected
                  ]}
                  onPress={() => handleTabletSelect(tablet)}
                  activeOpacity={0.7}
                  >
                    {(() => {
                      const price = 120 + (tablet.length * 10);
                      return (
                        <Text style={[
                          styles.tabletText,
                          selectedTablets.includes(tablet) && styles.tabletTextSelected
                        ]}>
                          {tablet} (₹{price})
                        </Text>
                      );
                    })()}
                  </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={22} color={Colors.color3C72F2} />
              <Text style={styles.sectionTitle}>Order Medicines</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type tablet names or describe your health issue..."
                placeholderTextColor={Colors.colorA0AAB5}
                value={message}
                onChangeText={handleMessageChange}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: Colors.colorFFF5EB, borderColor: '#D1D5DB' }]} onPress={handleUploadPrescription}>
                <View style={[styles.uploadIconWrapper, { backgroundColor: Colors.colorFFE4CC }]}>
                  <Ionicons name="document-text-outline" size={24} color={Colors.colorFF7A00} />
                </View>
                <Text style={styles.uploadButtonTitle}>Prescription</Text>
                <Text style={styles.uploadButtonSub}>Tap to upload</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: Colors.colorF0FDF4, borderColor: '#D1D5DB' }]} onPress={handleUploadTabletImage}>
                <View style={[styles.uploadIconWrapper, { backgroundColor: Colors.colorDCFCE7 }]}>
                  <Ionicons name="camera-outline" size={24} color={Colors.color16A34A} />
                </View>
                <Text style={styles.uploadButtonTitle}>Tablet Image</Text>
                <Text style={styles.uploadButtonSub}>Tap to upload</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
              <Ionicons name="cart-outline" size={22} color={Colors.colorFFF} style={styles.buyIcon} />
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>

          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <AttachmentUploadModal 
        isVisible={isUploadModalVisible} 
        onClose={() => setIsUploadModalVisible(false)} 
        title={uploadType === 'prescription' ? 'Upload Prescription' : 'Upload Tablet Image'} 
        onUploadSuccess={() => {
          if (uploadType === 'prescription') setHasUploadedPrescription(true);
          else if (uploadType === 'tablet') setHasUploadedTabletImage(true);
          Alert.alert('Success', 'Attached successfully!');
        }} 
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
      borderWidth: 1,
      borderColor: '#E5E7EB', // clear border
      shadowColor: Colors.color000,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    tabletPillSelected: {
      backgroundColor: '#EBF4FF',
      borderColor: Colors.color3C72F2,
      borderWidth: 1,
    },
    tabletTextSelected: {
      color: Colors.color3C72F2,
      fontWeight: '700',
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
      backgroundColor: Colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#D1D5DB', // slightly darker so it's visible
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
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderStyle: 'solid',
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




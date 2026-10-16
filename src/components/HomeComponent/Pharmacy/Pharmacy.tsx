import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../Common/BackButton';
import ContactActionButtons from '../../Common/ContactActionButtons';
import PharmacyListCard from '../../Common/PharmacyListCard';
import SearchBox from '../../Common/SearchBox';

import { MOCK_PHARMACIES, PharmacyData } from '../../../data/mockData';
import { Colors } from '../../../theme/colors';
import { getTabletPrice } from '../../../utils/pricing';

const getTabletImage = (name: string) => {
  const images = [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1550572017-ed2616f7311f?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=200&h=200&fit=crop'
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

export default function PharmacyComponent() {
  const navigation = useNavigation<any>();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyData | null>(null);
  const [selectedTablets, setSelectedTablets] = useState<string[]>([]);
  const [tabletSearch, setTabletSearch] = useState('');

  const handleBack = () => {
    if (selectedPharmacy) {
      setSelectedPharmacy(null);
      setSelectedTablets([]);
      setTabletSearch('');
    } else {
      navigation.goBack();
    }
  };

  const handleTabletAdd = (tablet: string) => {
    setSelectedTablets(prev => [...prev, tablet]);
  };

  const handleTabletRemove = (tablet: string) => {
    const index = selectedTablets.indexOf(tablet);
    if (index > -1) {
      const newTablets = [...selectedTablets];
      newTablets.splice(index, 1);
      setSelectedTablets(newTablets);
    }
  };

  const handlePharmacyPress = (pharmacy: PharmacyData) => {
    setSelectedPharmacy(pharmacy);
  };

  const handleBuy = () => {
    if (selectedPharmacy) {
      if (selectedTablets.length > 0) {
        navigation.navigate('Payment', {
          pharmacy: selectedPharmacy,
          selectedTablets: selectedTablets,
        });
        return;
      }

      Alert.alert(
        'Missing Information',
        'Please select at least one tablet from the available list to proceed.'
      );
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
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
          
          <ScrollView 
            style={styles.detailsContent} 
            contentContainerStyle={styles.detailsContentContainer}
            showsVerticalScrollIndicator={false} 
          >
            
            
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

            {/* Search box for Available Tablets */}
            <SearchBox
              value={tabletSearch}
              onChangeText={setTabletSearch}
              placeholder="Search tablets..."
              style={styles.tabletSearchBox}
            />
            
            <View style={styles.tabletsContainer}>
              {selectedPharmacy.availableTablets.filter(tablet =>
                tablet.toLowerCase().includes(tabletSearch.toLowerCase())
              ).length === 0 && tabletSearch.length > 0 ? (
                <View style={styles.noSearchResult}>
                  <Ionicons name="alert-circle-outline" size={28} color={Colors.colorA0AAB5} />
                  <Text style={styles.noSearchResultText}>No tablets found for "{tabletSearch}"</Text>
                </View>
              ) : null}
              {selectedPharmacy.availableTablets.filter(tablet =>
                tablet.toLowerCase().includes(tabletSearch.toLowerCase())
              ).map((tablet, index) => {
                const qty = selectedTablets.filter(t => t === tablet).length;
                const price = getTabletPrice(tablet);
                
                return (
                  <View 
                    key={index} 
                    style={[
                      styles.premiumCard, 
                      qty > 0 && styles.premiumCardSelected,
                      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 }
                    ]}
                  >
                    <View style={[styles.premiumIconWrap, qty > 0 && styles.premiumIconWrapSelected, { marginRight: 12, marginBottom: 0 }]}>
                      <Image source={{ uri: getTabletImage(tablet) }} style={{ width: 52, height: 52, borderRadius: 16 }} />
                    </View>
                    
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={[styles.premiumName, qty > 0 && styles.premiumNameSelected, { marginBottom: 4, fontSize: 16 }]} numberOfLines={1}>{tablet}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.premiumPrice, qty > 0 && styles.premiumPriceSelected, { fontSize: 16 }]}>₹{price}</Text>
                        <Text style={[styles.premiumPerStrip, { marginTop: 0, marginLeft: 4 }]}>/strip</Text>
                      </View>
                    </View>
                    
                    <View style={[styles.actionContainer, { minWidth: 80, alignItems: 'flex-end' }]}>
                      {qty === 0 ? (
                        <TouchableOpacity 
                          style={[styles.premiumAddBtn, { paddingHorizontal: 16, paddingVertical: 8 }]}
                          onPress={() => handleTabletAdd(tablet)}
                        >
                          <Text style={styles.premiumAddBtnText}>+ ADD</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.premiumCounterBox}>
                          <TouchableOpacity 
                            style={styles.premiumCounterBtn}
                            onPress={() => handleTabletRemove(tablet)}
                          >
                            <Text style={styles.premiumCounterIconText}>-</Text>
                          </TouchableOpacity>
                          <View style={styles.premiumQtyBox}>
                            <Text style={styles.premiumQtyText}>{qty}</Text>
                          </View>
                          <TouchableOpacity 
                            style={styles.premiumCounterBtn}
                            onPress={() => handleTabletAdd(tablet)}
                          >
                            <Text style={styles.premiumCounterIconText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>




            <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
              <Ionicons name="cart-outline" size={22} color={Colors.colorFFF} style={styles.buyIcon} />
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>

          </ScrollView>
        )}
      </KeyboardAvoidingView>


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
  detailsContentContainer: {
    paddingBottom: 40,
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
  tabletSearchBox: {
    marginBottom: 14,
  },
  tabletsContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    width: '100%',
  },
  noSearchResult: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  noSearchResultText: {
    fontSize: 14,
    color: Colors.colorA0AAB5,
    marginTop: 6,
    textAlign: 'center',
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
    marginBottom: 16,
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
    marginBottom: 0,
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
  },
  tabletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  tabletCardSelected: {
    borderColor: Colors.color3C72F2,
    backgroundColor: '#F0F5FF',
  },
  tabletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tabletIconContainerSelected: {
    backgroundColor: Colors.color3C72F2,
  },
  tabletInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  tabletName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.color333,
    marginBottom: 4,
  },
  tabletNameSelected: {
    color: Colors.color3C72F2,
  },
  tabletPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.color666,
  },
  tabletPriceSelected: {
    color: Colors.color3C72F2,
  },
  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.color3C72F2,
  },
  addButtonText: {
    color: Colors.color3C72F2,
    fontWeight: 'bold',
    fontSize: 14,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.color3C72F2,
  },
  counterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  counterBtnText: {
    color: Colors.color3C72F2,
    fontWeight: 'bold',
    fontSize: 16,
  },
  counterQtyText: {
    paddingHorizontal: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.color3C72F2,
  },
  premiumCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  premiumCardSelected: {
    borderColor: Colors.color3C72F2,
    backgroundColor: '#F8FAFC',
  },
  premiumCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  premiumIconWrapSelected: {
    backgroundColor: Colors.color3C72F2,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  premiumNameSelected: {
    color: Colors.color3C72F2,
  },
  premiumStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  stockDotSeparator: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 6,
  },
  premiumPriceWrap: {
    alignItems: 'flex-end',
  },
  premiumPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  premiumPriceSelected: {
    color: Colors.color3C72F2,
  },
  premiumPerStrip: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 2,
  },
  premiumCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  premiumBrandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumBrandText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    marginLeft: 4,
  },
  premiumAddBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.color3C72F2,
    borderRadius: 12,
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumAddBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  premiumCounterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  premiumCounterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.color3C72F2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  premiumQtyBox: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumQtyText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  premiumInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  premiumRowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  premiumCounterIconText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
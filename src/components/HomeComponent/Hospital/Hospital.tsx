import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../Common/BackButton';
import HospitalCard from '../../Common/HospitalCard';

// --- Types ---
export interface StateData {
  id: string;
  name: string;
  icon: string;
}

export interface DistrictData {
  id: string;
  name: string;
  stateId: string;
}

export interface HospitalData {
  id: string;
  name: string;
  address: string;
  rating: string;
  districtId: string;
  image: any;
  doctors: string[];
}

// --- Mock Data ---
const MOCK_STATES: StateData[] = [
  { id: 's1', name: 'Tamil Nadu', icon: 'map-outline' },
  { id: 's2', name: 'Kerala', icon: 'map-outline' },
  { id: 's3', name: 'Karnataka', icon: 'map-outline' },
  { id: 's4', name: 'Andhra Pradesh', icon: 'map-outline' },
  { id: 's5', name: 'Maharashtra', icon: 'map-outline' },
];

const MOCK_DISTRICTS: DistrictData[] = [
  { id: 'd1', name: 'Salem', stateId: 's1' },
  { id: 'd2', name: 'Chennai', stateId: 's1' },
  { id: 'd3', name: 'Coimbatore', stateId: 's1' },
  { id: 'd4', name: 'Kochi', stateId: 's2' },
  { id: 'd5', name: 'Trivandrum', stateId: 's2' },
  { id: 'd6', name: 'Bangalore', stateId: 's3' },
  { id: 'd7', name: 'Mysore', stateId: 's3' },
  { id: 'd8', name: 'Visakhapatnam', stateId: 's4' },
  { id: 'd9', name: 'Vijayawada', stateId: 's4' },
  { id: 'd10', name: 'Mumbai', stateId: 's5' },
  { id: 'd11', name: 'Pune', stateId: 's5' },
];

const MOCK_HOSPITALS: HospitalData[] = [
  { id: 'h1', name: 'City Hospital', address: 'Main Road, Salem', rating: '4.5', districtId: 'd1', image: require('../../../assets/images/hospital_city.jpg'), doctors: [{ id: 'd1', name: 'Dr. John Doe', spId: 'sp1', specialization: 'Cardiologist' }, { id: 'd2', name: 'Dr. Sarah Smith', spId: 'sp2', specialization: 'Dentist' }] },
  { id: 'h2', name: 'SKS Hospital', address: '2nd Avenue, Salem', rating: '4.8', districtId: 'd1', image: require('../../../assets/images/hospital_sks.jpg'), doctors: [{ id: 'd3', name: 'Dr. Mike Johnson', spId: 'sp3', specialization: 'Neurologist' }, { id: 'd4', name: 'Dr. Emily Rose', spId: 'sp4', specialization: 'Orthopedist' }] },
  { id: 'h3', name: 'Apollo Main', address: 'Greams Road, Chennai', rating: '4.9', districtId: 'd2', image: require('../../../assets/images/hospital_city.jpg'), doctors: [{ id: 'd5', name: 'Dr. Mark Ruffalo', spId: 'sp5', specialization: 'Pediatrician' }] },
  { id: 'h4', name: 'Fortis Hospital', address: 'Bannerghatta Road, Bangalore', rating: '4.7', districtId: 'd6', image: require('../../../assets/images/hospital_sks.jpg'), doctors: [{ id: 'd6', name: 'Dr. Alice Brown', spId: 'sp1', specialization: 'Cardiologist' }, { id: 'd7', name: 'Dr. Charlie Clark', spId: 'sp2', specialization: 'Dentist' }] },
  { id: 'h5', name: 'PSG Hospitals', address: 'Peelamedu, Coimbatore', rating: '4.6', districtId: 'd3', image: require('../../../assets/images/hospital_city.jpg'), doctors: [{ id: 'd8', name: 'Dr. Peter Parker', spId: 'sp3', specialization: 'Neurologist' }] },
  { id: 'h6', name: 'Aster Medcity', address: 'Cheranallur, Kochi', rating: '4.9', districtId: 'd4', image: require('../../../assets/images/hospital_sks.jpg'), doctors: [{ id: 'd9', name: 'Dr. Bruce Wayne', spId: 'sp4', specialization: 'Orthopedist' }, { id: 'd10', name: 'Dr. Clark Kent', spId: 'sp5', specialization: 'Pediatrician' }] },
  { id: 'h7', name: 'KIMS Hospital', address: 'Anayara, Trivandrum', rating: '4.8', districtId: 'd5', image: require('../../../assets/images/hospital_city.jpg'), doctors: [{ id: 'd11', name: 'Dr. John Doe', spId: 'sp1', specialization: 'Cardiologist' }] },
  { id: 'h8', name: 'Columbia Asia', address: 'Mysore Road, Mysore', rating: '4.4', districtId: 'd7', image: require('../../../assets/images/hospital_sks.jpg'), doctors: [{ id: 'd12', name: 'Dr. Sarah Smith', spId: 'sp2', specialization: 'Dentist' }] },
  { id: 'h9', name: 'Care Hospitals', address: 'Ram Nagar, Visakhapatnam', rating: '4.5', districtId: 'd8', image: require('../../../assets/images/hospital_city.jpg'), doctors: [{ id: 'd13', name: 'Dr. Mike Johnson', spId: 'sp3', specialization: 'Neurologist' }] },
  { id: 'h10', name: 'Ramesh Hospitals', address: 'MG Road, Vijayawada', rating: '4.6', districtId: 'd9', image: require('../../../assets/images/hospital_sks.jpg'), doctors: [{ id: 'd14', name: 'Dr. Emily Rose', spId: 'sp4', specialization: 'Orthopedist' }] },
  { id: 'h11', name: 'Lilavati Hospital', address: 'Bandra, Mumbai', rating: '4.8', districtId: 'd10', image: require('../../../assets/images/hospital_city.jpg'), doctors: [{ id: 'd15', name: 'Dr. Alan Walker', spId: 'sp5', specialization: 'Pediatrician' }] },
  { id: 'h12', name: 'Ruby Hall Clinic', address: 'Sassoon Road, Pune', rating: '4.7', districtId: 'd11', image: require('../../../assets/images/hospital_sks.jpg'), doctors: [{ id: 'd16', name: 'Dr. Peter Parker', spId: 'sp1', specialization: 'Cardiologist' }] },
];

export default function HospitalComponent() {
  const navigation = useNavigation<any>();
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);

  const handleBack = () => {
    if (selectedDistrict) {
      setSelectedDistrict(null);
    } else if (selectedState) {
      setSelectedState(null);
    } else {
      navigation.goBack();
    }
  };

  const getHeaderTitle = () => {
    if (selectedDistrict) return selectedDistrict.name + ' Hospitals';
    if (selectedState) return selectedState.name + ' Districts';
    return 'Select State';
  };

  // List renderers
  const renderStateItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.listItemCard} onPress={() => setSelectedState(item)}>
      <View style={styles.listIconWrapper}>
        <MaterialCommunityIcons name={item.icon} size={24} color="#3C72F2" />
      </View>
      <Text style={styles.listItemText}>{item.name}</Text>
      <View style={styles.chevronWrapper}>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#3C72F2" />
      </View>
    </TouchableOpacity>
  );

  const renderDistrictItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.listItemCard} onPress={() => setSelectedDistrict(item)}>
      <View style={styles.listIconWrapper}>
        <MaterialCommunityIcons name="city-variant-outline" size={24} color="#00C473" />
      </View>
      <Text style={styles.listItemText}>{item.name}</Text>
      <View style={styles.chevronWrapper}>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#3C72F2" />
      </View>
    </TouchableOpacity>
  );

  const renderHospitalItem = ({ item }: { item: any }) => (
    <HospitalCard
      name={item.name}
      address={item.address}
      rating={item.rating}
      imageSource={item.image}
      doctors={item.doctors}
      onPress={() => navigation.navigate('HospitalDetails', { hospital: item })}
    />
  );

  let listData: any[] = [];
  let renderItemFunc: any = null;

  if (selectedDistrict) {
    listData = MOCK_HOSPITALS.filter(h => h.districtId === selectedDistrict.id);
    renderItemFunc = renderHospitalItem;
  } else if (selectedState) {
    listData = MOCK_DISTRICTS.filter(d => d.stateId === selectedState.id);
    renderItemFunc = renderDistrictItem;
  } else {
    listData = MOCK_STATES;
    renderItemFunc = renderStateItem;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <View style={{ width: 48 }} />
      </View>
      
      <View style={styles.content}>
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItemFunc}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No data available.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  
  // List Item Styles (States & Districts)
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F4F8',
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  listIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F4F7FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  chevronWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5F1F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

});




import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBox from '../../Common/SearchBox';
import BackButton from '../../Common/BackButton';
import DoctorCard from '../../Common/DoctorCard';
import Dropdown from '../../Common/Dropdown';
import { images } from '../../../assets/images';
import { Colors } from '../../../theme/colors';

export interface Doctor {
  phone?: string;
  id: string;
  name: string;
  specialization: string;
  rating: string;
  experience: string;
  image: any;
}

export interface Specialization { id: string; name: string; icon: string; iconFamily?: 'Ionicons' | 'FontAwesome5'; }


const SPECIALIZATIONS: Specialization[] = [
  { id: '1', name: 'Cardiologist', icon: 'heartbeat', iconFamily: 'FontAwesome5' },
  { id: '2', name: 'Dentist', icon: 'tooth', iconFamily: 'FontAwesome5' },
  { id: '3', name: 'Neurologist', icon: 'brain', iconFamily: 'FontAwesome5' },
  { id: '4', name: 'Orthopedist', icon: 'bone', iconFamily: 'FontAwesome5' },
  { id: '5', name: 'Pediatrician', icon: 'baby', iconFamily: 'FontAwesome5' },
];

export const ALL_DOCTORS: Doctor[] = [
  
  { id: 'd1', name: 'Dr. John Doe', specialization: 'Cardiologist', rating: '4.8', experience: '12 Years', image: images.doctors.doctor2, phone: '+91 9876543201' },
  { id: 'd2', name: 'Dr. Sarah Smith', specialization: 'Cardiologist', rating: '4.9', experience: '15 Years', image: images.doctors.doctor1, phone: '+91 9876543202' },
  { id: 'd3', name: 'Dr. Mike Johnson', specialization: 'Cardiologist', rating: '4.7', experience: '8 Years', image: images.doctors.doctor4b, phone: '+91 9876543203' },
  
  { id: 'd6', name: 'Dr. Alice Brown', specialization: 'Dentist', rating: '4.5', experience: '5 Years', image: images.doctors.doctor3, phone: '+91 9876543206' },
  { id: 'd7', name: 'Dr. Charlie Clark', specialization: 'Dentist', rating: '4.8', experience: '12 Years', image: images.doctors.doctor6b, phone: '+91 9876543207' },
  { id: 'd8', name: 'Dr. Emily Rose', specialization: 'Dentist', rating: '4.6', experience: '7 Years', image: images.doctors.doctor5, phone: '+91 9876543208' },
  
  { id: 'd11', name: 'Dr. Peter Parker', specialization: 'Neurologist', rating: '4.9', experience: '9 Years', image: images.doctors.doctor8, phone: '+91 9876543211' },
  { id: 'd11_2', name: 'Dr. Stephen Strange', specialization: 'Neurologist', rating: '4.8', experience: '11 Years', image: images.doctors.doctor9, phone: '+91 9876543212' },
  { id: 'd11_3', name: 'Dr. Charles Xavier', specialization: 'Neurologist', rating: '5.0', experience: '20 Years', image: images.doctors.doctor10b, phone: '+91 9876543213' },
  
  { id: 'd12', name: 'Dr. Bruce Wayne', specialization: 'Orthopedist', rating: '4.8', experience: '14 Years', image: images.doctors.doctor11, phone: '+91 9876543221' },
  { id: 'd12_2', name: 'Dr. Steve Rogers', specialization: 'Orthopedist', rating: '4.7', experience: '10 Years', image: images.doctors.doctor12b, phone: '+91 9876543222' },
  { id: 'd12_3', name: 'Dr. Tony Stark', specialization: 'Orthopedist', rating: '4.9', experience: '15 Years', image: images.doctors.doctor13b, phone: '+91 9876543223' },
  
  { id: 'd13', name: 'Dr. Clark Kent', specialization: 'Pediatrician', rating: '4.9', experience: '6 Years', image: images.doctors.doctor14, phone: '+91 9876543231' },
  { id: 'd13_2', name: 'Dr. Diana Prince', specialization: 'Pediatrician', rating: '4.8', experience: '8 Years', image: images.doctors.doctor7, phone: '+91 9876543232' },
  { id: 'd13_3', name: 'Dr. Barry Allen', specialization: 'Pediatrician', rating: '4.6', experience: '4 Years', image: images.doctors.doctor15, phone: '+91 9876543233' },
];

export default function DoctorsListComponent() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDoctorPress = (item: Doctor) => {
    navigation.navigate('DoctorDetails', { doctor: item });
  };

  
  const filteredDoctors = useMemo(() => {
    return ALL_DOCTORS.filter(doctor => {
      const matchesSearch = 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSpecialization = selectedSpecialization 
        ? doctor.specialization === selectedSpecialization 
        : true;
      
      return matchesSearch && matchesSpecialization;
    });
  }, [searchQuery, selectedSpecialization]);

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <DoctorCard 
      item={item} 
      onPress={handleDoctorPress} 
      onChatPress={(doc) => navigation.navigate('Chat', { recipientName: doc.name })} 
    />
  );

  const dropdownData = [
    { label: 'All', value: null },
    ...SPECIALIZATIONS.map(spec => ({
      label: spec.name,
      value: spec.name,
        icon: spec.icon,
        iconFamily: spec.iconFamily,
    }))
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>All Doctors</Text>
        <View style={styles.spacerWidth48} />
      </View>
      
      <View style={styles.inlinePaddinghorizontal16Margi}>
        <SearchBox 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or specialization..."
          iconFamily="Ionicons"
        />
      </View>

      <View style={styles.inlineMargintop10Marginbottom5}>
        <Dropdown 
          data={dropdownData}
          value={selectedSpecialization}
          onSelect={setSelectedSpecialization}
        />
      </View>

      <View style={styles.content}>
        {filteredDoctors.length > 0 ? (
          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item.id}
            renderItem={renderDoctor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="medkit" size={64} color={Colors.colorCCC} />
            <Text style={styles.emptyText}>No doctors found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  spacerWidth48: { width: 48 },
  inlinePaddinghorizontal16Margi: { paddingHorizontal: 16, marginTop: 10 },
  inlineMargintop10Marginbottom5: { marginTop: 10, marginBottom: 5, zIndex: 1000, elevation: 1000 },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorF5F5F5,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.color888,
    marginTop: 16,
    fontWeight: '500',
  },
  sideButtonPrimaryText: {
    color: Colors.colorFFF,
    fontSize: 12,
    fontWeight: '700',
  }
});




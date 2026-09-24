import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBox from '../../Common/SearchBox';
import BackButton from '../../Common/BackButton';
import DoctorCard from '../../Common/DoctorCard';
import Dropdown from '../../Common/Dropdown';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: string;
  experience: string;
  image: any;
}

export interface Specialization {
  id: string;
  name: string;
  icon: string;
}

// Mock Data
const SPECIALIZATIONS: Specialization[] = [
  { id: '1', name: 'Cardiologist', icon: 'heart-pulse' },
  { id: '2', name: 'Dentist', icon: 'tooth-outline' },
  { id: '3', name: 'Neurologist', icon: 'brain' },
  { id: '4', name: 'Orthopedist', icon: 'bone' },
  { id: '5', name: 'Pediatrician', icon: 'baby-face-outline' },
];

const ALL_DOCTORS: Doctor[] = [
  // Cardiologist
  { id: 'd1', name: 'Dr. John Doe', specialization: 'Cardiologist', rating: '4.8', experience: '12 Years', image: require('../../../assets/images/article_diet.jpg') },
  { id: 'd2', name: 'Dr. Sarah Smith', specialization: 'Cardiologist', rating: '4.9', experience: '15 Years', image: require('../../../assets/images/article_exercise.jpg') },
  { id: 'd3', name: 'Dr. Mike Johnson', specialization: 'Cardiologist', rating: '4.7', experience: '8 Years', image: require('../../../assets/images/article_diet.jpg') },
  // Dentist
  { id: 'd6', name: 'Dr. Alice Brown', specialization: 'Dentist', rating: '4.5', experience: '5 Years', image: require('../../../assets/images/article_exercise.jpg') },
  { id: 'd7', name: 'Dr. Charlie Clark', specialization: 'Dentist', rating: '4.8', experience: '12 Years', image: require('../../../assets/images/article_diet.jpg') },
  { id: 'd8', name: 'Dr. Emily Rose', specialization: 'Dentist', rating: '4.6', experience: '7 Years', image: require('../../../assets/images/article_exercise.jpg') },
  // Neurologist
  { id: 'd11', name: 'Dr. Peter Parker', specialization: 'Neurologist', rating: '4.9', experience: '9 Years', image: require('../../../assets/images/article_exercise.jpg') },
  { id: 'd11_2', name: 'Dr. Stephen Strange', specialization: 'Neurologist', rating: '4.8', experience: '11 Years', image: require('../../../assets/images/article_diet.jpg') },
  { id: 'd11_3', name: 'Dr. Charles Xavier', specialization: 'Neurologist', rating: '5.0', experience: '20 Years', image: require('../../../assets/images/article_exercise.jpg') },
  // Orthopedist
  { id: 'd12', name: 'Dr. Bruce Wayne', specialization: 'Orthopedist', rating: '4.8', experience: '14 Years', image: require('../../../assets/images/article_diet.jpg') },
  { id: 'd12_2', name: 'Dr. Steve Rogers', specialization: 'Orthopedist', rating: '4.7', experience: '10 Years', image: require('../../../assets/images/article_exercise.jpg') },
  { id: 'd12_3', name: 'Dr. Tony Stark', specialization: 'Orthopedist', rating: '4.9', experience: '15 Years', image: require('../../../assets/images/article_diet.jpg') },
  // Pediatrician
  { id: 'd13', name: 'Dr. Clark Kent', specialization: 'Pediatrician', rating: '4.9', experience: '6 Years', image: require('../../../assets/images/article_exercise.jpg') },
  { id: 'd13_2', name: 'Dr. Diana Prince', specialization: 'Pediatrician', rating: '4.8', experience: '8 Years', image: require('../../../assets/images/article_diet.jpg') },
  { id: 'd13_3', name: 'Dr. Barry Allen', specialization: 'Pediatrician', rating: '4.6', experience: '4 Years', image: require('../../../assets/images/article_exercise.jpg') },
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

  // Filter doctors based on search query and selected specialization
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
    }))
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>All Doctors</Text>
        <View style={{ width: 48 }} />
      </View>
      
      <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
        <SearchBox 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or specialization..."
          iconFamily="MaterialCommunityIcons"
        />
      </View>

      <View style={{ marginTop: 10, marginBottom: 5, zIndex: 1000, elevation: 1000 }}>
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
            <MaterialCommunityIcons name="doctor" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No doctors found</Text>
          </View>
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
    fontWeight: '500',
  },
  sideButtonPrimaryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  }
});

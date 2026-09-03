import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SectionHeader from '../../components/Common/SectionHeader/SectionHeader';
import PharmacyCard from '../../components/Common/PharmacyCard/PharmacyCard';
import ArticleCard from '../../components/Common/ArticleCard/ArticleCard';
import HospitalCard from '../../components/Common/HospitalCard/HospitalCard';
import AppointmentCard from '../../components/Common/AppointmentCard/AppointmentCard';
import DailyHealthTipCard from '../../components/Home/DailyHealthTipCard/DailyHealthTipCard';
import HealthBanner from '../../components/Home/HealthBanner';
import HomeHeader from '../../components/Home/HomeHeader';
import ProfileModal from '../../components/Home/ProfileModal';
import SeeAllModal from '../../components/Home/SeeAllModal';
import ServiceCard from '../../components/Home/ServiceCard/ServiceCard';

import UpcomingAppointmentSection from '../../components/Home/Sections/UpcomingAppointmentSection';
import MedicineReminderSection from '../../components/Home/Sections/MedicineReminderSection';
import HealthArticlesSection from '../../components/Home/Sections/HealthArticlesSection';
import DailyHealthTipSection from '../../components/Home/Sections/DailyHealthTipSection';
import NearbyHospitalsSection from '../../components/Home/Sections/NearbyHospitalsSection';

const SERVICES = [
  { title: 'Doctor', icon: 'stethoscope' },
  { title: 'Pharmacy', icon: 'pill' },
  { title: 'Hospital', icon: 'hospital-building' },
  { title: 'Ambulance', icon: 'ambulance' },
];

const ARTICLES = [
  { title: 'Healthy Diet', date: 'Jun 10, 2023', read: '5min read', imageSource: require('../../assets/images/article_diet.jpg') },
  { title: 'Exercise Tips', date: 'Jul 10, 2023', read: '5min read', imageSource: require('../../assets/images/article_exercise.jpg') },
];

const HOSPITALS = [
  { name: 'City Hospital', location: 'Salem', distance: '2.5 km', rating: '4.5', status: 'Open', imageSource: require('../../assets/images/hospital_city.jpg') },
  { name: 'SKS Hospital', location: 'Salem', distance: '3.2 km', rating: '4.3', status: 'Open', imageSource: require('../../assets/images/hospital_sks.jpg') },
];

export default function HomeScreen({ user, onLogout }: { user?: any, onLogout?: () => void }) {
  // State variables
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // When user changes, load their profile image
  useEffect(() => {
    loadProfileImage();
  }, [user]);

  // Function to load profile image from local storage
  const loadProfileImage = async () => {
    if (user?.email) {
      try {
        const image = await AsyncStorage.getItem(`profile_img_${user.email}`);
        if (image) {
          setProfileImage(image);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to save profile image to local storage
  const saveProfileImage = async (uri: string) => {
    if (user?.email) {
      try {
        await AsyncStorage.setItem(`profile_img_${user.email}`, uri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to take a new photo using camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (result.canceled === false) {
      setProfileImage(result.assets[0].uri);
      saveProfileImage(result.assets[0].uri);
    }
  };

  // Function to choose a photo from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (result.canceled === false) {
      setProfileImage(result.assets[0].uri);
      saveProfileImage(result.assets[0].uri);
    }
  };

  // Show options to change photo
  const onChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Function to logout user
  const handleLogout = () => {
    setModalVisible(false);
    if (onLogout) {
      onLogout();
    }
  };

  // See All Modal State
  const [listModalVisible, setListModalVisible] = useState(false);
  const [listModalTitle, setListModalTitle] = useState('');
  const [listModalContent, setListModalContent] = useState<any>(null);
  
  // Search text state for the text input
  const [searchText, setSearchText] = useState('');

  // Function to open the See All popup with title
  const openSeeAll = (title: string, content: any) => {
    setListModalTitle(title);
    setListModalContent(content);
    setListModalVisible(true);
  };

  // Function to render different lists inside the See All popup based on title
  const renderSeeAllContent = () => {
    if (listModalTitle === 'Health article') {
      const allArticles = [
        ...ARTICLES,
        { title: 'Importance of Sleep', date: 'Aug 05, 2023', read: '4min read', imageSource: require('../../assets/images/article_sleep.jpg') },
        { title: 'Mental Health Matters', date: 'Sep 01, 2023', read: '6min read', imageSource: require('../../assets/images/article_mental.jpg') },
      ];
      
      return allArticles.map((article, index) => (
        <ArticleCard key={index} title={article.title} date={article.date} read={article.read} imageSource={article.imageSource} />
      ));
    }
    
    if (listModalTitle === 'Nearby Hospitals') {
      const allHospitals = [
        ...HOSPITALS,
        { name: 'Kurunji Hospital', location: 'Salem', distance: '4.1 km', rating: '4.4', status: 'Open', imageSource: require('../../assets/images/hospital_kurunji.jpg') },
        { name: 'Manipal Hospital', location: 'Salem', distance: '5.8 km', rating: '4.7', status: 'Open', imageSource: require('../../assets/images/hospital_manipal.jpg') }
      ];
      
      return allHospitals.map((hospital, index) => (
        <HospitalCard key={index} name={hospital.name} location={hospital.location} distance={hospital.distance} rating={hospital.rating} status={hospital.status} imageSource={hospital.imageSource} />
      ));
    }
    if (listModalTitle === 'Upcoming Appointment') {
      return (
        <>
          <AppointmentCard
            doctorName="Dr. Arun"
            specialization="Cardiologist"
            date="03 Sep"
            time="10:30 AM"
            status="Upcoming"
            imageSource={require('../../assets/images/dr_arun.jpg')}
            containerStyle={{ marginBottom: 16 }}
          />
          <AppointmentCard
            doctorName="Dr. Priya"
            specialization="Dentist"
            date="05 Sep"
            time="02:15 PM"
            status="Confirmed"
            imageSource={require('../../assets/images/dr_priya.jpg')}
            containerStyle={{ marginBottom: 16 }}
          />
          <AppointmentCard
            doctorName="Dr. Kumar"
            specialization="Neurologist"
            date="12 Sep"
            time="04:00 PM"
            status="Upcoming"
            imageSource={require('../../assets/images/dr_kumar.jpg')}
            containerStyle={{ marginBottom: 16 }}
          />
        </>
      );
    }
    if (listModalTitle === 'Medicine Reminder') {
      return (
        <>
          <PharmacyCard medicine="Paracetamol" dosage="500 mg" time="08:00 PM" status="Taken" />
          <PharmacyCard medicine="Vitamin C" dosage="1 Tablet" time="09:00 AM" status="Pending" />
        </>
      );
    }
    if (listModalTitle === 'Daily Health Tip') {
      return (
        <>
          <DailyHealthTipCard 
            tip="Drink enough water and stay hydrated every day." 
            containerStyle={{ marginBottom: 10 }}
          />
          <DailyHealthTipCard 
            tip="Walk for at least 30 minutes to stay active." 
          />
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* See All Modal */}
      <SeeAllModal
        visible={listModalVisible}
        title={listModalTitle}
        onClose={() => setListModalVisible(false)}
      >
        {renderSeeAllContent()}
      </SeeAllModal>

      {/* Profile Modal */}
      <ProfileModal
        visible={modalVisible}
        user={user}
        profileImage={profileImage}
        onClose={() => setModalVisible(false)}
        onChangePhoto={onChangePhoto}
        onLogout={handleLogout}
      />

      {/* Top Blue Section */}
      <HomeHeader
        user={user}
        profileImage={profileImage}
        onProfilePress={() => setModalVisible(true)}
      />

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={24} color="#A0A0A0" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search doctor, drugs, articles..."
              placeholderTextColor="#A0A0A0"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText('')} style={{ padding: 4 }}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#A0A0A0" />
              </Pressable>
            )}
          </View>

          {/* Quick Services */}
          <View style={styles.servicesContainer}>
            {SERVICES.map((service, index) => (
              <ServiceCard key={index} title={service.title} icon={service.icon} />
            ))}
          </View>

          {/* Health Banner */}
          <HealthBanner 
            title="Your Health, Our Priority"
            description="Take care of your health every day."
          />

          {/* Upcoming Appointment */}
          <UpcomingAppointmentSection onSeeAll={() => openSeeAll('Upcoming Appointment', null)} />

          {/* Medicine Reminder */}
          <MedicineReminderSection onSeeAll={() => openSeeAll('Medicine Reminder', null)} />

          {/* Health Articles */}
          <HealthArticlesSection onSeeAll={() => openSeeAll('Health article', null)} articles={ARTICLES} searchText={searchText} />

          {/* Daily Health Tip */}
          <DailyHealthTipSection onSeeAll={() => openSeeAll('Daily Health Tip', null)} />

          {/* Nearby Hospitals */}
          <NearbyHospitalsSection onSeeAll={() => openSeeAll('Nearby Hospitals', null)} hospitals={HOSPITALS} searchText={searchText} />

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E5F1F8', // Light blue background matching image
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, // Overlap the blue section
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  }
});

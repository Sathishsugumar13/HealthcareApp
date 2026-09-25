import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleAppLogout } from '../Logout/logoutHelper';
import { useProfileImage } from '../../hooks/useProfileImage';
import { useAppointment } from '../../context/AppointmentContext';
import SearchBox from '../Common/SearchBox';
import SectionHeader from '../Common/SectionHeader';
import AppointmentCard from '../Common/AppointmentCard';
import PharmacyCard from '../Common/PharmacyCard';
import ArticleCard from '../Common/ArticleCard';
import HospitalCard from '../Common/HospitalCard';

import ProfileModal from './ProfileModal';
import SeeAllModal from './SeeAllModal';
import HomeHeader from './HomeHeader';
import ServiceCategories from './ServiceCategories';
import PromoBanner from './PromoBanner';
import DailyTip from './DailyTip';
import EmergencyButton from './EmergencyButton';

const SERVICES = [
  { title: 'Doctor', icon: 'stethoscope' },
  { title: 'Pharmacy', icon: 'pill' },
  { title: 'Hospital', icon: 'hospital-building' },
  { title: 'Appointments', icon: 'calendar-check' },
];

const ARTICLES = [
  { title: 'Healthy Diet', date: 'Jun 10, 2023', read: '5min read', imageSource: require('../../assets/images/article_diet.jpg') },
  { title: 'Exercise Tips', date: 'Jul 10, 2023', read: '5min read', imageSource: require('../../assets/images/article_exercise.jpg') },
];

const HOSPITALS = [
  { name: 'City Hospital', location: 'Salem', distance: '2.5 km', rating: '4.5', status: 'Open', imageSource: require('../../assets/images/hospital_city.jpg') },
  { name: 'SKS Hospital', location: 'Salem', distance: '3.2 km', rating: '4.3', status: 'Open', imageSource: require('../../assets/images/hospital_sks.jpg') },
];

export default function HomeComponent(props: any) {
  const navigation = useNavigation<any>();
  const { appointments } = useAppointment();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileImageHook = useProfileImage(props.user);

  const [isSeeAllModalOpen, setIsSeeAllModalOpen] = useState(false);
  const [seeAllModalTitle, setSeeAllModalTitle] = useState('');
  const [typedSearchText, setTypedSearchText] = useState('');

  const handleUserLogout = () => {
    setIsProfileModalOpen(false);
    if (props.onLogout) {
      handleAppLogout(props.onLogout);
    }
  };

  const openSeeAllPopup = (titleValue: string) => {
    setSeeAllModalTitle(titleValue);
    setIsSeeAllModalOpen(true);
  };

  const handleServicePress = (service: any) => {
    if (service.title === 'Doctor') {
      navigation.navigate('DoctorsList');
    } else if (service.title === 'Pharmacy') {
      navigation.navigate('Pharmacy');
    } else if (service.title === 'Hospital') {
      navigation.navigate('Hospital');
    } else if (service.title === 'Appointments') {
      navigation.navigate('Appointments');
    }
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* See All Modal */}
      <SeeAllModal 
        isSeeAllModalOpen={isSeeAllModalOpen}
        setIsSeeAllModalOpen={setIsSeeAllModalOpen}
        seeAllModalTitle={seeAllModalTitle}
        appointments={appointments}
        ARTICLES={ARTICLES}
        HOSPITALS={HOSPITALS}
      />

      {/* Profile Modal */}
      <ProfileModal 
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        profileImageHook={profileImageHook}
        user={props.user}
        handleUserLogout={handleUserLogout}
      />

      {/* Home Header */}
      <HomeHeader 
        profileImageHook={profileImageHook}
        user={props.user}
        setIsProfileModalOpen={setIsProfileModalOpen}
      />

      {/* Main Content */}
      <View style={styles.bottomSection}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Search Bar */}
          <SearchBox 
            value={typedSearchText}
            onChangeText={setTypedSearchText}
            placeholder="Search doctor, hospital, etc..."
            style={{ marginBottom: 24 }}
          />

          {/* Services Container */}
          <ServiceCategories 
            SERVICES={SERVICES}
            handleServicePress={handleServicePress}
          />

          {/* Health Banner */}
          <PromoBanner />

          {/* Upcoming Appointment */}
          {appointments.length > 0 && (
            <>
              <SectionHeader title="Upcoming Appointment" onSeeAll={() => openSeeAllPopup('Upcoming Appointment')} />
              <AppointmentCard
                doctorName={appointments[0].doctorName}
                specialization={appointments[0].specialization}
                date={appointments[0].date.split(' at ')[0] || appointments[0].date}
                time={appointments[0].date.split(' at ')[1] || appointments[0].date}
                status="Confirmed"
                imageSource={appointments[0].image || require('../../assets/images/dr_arun.jpg')}
                containerStyle={{ marginBottom: 24 }}
              />
            </>
          )}

          {/* Medicine Reminder */}
          <SectionHeader title="Medicine Reminder" onSeeAll={() => openSeeAllPopup('Medicine Reminder')} />
          <PharmacyCard medicine="Paracetamol" dosage="500 mg" time="08:00 PM" status="Taken" />

          {/* Health Articles */}
          <SectionHeader title="Health article" onSeeAll={() => openSeeAllPopup('Health article')} />
          {ARTICLES.filter(a => a.title.toLowerCase().includes(typedSearchText.toLowerCase())).map((article, index) => (
            <ArticleCard key={index} title={article.title} date={article.date} read={article.read} imageSource={article.imageSource} />
          ))}
          {ARTICLES.filter(a => a.title.toLowerCase().includes(typedSearchText.toLowerCase())).length === 0 && (
             <Text style={styles.listEmptyText}>No articles found.</Text>
          )}

          {/* Daily Health Tip */}
          <SectionHeader title="Daily Health Tip" onSeeAll={() => openSeeAllPopup('Daily Health Tip')} />
          <DailyTip />

          {/* Nearby Hospitals */}
          <SectionHeader title="Nearby Hospitals" onSeeAll={() => openSeeAllPopup('Nearby Hospitals')} />
          <View style={{ paddingBottom: 20 }}>
            {HOSPITALS.filter(h => h.name.toLowerCase().includes(typedSearchText.toLowerCase())).map((hospital, index) => (
              <HospitalCard key={index} name={hospital.name} location={hospital.location} distance={hospital.distance} rating={hospital.rating} status={hospital.status} imageSource={hospital.imageSource} />
            ))}
            {HOSPITALS.filter(h => h.name.toLowerCase().includes(typedSearchText.toLowerCase())).length === 0 && (
               <Text style={styles.listEmptyText}>No hospitals found.</Text>
            )}
          </View>

          {/* Emergency Calling */}
          <SectionHeader title="Emergency Calling" />
          <EmergencyButton />

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E5F1F8',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
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
  listEmptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});



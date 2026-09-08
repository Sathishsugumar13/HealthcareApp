import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import HealthBanner from '../../components/Home/HealthBanner';
import HomeHeader from '../../components/Home/HomeHeader';
import ProfileModal from '../../components/Home/ProfileModal';
import SeeAllModal from '../../components/Home/SeeAllModal';

import UpcomingAppointmentSection from '../../components/Home/Sections/UpcomingAppointmentSection';
import MedicineReminderSection from '../../components/Home/Sections/MedicineReminderSection';
import HealthArticlesSection from '../../components/Home/Sections/HealthArticlesSection';
import DailyHealthTipSection from '../../components/Home/Sections/DailyHealthTipSection';
import NearbyHospitalsSection from '../../components/Home/Sections/NearbyHospitalsSection';

import { useProfileImage } from '../../hooks/useProfileImage';
import SeeAllContentRenderer from '../../components/Home/SeeAllContentRenderer/SeeAllContentRenderer';
import HomeSearchBar from '../../components/Home/HomeSearchBar/HomeSearchBar';
import HomeServicesContainer from '../../components/Home/HomeServicesContainer/HomeServicesContainer';

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

export default function HomeScreen(props: any) {
  // state to track if profile modal is open or closed
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // use our custom hook to get image
  const profileImageHook = useProfileImage(props.user);

  // function when logout is clicked
  const handleUserLogout = () => {
    setIsProfileModalOpen(false);
    if (props.onLogout) {
      props.onLogout();
    }
  };

  // states for the 'See All' lists
  const [isSeeAllModalOpen, setIsSeeAllModalOpen] = useState(false);
  const [seeAllModalTitle, setSeeAllModalTitle] = useState('');
  
  // state for searching text
  const [typedSearchText, setTypedSearchText] = useState('');

  // function to open 'See All' modal with a specific title
  const openSeeAllPopup = (titleValue: string) => {
    setSeeAllModalTitle(titleValue);
    setIsSeeAllModalOpen(true);
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* The See All Popup */}
      <SeeAllModal
        visible={isSeeAllModalOpen}
        title={seeAllModalTitle}
        onClose={() => setIsSeeAllModalOpen(false)}
      >
        <SeeAllContentRenderer 
          title={seeAllModalTitle} 
          articles={ARTICLES} 
          hospitals={HOSPITALS} 
        />
      </SeeAllModal>

      {/* The Profile Options Popup */}
      <ProfileModal
        visible={isProfileModalOpen}
        user={props.user}
        profileImage={profileImageHook.profileImage}
        onClose={() => setIsProfileModalOpen(false)}
        onChangePhoto={profileImageHook.onChangePhoto}
        onLogout={handleUserLogout}
      />

      {/* Blue Header Section */}
      <HomeHeader
        user={props.user}
        profileImage={profileImageHook.profileImage}
        onProfilePress={() => setIsProfileModalOpen(true)}
      />

      {/* Main White Content Section */}
      <View style={styles.bottomSection}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <HomeSearchBar searchText={typedSearchText} setSearchText={setTypedSearchText} />

          <HomeServicesContainer services={SERVICES} />

          <HealthBanner 
            title="Your Health, Our Priority"
            description="Take care of your health every day."
          />

          <UpcomingAppointmentSection onSeeAll={() => openSeeAllPopup('Upcoming Appointment')} />
          <MedicineReminderSection onSeeAll={() => openSeeAllPopup('Medicine Reminder')} />
          <HealthArticlesSection onSeeAll={() => openSeeAllPopup('Health article')} articles={ARTICLES} searchText={typedSearchText} />
          <DailyHealthTipSection onSeeAll={() => openSeeAllPopup('Daily Health Tip')} />
          <NearbyHospitalsSection onSeeAll={() => openSeeAllPopup('Nearby Hospitals')} hospitals={HOSPITALS} searchText={typedSearchText} />

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
});

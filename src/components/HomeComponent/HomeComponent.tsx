import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';

import { handleAppLogout } from '../Logout/logoutHelper';
import { useProfileImage } from '../../hooks/useProfileImage';
import { useAppointment } from '../../context/AppointmentContext';
import SearchBox from '../Common/SearchBox';
import SectionHeader from '../Common/SectionHeader';
import AppointmentCard from '../Common/AppointmentCard';
import PharmacyCard from '../Common/PharmacyCard';
import ArticleCard from '../Common/ArticleCard';
import HospitalCard from '../Common/HospitalCard';
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
      <Modal visible={isSeeAllModalOpen} animationType="slide" transparent={true} onRequestClose={() => setIsSeeAllModalOpen(false)}>
        <View style={styles.seeAllModalOverlay}>
          <View style={styles.seeAllModalContent}>
            <View style={styles.seeAllModalHeader}>
              <Pressable onPress={() => setIsSeeAllModalOpen(false)} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </Pressable>
              <Text style={styles.seeAllModalTitle}>{seeAllModalTitle}</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.seeAllModalBody}>
              {/* Content for See All */}
              {seeAllModalTitle === 'Health article' && (
                <>
                  {ARTICLES.map((article, index) => (
                    <ArticleCard key={index} title={article.title} date={article.date} read={article.read} imageSource={article.imageSource} />
                  ))}
                  <ArticleCard title="Importance of Sleep" date="Aug 05, 2023" read="4min read" imageSource={require('../../assets/images/article_sleep.jpg')} />
                  <ArticleCard title="Mental Health Matters" date="Sep 01, 2023" read="6min read" imageSource={require('../../assets/images/article_mental.jpg')} />
                </>
              )}
              {seeAllModalTitle === 'Nearby Hospitals' && (
                <>
                  {HOSPITALS.map((hospital, index) => (
                    <HospitalCard key={index} name={hospital.name} location={hospital.location} distance={hospital.distance} rating={hospital.rating} status={hospital.status} imageSource={hospital.imageSource} />
                  ))}
                  <HospitalCard name="Kurunji Hospital" location="Salem" distance="4.1 km" rating="4.4" status="Open" imageSource={require('../../assets/images/hospital_kurunji.jpg')} />
                  <HospitalCard name="Manipal Hospital" location="Salem" distance="5.8 km" rating="4.7" status="Open" imageSource={require('../../assets/images/hospital_manipal.jpg')} />
                </>
              )}
              {seeAllModalTitle === 'Upcoming Appointment' && (
                <>
                  {appointments.length > 0 ? (
                    appointments.map(appt => (
                      <AppointmentCard
                        key={appt.id}
                        doctorName={appt.doctorName}
                        specialization={appt.specialization}
                        date={appt.date.split(' at ')[0] || appt.date}
                        time={appt.date.split(' at ')[1] || appt.date}
                        status="Confirmed"
                        imageSource={appt.image || require('../../assets/images/dr_arun.jpg')}
                        containerStyle={{ marginBottom: 16 }}
                      />
                    ))
                  ) : (
                    <Text style={styles.listEmptyText}>No upcoming appointments.</Text>
                  )}
                </>
              )}
              {seeAllModalTitle === 'Medicine Reminder' && (
                <>
                  <PharmacyCard medicine="Paracetamol" dosage="500 mg" time="08:00 PM" status="Taken" />
                  <PharmacyCard medicine="Vitamin C" dosage="1 Tablet" time="09:00 AM" status="Pending" />
                </>
              )}
              {seeAllModalTitle === 'Daily Health Tip' && (
                <>
                  <View style={[styles.dailyTipCard, { marginBottom: 10 }]}>
                    <View style={styles.dailyTipIconContainer}>
                      <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFA500" />
                    </View>
                    <Text style={styles.dailyTipText}>Drink enough water and stay hydrated every day.</Text>
                  </View>
                  <View style={styles.dailyTipCard}>
                    <View style={styles.dailyTipIconContainer}>
                      <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFA500" />
                    </View>
                    <Text style={styles.dailyTipText}>Walk for at least 30 minutes to stay active.</Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal visible={isProfileModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsProfileModalOpen(false)}>
        <View style={styles.profileModalOverlay}>
          <View style={styles.profileModalContent}>
            <View style={styles.profileModalHeader}>
              <Text style={styles.profileModalTitle}>Profile Info</Text>
              <Pressable onPress={() => setIsProfileModalOpen(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <View style={styles.profileModalBody}>
              <Pressable onPress={profileImageHook.onChangePhoto} style={styles.profileModalAvatarContainer}>
                <View style={styles.profileModalAvatar}>
                  {profileImageHook.profileImage ? (
                    <Image source={{ uri: profileImageHook.profileImage }} style={styles.avatarImage} />
                  ) : (
                    <MaterialCommunityIcons name="account" size={50} color={Colors.gray} />
                  )}
                </View>
                <View style={styles.editBadge}>
                  <MaterialCommunityIcons name="camera" size={16} color="#FFF" />
                </View>
              </Pressable>
              <Text style={styles.profileModalNameText}>{props.user?.name || 'User'}</Text>
              <Text style={styles.profileModalEmailText}>{props.user?.email || 'user@example.com'}</Text>
              <Pressable style={styles.logoutButton} onPress={handleUserLogout}>
                <MaterialCommunityIcons name="logout" size={20} color="#FF4D4D" />
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Home Header */}
      <SafeAreaView style={styles.topSection} edges={['top']}>
        <View style={styles.headerContent}>
          <Pressable style={styles.profileImagePlaceholder} onPress={() => setIsProfileModalOpen(true)}>
            {profileImageHook.profileImage ? (
              <Image source={{ uri: profileImageHook.profileImage }} style={styles.smallAvatarImage} />
            ) : (
              <MaterialCommunityIcons name="account" size={30} color={Colors.gray} />
            )}
          </Pressable>
          <Text style={styles.welcomeText}>welcome !</Text>
          <Text style={styles.nameText}>{props.user?.name || 'User'}</Text>
          <Text style={styles.greetingText}>How are you feeling today ?</Text>
        </View>
        <View style={styles.doctorImageWrapper}>
           <Image source={require('../../assets/images/home_doctor.png')} style={styles.largeDoctorImage} />
        </View>
      </SafeAreaView>

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
          <View style={styles.servicesContainer}>
            {SERVICES.map((service, index) => (
              <Pressable key={index} style={styles.serviceCardContainer} onPress={() => handleServicePress(service)}>
                <View style={styles.serviceIconContainer}>
                  <MaterialCommunityIcons name={service.icon} size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.serviceTitle} numberOfLines={1} adjustsFontSizeToFit>{service.title}</Text>
              </Pressable>
            ))}
          </View>

          {/* Health Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Your Health, Our Priority</Text>
              <Text style={styles.bannerDescription}>Take care of your health every day.</Text>
            </View>
            <View style={styles.bannerImageContainer}>
              <MaterialCommunityIcons name="heart-pulse" size={48} color="#FFFFFF" />
            </View>
          </View>

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
          <View style={styles.dailyTipCard}>
            <View style={styles.dailyTipIconContainer}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFA500" />
            </View>
            <Text style={styles.dailyTipText}>Drink enough water and stay hydrated every day.</Text>
          </View>

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
          <View style={styles.emergencyContainer}>
            <Pressable style={styles.emergencyCallButton} onPress={() => Alert.alert('Emergency', 'Calling Ambulance 108...')}>
              <View style={styles.emergencyCallIconCircle}>
                <MaterialCommunityIcons name="phone-in-talk" size={26} color="#FFF" />
              </View>
              <View style={styles.emergencyCallTextWrapper}>
                <Text style={styles.emergencyCallTitle}>Call Ambulance</Text>
                <Text style={styles.emergencyCallSub}>Dial 108 immediately</Text>
              </View>
              <MaterialCommunityIcons name="ambulance" size={28} color="#FFD1D1" style={{ opacity: 0.5 }} />
            </Pressable>
          </View>

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
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  headerContent: {
    flex: 1,
    zIndex: 2,
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D0E3F0',
    overflow: 'hidden',
  },
  smallAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  welcomeText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 14,
    color: '#8CA1B0',
    fontWeight: '500',
  },
  doctorImageWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,
    opacity: 0.9,
  },
  largeDoctorImage: {
    width: 130,
    height: 150,
    resizeMode: 'contain',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  serviceCardContainer: {
    alignItems: 'center',
    width: 80,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3C72F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
  bannerContainer: {
    backgroundColor: '#3C72F2',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    overflow: 'hidden',
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#E5F1F8',
    lineHeight: 20,
  },
  bannerImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  listEmptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  dailyTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7E5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  dailyTipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dailyTipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  seeAllModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  seeAllModalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingBottom: 20,
  },
  seeAllModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 5,
  },
  seeAllModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllModalBody: {
    padding: 20,
  },
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileModalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileModalBody: {
    alignItems: 'center',
    width: '100%',
  },
  profileModalAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileModalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3C72F2',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#3C72F2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileModalNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileModalEmailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE6E6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4D4D',
    marginLeft: 8,
  },
  emergencyContainer: {
    paddingBottom: 40,
  },
  emergencyCallButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyCallIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyCallTextWrapper: {
    flex: 1,
  },
  emergencyCallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  emergencyCallSub: {
    fontSize: 13,
    color: '#FFE4E4',
    fontWeight: '500',
  },
});


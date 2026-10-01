import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfileImage } from '../hooks/useProfileImage';
import { useAppointment } from '../context/AppointmentContext';
import { usePharmacy } from '../context/PharmacyContext';
import SearchBox from '../components/Common/SearchBox';
import SectionHeader from '../components/Common/SectionHeader';
import AppointmentCard from '../components/Common/AppointmentCard';
import PharmacyCard from '../components/Common/PharmacyCard';
import ArticleCard from '../components/Common/ArticleCard';
import HospitalCard from '../components/Common/HospitalCard';
import DoctorCard from '../components/Common/DoctorCard';
import PharmacyListCard from '../components/Common/PharmacyListCard';
import { ALL_DOCTORS } from '../components/HomeComponent/doctorsList/doctorsList';
import { MOCK_PHARMACIES } from '../data/mockData';

import SeeAllModal from '../components/HomeComponent/SeeAllModal';
import HomeHeader from '../components/HomeComponent/HomeHeader';
import ServiceCategories from '../components/HomeComponent/ServiceCategories';
import PromoBanner from '../components/HomeComponent/PromoBanner';
import DailyTip from '../components/HomeComponent/DailyTip';
import EmergencyButton from '../components/HomeComponent/EmergencyButton';
import { images } from '../assets/images';
import { Colors } from '../theme/colors';

import { SERVICES, ARTICLES, HOSPITALS } from '../context/HomeConst';

export default function HomeScreen(props: any) {
  const navigation = useNavigation<any>();
  const { appointments } = useAppointment();
  const upcomingAppointment = appointments.find(appt => appt.paymentStatus !== 'Completed');
  const { orders } = usePharmacy();

  const profileImageHook = useProfileImage(props.user);

  const [isSeeAllModalOpen, setIsSeeAllModalOpen] = useState(false);
  const [seeAllModalTitle, setSeeAllModalTitle] = useState('');
  const [typedSearchText, setTypedSearchText] = useState('');

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
      
      {}
      <SeeAllModal 
        isSeeAllModalOpen={isSeeAllModalOpen}
        setIsSeeAllModalOpen={setIsSeeAllModalOpen}
        seeAllModalTitle={seeAllModalTitle}
        appointments={appointments}
        orders={orders}
        ARTICLES={ARTICLES}
        HOSPITALS={HOSPITALS}
      />

      {}
      <HomeHeader 
        profileImageHook={profileImageHook}
        user={props.user}
      />

      {}
      <View style={styles.bottomSection}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {}
          <SearchBox 
            value={typedSearchText}
            onChangeText={setTypedSearchText}
            placeholder="Search doctor, hospital, etc..."
            style={styles.inlineMarginbottom24}
          />

          {typedSearchText.length > 0 ? (
            <View>
              {ALL_DOCTORS.filter(d => 
                d.name.toLowerCase().includes(typedSearchText.toLowerCase()) || 
                d.specialization.toLowerCase().includes(typedSearchText.toLowerCase())
              ).length > 0 && (
                <>
                  <SectionHeader title="Doctors" />
                  {ALL_DOCTORS.filter(d => 
                    d.name.toLowerCase().includes(typedSearchText.toLowerCase()) || 
                    d.specialization.toLowerCase().includes(typedSearchText.toLowerCase())
                  ).map(doc => (
                    <DoctorCard 
                      key={doc.id} 
                      item={doc} 
                      onPress={(item) => navigation.navigate('DoctorDetails', { doctor: item })}
                      onChatPress={(item) => navigation.navigate('Chat', { recipientName: item.name })}
                    />
                  ))}
                </>
              )}

              {HOSPITALS.filter(h => h.name.toLowerCase().includes(typedSearchText.toLowerCase())).length > 0 && (
                <>
                  <SectionHeader title="Hospitals" />
                  <View style={styles.inlinePaddingbottom20}>
                    {HOSPITALS.filter(h => h.name.toLowerCase().includes(typedSearchText.toLowerCase())).map((hospital, index) => (
                      <HospitalCard key={index} name={hospital.name} location={hospital.location} distance={hospital.distance} rating={hospital.rating} status={hospital.status} imageSource={hospital.imageSource} />
                    ))}
                  </View>
                </>
              )}

              {MOCK_PHARMACIES.filter(p => 
                p.name.toLowerCase().includes(typedSearchText.toLowerCase()) ||
                p.availableTablets.some(t => t.toLowerCase().includes(typedSearchText.toLowerCase()))
              ).length > 0 && (
                <>
                  <SectionHeader title="Pharmacies & Medicines" />
                  {MOCK_PHARMACIES.filter(p => 
                    p.name.toLowerCase().includes(typedSearchText.toLowerCase()) ||
                    p.availableTablets.some(t => t.toLowerCase().includes(typedSearchText.toLowerCase()))
                  ).map(pharmacy => (
                    <PharmacyListCard 
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      onSelect={(p) => navigation.navigate('Pharmacy')} 
                    />
                  ))}
                </>
              )}

              {ARTICLES.filter(a => a.title.toLowerCase().includes(typedSearchText.toLowerCase())).length > 0 && (
                <>
                  <SectionHeader title="Health Articles" />
                  {ARTICLES.filter(a => a.title.toLowerCase().includes(typedSearchText.toLowerCase())).map((article, index) => (
                    <ArticleCard key={index} title={article.title} date={article.date} read={article.read} imageSource={article.imageSource} />
                  ))}
                </>
              )}

              {
                ALL_DOCTORS.filter(d => d.name.toLowerCase().includes(typedSearchText.toLowerCase()) || d.specialization.toLowerCase().includes(typedSearchText.toLowerCase())).length === 0 &&
                HOSPITALS.filter(h => h.name.toLowerCase().includes(typedSearchText.toLowerCase())).length === 0 &&
                MOCK_PHARMACIES.filter(p => p.name.toLowerCase().includes(typedSearchText.toLowerCase()) || p.availableTablets.some(t => t.toLowerCase().includes(typedSearchText.toLowerCase()))).length === 0 &&
                ARTICLES.filter(a => a.title.toLowerCase().includes(typedSearchText.toLowerCase())).length === 0 && (
                  <Text style={styles.listEmptyText}>No results found.</Text>
                )
              }
            </View>
          ) : (
            <>
              {}
              <ServiceCategories 
                SERVICES={SERVICES}
                handleServicePress={handleServicePress}
              />

              {}
              <PromoBanner />

              {}
              {upcomingAppointment && (
                <>
                  <SectionHeader title="Upcoming Appointment" onSeeAll={() => openSeeAllPopup('Upcoming Appointment')} />
                  <AppointmentCard
                    doctorName={upcomingAppointment.doctorName}
                    specialization={upcomingAppointment.specialization}
                    date={upcomingAppointment.date.split(' at ')[0] || upcomingAppointment.date}
                    time={upcomingAppointment.date.split(' at ')[1] || upcomingAppointment.date}
                    status="Confirmed"
                    imageSource={upcomingAppointment.image || images.doctors.drArun}
                    patientName={upcomingAppointment.patientName}
                    phone={upcomingAppointment.phone}
                    paymentMethod={upcomingAppointment.paymentMethod}
                    paymentStatus={upcomingAppointment.paymentStatus}
                    containerStyle={{ marginBottom: 24 }}
                  />
                </>
              )}

              {}
              {orders.length > 0 && (
                <>
                  <SectionHeader title="Pharmacy Orders" onSeeAll={() => openSeeAllPopup('Pharmacy Orders')} />
                  <PharmacyCard 
                    medicine={orders[0].message} 
                    dosage={orders[0].pharmacyName} 
                    time={orders[0].date} 
                    status="Ordered" 
                    patientName={orders[0].patientName}
                    phone={orders[0].phone}
                    address={orders[0].address}
                    paymentMethod={orders[0].paymentMethod}
                    paymentStatus={orders[0].paymentStatus}
                  />
                </>
              )}

              {}
              <SectionHeader title="Health article" onSeeAll={() => openSeeAllPopup('Health article')} />
              {ARTICLES.map((article, index) => (
                <ArticleCard key={index} title={article.title} date={article.date} read={article.read} imageSource={article.imageSource} />
              ))}

              {}
              <SectionHeader title="Daily Health Tip" onSeeAll={() => openSeeAllPopup('Daily Health Tip')} />
              <DailyTip />

              {}
              <SectionHeader title="Nearby Hospitals" onSeeAll={() => openSeeAllPopup('Nearby Hospitals')} />
              <View style={styles.inlinePaddingbottom20}>
                {HOSPITALS.map((hospital, index) => (
                  <HospitalCard key={index} name={hospital.name} location={hospital.location} distance={hospital.distance} rating={hospital.rating} status={hospital.status} imageSource={hospital.imageSource} />
                ))}
              </View>

              {}
              <SectionHeader title="Emergency Calling" />
              <EmergencyButton />
            </>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineMarginbottom24: { marginBottom: 24 },
  inlinePaddingbottom20: { paddingBottom: 20 },

  mainContainer: {
    flex: 1,
    backgroundColor: Colors.colorE5F1F8,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    zIndex: 3,
    shadowColor: Colors.color000,
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
    color: Colors.color666,
    textAlign: 'center',
    marginTop: 40,
  },
});

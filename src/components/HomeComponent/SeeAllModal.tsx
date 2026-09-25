import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArticleCard from '../Common/ArticleCard';
import HospitalCard from '../Common/HospitalCard';
import AppointmentCard from '../Common/AppointmentCard';
import PharmacyCard from '../Common/PharmacyCard';

interface SeeAllModalProps {
  isSeeAllModalOpen: boolean;
  setIsSeeAllModalOpen: (val: boolean) => void;
  seeAllModalTitle: string;
  appointments: any[];
  ARTICLES: any[];
  HOSPITALS: any[];
}

export default function SeeAllModal({
  isSeeAllModalOpen,
  setIsSeeAllModalOpen,
  seeAllModalTitle,
  appointments,
  ARTICLES,
  HOSPITALS,
}: SeeAllModalProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});

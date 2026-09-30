import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../components/Common/BackButton';
import ContactActionButtons from '../components/Common/ContactActionButtons';
import DoctorInfoCard from '../components/Common/DoctorInfoCard';
import { Colors } from '../theme/colors';

export default function DoctorDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const doctor = route.params?.doctor;

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.spacerWidth48} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No Doctor Data found!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{doctor.name}</Text>
        <View style={styles.spacerWidth48} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <DoctorInfoCard doctor={doctor} hideName={true} />

        {}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.sectionText}>
            {doctor.name} is a highly experienced {doctor.specialization} with over {doctor.experience} in the medical field. Dedicated to providing compassionate and comprehensive care to all patients.
          </Text>
        </View>

        {}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          <View style={styles.workingHoursRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.color3C72F2} />
            <Text style={styles.workingHoursText}>Monday - Friday, 09:00 AM - 05:00 PM</Text>
          </View>
        </View>

        {}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Reviews</Text>
          
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAuthor}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>A</Text>
                </View>
                <Text style={styles.reviewName}>Alice Williams</Text>
              </View>
              <View style={styles.reviewRatingBadge}>
                <MaterialCommunityIcons name="star" size={16} color={Colors.colorFFB800} />
                <Text style={styles.reviewRatingText}>5.0</Text>
              </View>
            </View>
            <Text style={styles.sectionText}>
              Very professional and friendly. The consultation was thorough and all my questions were answered patiently.
            </Text>
          </View>
        </View>
        
        {}
        <View style={styles.spacerHeight20} />
      </ScrollView>

      {}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Appointments', { doctor })}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  spacerWidth48: { width: 48 },
  spacerHeight20: { height: 20 },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorF5F5F5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.colorFFF,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorE0E0E0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.colorFFF,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.colorEAEAEA,
  },
  doctorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  doctorInfoText: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 4,
  },
  specializationPill: {
    marginBottom: 6,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: Colors.color666,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: Colors.color555,
    marginLeft: 4,
  },
  statsDivider: {
    height: 1,
    backgroundColor: Colors.colorEAEAEA,
    marginVertical: 16,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.colorCCC,
    backgroundColor: Colors.background,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
    color: Colors.color333,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.color555,
    lineHeight: 22,
  },
  workingHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  workingHoursText: {
    fontSize: 14,
    color: Colors.color333,
    marginLeft: 8,
  },
  reviewItem: {
    marginTop: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.color3C72F2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.colorFFF,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  reviewRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.color333,
    marginLeft: 4,
  },
  footer: {
    backgroundColor: Colors.colorFFF,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.colorE0E0E0,
  },
  bookBtn: {
    backgroundColor: Colors.color007AFF,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookBtnText: {
    color: Colors.colorFFF,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.color888,
  }
});


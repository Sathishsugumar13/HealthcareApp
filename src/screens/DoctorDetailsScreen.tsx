import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../components/Common/BackButton';

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
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No Doctor Data found!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Doctor Details</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Doctor Info Card */}
        <View style={styles.card}>
          <View style={styles.doctorProfileRow}>
            <View style={styles.doctorImageWrapper}>
              <Image source={doctor.image} style={styles.doctorImage} />
            </View>
            <View style={styles.doctorInfoText}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <View style={styles.specializationPill}>
                <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
              </View>
              <View style={styles.ratingRow}>
                <View style={styles.statRow}>
                  <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
                  <Text style={styles.statText}>{doctor.rating}</Text>
                </View>
                <View style={styles.statRow}>
                  <MaterialCommunityIcons name="briefcase-variant-outline" size={14} color="#777" />
                  <Text style={styles.statText}>{doctor.experience}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.statsDivider} />
          
          {/* Contact Buttons */}
          <View style={styles.contactButtonsRow}>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: '#E8F0FE', borderColor: '#E8F0FE', marginRight: 6 }]}
              onPress={() => navigation.navigate('Chat', { recipientName: doctor.name })}
            >
              <MaterialCommunityIcons name="message-processing-outline" size={20} color="#1A73E8" />
              <Text style={[styles.contactButtonText, { color: '#1A73E8' }]}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#E6F4EA', borderColor: '#E6F4EA', marginLeft: 6 }]}>
              <MaterialCommunityIcons name="phone-in-talk-outline" size={20} color="#137333" />
              <Text style={[styles.contactButtonText, { color: '#137333' }]}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.sectionText}>
            {doctor.name} is a highly experienced {doctor.specialization} with over {doctor.experience} in the medical field. Dedicated to providing compassionate and comprehensive care to all patients.
          </Text>
        </View>

        {/* Working Hours Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          <View style={styles.workingHoursRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#3C72F2" />
            <Text style={styles.workingHoursText}>Monday - Friday, 09:00 AM - 05:00 PM</Text>
          </View>
        </View>

        {/* Review Section */}
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
                <MaterialCommunityIcons name="star" size={16} color="#FFB800" />
                <Text style={styles.reviewRatingText}>5.0</Text>
              </View>
            </View>
            <Text style={styles.sectionText}>
              Very professional and friendly. The consultation was thorough and all my questions were answered patiently.
            </Text>
          </View>
        </View>
        
        {/* Extra padding at bottom for scroll */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Appointments', { doctor })}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
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
    color: '#333',
    marginBottom: 4,
  },
  specializationPill: {
    marginBottom: 6,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#666',
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
    color: '#555',
    marginLeft: 4,
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
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
    borderColor: '#CCC',
    backgroundColor: '#FAFAFA',
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  workingHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  workingHoursText: {
    fontSize: 14,
    color: '#333',
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
    backgroundColor: '#3C72F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  reviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#FFF',
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
    color: '#888',
  }
});


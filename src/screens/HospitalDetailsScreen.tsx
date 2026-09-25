import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../components/Common/BackButton';

export default function HospitalDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const hospital = route.params?.hospital;

  if (!hospital) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Error</Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No Hospital Data found!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Hospital Details</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hospital Info Card */}
        <View style={styles.card}>
          <View style={styles.hospitalProfileRow}>
            <View style={styles.hospitalImageWrapper}>
              <Image source={hospital.image} style={styles.hospitalImage} />
            </View>
            <View style={styles.hospitalInfoText}>
              <Text style={styles.hospitalName}>{hospital.name}</Text>
              <View style={styles.addressPill}>
                <Text style={styles.hospitalAddress}>{hospital.address}</Text>
              </View>
              <View style={styles.ratingRow}>
                <View style={styles.statRow}>
                  <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
                  <Text style={styles.statText}>{hospital.rating}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.statsDivider} />
          
          {/* Contact Buttons */}
          <View style={styles.contactButtonsRow}>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#FCE8E8', borderColor: '#FCE8E8', marginRight: 4 }]} onPress={() => Alert.alert('Mail', `Mail sent to ${hospital.name}`)}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#D93025" />
              <Text style={[styles.contactButtonText, { color: '#D93025' }]}>Mail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#E8F0FE', borderColor: '#E8F0FE', marginHorizontal: 4 }]} onPress={() => navigation.navigate('Chat', { recipientName: hospital.name })}>
              <MaterialCommunityIcons name="message-processing-outline" size={20} color="#1A73E8" />
              <Text style={[styles.contactButtonText, { color: '#1A73E8' }]}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#E6F4EA', borderColor: '#E6F4EA', marginLeft: 4 }]} onPress={() => Alert.alert('Calling', `Dialing ${hospital.name}...`)}>
              <MaterialCommunityIcons name="phone-in-talk-outline" size={20} color="#137333" />
              <Text style={[styles.contactButtonText, { color: '#137333' }]}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Doctors Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Available Doctors</Text>
          {hospital.doctors && hospital.doctors.map((doc: any, index: number) => (
            <View key={index} style={{ marginBottom: 12, paddingBottom: 12, borderBottomWidth: index === hospital.doctors.length - 1 ? 0 : 1, borderBottomColor: '#EAEAEA' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{doc.name}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{doc.specialization}</Text>
            </View>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Hospital</Text>
          <Text style={styles.sectionText}>
            {hospital.name} is a leading healthcare provider located at {hospital.address}. We offer state-of-the-art facilities and a team of expert doctors dedicated to providing the best patient care.
          </Text>
        </View>

        {/* Working Hours Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          <View style={styles.workingHoursRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#3C72F2" />
            <Text style={styles.workingHoursText}>24/7 Open</Text>
          </View>
        </View>
        
        {/* Extra padding at bottom for scroll */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Appointments', { hospital })}>
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
  hospitalProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  hospitalInfoText: {
    flex: 1,
    justifyContent: 'center',
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressPill: {
    marginBottom: 6,
  },
  hospitalAddress: {
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
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
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


import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/Common/BackButton';
import { useAppointment } from '../context/AppointmentContext';
import { Colors } from '../theme/colors';

export default function MyAppointmentsScreen() {
  const navigation = useNavigation<any>();
  const { appointments } = useAppointment();

  const parseDateString = (dateStr: string) => {
    const months: any = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    try {
      const parts = dateStr.replace('at ', '').trim().split(' ');
      if (parts.length < 5) return 0;
      const day = parseInt(parts[0], 10);
      const month = months[parts[1]];
      const year = parseInt(parts[2], 10);
      const timeParts = parts[3].split(':');
      let hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const ampm = parts[4];
      
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
  
      return new Date(year, month, day, hours, minutes).getTime();
    } catch (e) {
      return 0;
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = parseDateString(a.date);
    const dateB = parseDateString(b.date);
    return dateB - dateA; // Descending order
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>My Appointments</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Total Appointments Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsIconBox}>
            <Ionicons name="calendar" size={32} color={Colors.white} />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsNumber}>{appointments.length}</Text>
            <Text style={styles.statsLabel}>Total Appointments Attended</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Appointment History</Text>

        {appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={Colors.colorA0AAB5} />
            <Text style={styles.emptyText}>You haven't booked any appointments yet.</Text>
          </View>
        ) : (
          sortedAppointments.map((appt) => (
            <View key={appt.id} style={styles.apptCard}>
              <View style={styles.apptHeader}>
                <View style={styles.doctorInfoRow}>
                  <View style={styles.doctorAvatar}>
                    {appt.image ? (
                      <Image source={typeof appt.image === 'number' ? appt.image : { uri: appt.image }} style={styles.avatarImage} />
                    ) : (
                      <Ionicons name="person" size={24} color={Colors.white} />
                    )}
                  </View>
                  <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>{appt.doctorName}</Text>
                    <Text style={styles.specialization}>{appt.specialization}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, appt.paymentStatus === 'Completed' ? styles.statusCompleted : styles.statusUpcoming]}>
                  <Text style={[styles.statusText, appt.paymentStatus === 'Completed' ? styles.textCompleted : styles.textUpcoming]}>
                    {appt.paymentStatus === 'Completed' ? 'Completed' : 'Upcoming'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.timeRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.color555} />
                <Text style={styles.timeText}>{appt.date}</Text>
              </View>

              <View style={styles.timeRow}>
                <Ionicons name="person-outline" size={18} color={Colors.color555} />
                <Text style={styles.timeText}>Patient: {appt.patientName}</Text>
              </View>

            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.colorF8F9FA },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.color333 },
  content: { flex: 1, padding: 20 },
  
  statsCard: {
    backgroundColor: Colors.color3C72F2,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  statsIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statsTextContainer: { flex: 1 },
  statsNumber: { fontSize: 32, fontWeight: 'bold', color: Colors.white, marginBottom: 4 },
  statsLabel: { fontSize: 14, color: Colors.colorE5F1F8, fontWeight: '500' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.color333, marginBottom: 16 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16, color: Colors.color666 },

  apptCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.color3C72F2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  doctorDetails: { flex: 1, paddingRight: 10 },
  doctorName: { fontSize: 16, fontWeight: '700', color: Colors.color333, marginBottom: 4 },
  specialization: { fontSize: 13, color: Colors.color666 },
  
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusCompleted: { backgroundColor: Colors.colorDCFCE7 },
  statusUpcoming: { backgroundColor: Colors.colorF0F5FF },
  statusText: { fontSize: 12, fontWeight: '600' },
  textCompleted: { color: Colors.color16A34A },
  textUpcoming: { color: Colors.color3C72F2 },

  divider: { height: 1, backgroundColor: Colors.colorEBEBEB, marginVertical: 12 },
  
  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timeText: { fontSize: 14, color: Colors.color555, marginLeft: 8, fontWeight: '500' },
});

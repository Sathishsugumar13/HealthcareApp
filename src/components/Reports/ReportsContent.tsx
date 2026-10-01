import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ReportFile {
  id: string;
  type: 'Lab' | 'Scan' | 'Prescription';
  name: string;
  date: string;
}

interface TreatmentHistory {
  id: string;
  treatmentName: string;
  doctorName: string;
  hospitalName: string;
  startDate: string;
  totalVisits: number;
  status: 'Ongoing' | 'Completed';
  reports: ReportFile[];
}

const TREATMENT_HISTORY: TreatmentHistory[] = [
  {
    id: 't2',
    treatmentName: 'Cardiac Health Checkup',
    doctorName: 'Dr. Sarah Smith',
    hospitalName: 'City Hospital',
    startDate: '12 Sep 2023',
    totalVisits: 2,
    status: 'Ongoing',
    reports: [
      { id: 'r3', type: 'Lab', name: 'Lipid Profile (Blood Test)', date: '10 Sep 2023' },
      { id: 'r4', type: 'Scan', name: 'ECG Report', date: '12 Sep 2023' },
      { id: 'r5', type: 'Prescription', name: 'Cardiac Meds', date: '12 Sep 2023' }
    ]
  },
  {
    id: 't1',
    treatmentName: 'Root Canal Treatment',
    doctorName: 'Dr. Charlie Clark',
    hospitalName: 'Apollo Dental Care',
    startDate: '10 Aug 2023',
    totalVisits: 4,
    status: 'Completed',
    reports: [
      { id: 'r1', type: 'Scan', name: 'Dental X-Ray', date: '10 Aug 2023' },
      { id: 'r2', type: 'Prescription', name: 'Post-Surgery Meds', date: '28 Aug 2023' }
    ]
  },
  {
    id: 't3',
    treatmentName: 'Viral Fever Consultation',
    doctorName: 'Dr. John Doe',
    hospitalName: 'SKS Hospital',
    startDate: '15 Jan 2023',
    totalVisits: 1,
    status: 'Completed',
    reports: [
      { id: 'r6', type: 'Lab', name: 'Complete Blood Count (CBC)', date: '14 Jan 2023' },
      { id: 'r7', type: 'Prescription', name: 'Fever Meds', date: '15 Jan 2023' }
    ]
  }
];

export default function ReportsContent() {

  const handleDownload = async (reportName: string) => {
    try {
      // 1. Create a dummy file to represent the report
      const fileName = reportName.replace(/[^a-zA-Z0-9]/g, '_') + '.txt';
      const fileUri = FileSystem.documentDirectory + fileName;
      
      const fileContent = `=========================================
APOLLO PHARMACY & HOSPITAL
=========================================
MEDICAL REPORT

Report Name: ${reportName}
Date: ${new Date().toLocaleDateString()}
Patient Name: Logged In User

This is a securely generated medical report.
(This is a sample document for demonstration)
=========================================`;
      
      // 2. Write content to device storage
      await FileSystem.writeAsStringAsync(fileUri, fileContent, {
        encoding: 'utf8',
      });

      // 3. Open the native Share/Save dialog
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Save Report As',
        });
      } else {
        Alert.alert('Success', `${reportName} downloaded internally (Sharing not supported on this device/simulator).`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to download report.');
    }
  };

  const getReportIcon = (type: string) => {
    switch(type) {
      case 'Lab': return <FontAwesome5 name="flask" size={16} color={Colors.color3C72F2} />;
      case 'Scan': return <MaterialCommunityIcons name="radiology-box-outline" size={18} color={Colors.color00C473} />;
      case 'Prescription': return <MaterialCommunityIcons name="pill" size={18} color={Colors.colorEF4444} />;
      default: return <Ionicons name="document-text-outline" size={18} color={Colors.color555} />;
    }
  };

  return (
    <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
      
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Medical History & Reports</Text>
        <Text style={styles.headerSub}>Track your treatments, visits, and test reports.</Text>
      </View>

      <View style={styles.timelineContainer}>
        {TREATMENT_HISTORY.map((item) => (
          <View key={item.id} style={styles.treatmentCard}>
            
            {/* Header: Treatment Name & Status */}
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Ionicons name="medical" size={20} color={Colors.color3C72F2} style={styles.iconMargin} />
                <Text style={styles.treatmentTitle} numberOfLines={1}>{item.treatmentName}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'Ongoing' ? styles.statusOngoing : styles.statusCompleted]}>
                <Text style={[styles.statusText, item.status === 'Ongoing' ? styles.statusTextOngoing : styles.statusTextCompleted]}>
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Doctor & Details */}
            <View style={styles.detailsRow}>
              <Ionicons name="person-outline" size={15} color={Colors.color666} />
              <Text style={styles.detailsText}>{item.doctorName}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Ionicons name="business-outline" size={15} color={Colors.color666} />
              <Text style={styles.detailsText}>{item.hospitalName}</Text>
            </View>

            <View style={styles.detailsRow}>
              <Ionicons name="calendar-outline" size={15} color={Colors.color666} />
              <Text style={styles.detailsText}>Started: {item.startDate}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Ionicons name="repeat-outline" size={15} color={Colors.color666} />
              <Text style={styles.detailsText}>{item.totalVisits} Visit{item.totalVisits > 1 ? 's' : ''}</Text>
            </View>

            <View style={styles.divider} />

            {/* Reports Section */}
            <Text style={styles.reportsTitle}>Attached Reports</Text>
            {item.reports.map((report) => (
              <TouchableOpacity key={report.id} style={styles.reportFileBox} onPress={() => handleDownload(report.name)}>
                <View style={styles.reportFileIconBox}>
                  {getReportIcon(report.type)}
                </View>
                <View style={styles.reportFileDetails}>
                  <Text style={styles.reportFileName}>{report.name}</Text>
                  <Text style={styles.reportFileDate}>{report.date}  •  {report.type}</Text>
                </View>
                <View style={styles.downloadCircle}>
                  <Ionicons name="download-outline" size={18} color={Colors.color3C72F2} />
                </View>
              </TouchableOpacity>
            ))}

          </View>
        ))}
      </View>

      <View style={styles.spacerHeight40}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.colorF8F9FA,
  },
  headerBox: {
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 14,
    color: Colors.color666,
  },
  timelineContainer: {
    paddingBottom: 20,
  },
  treatmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconMargin: {
    marginRight: 8,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.color333,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOngoing: {
    backgroundColor: Colors.colorF0F5FF,
  },
  statusCompleted: {
    backgroundColor: Colors.colorDCFCE7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextOngoing: {
    color: Colors.color3C72F2,
  },
  statusTextCompleted: {
    color: Colors.color16A34A,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 13,
    color: Colors.color555,
    marginLeft: 6,
    fontWeight: '500',
  },
  dotSeparator: {
    marginHorizontal: 8,
    color: Colors.colorAAA,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.colorEBEBEB,
    marginVertical: 14,
  },
  reportsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.color333,
    marginBottom: 12,
  },
  reportFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colorF8F9FA,
    borderWidth: 1,
    borderColor: Colors.colorEBEBEB,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reportFileIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.colorE0E0E0,
  },
  reportFileDetails: {
    flex: 1,
  },
  reportFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.color333,
    marginBottom: 4,
  },
  reportFileDate: {
    fontSize: 12,
    color: Colors.color777,
  },
  downloadCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.colorF0F5FF,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacerHeight40: {
    height: 40,
  }
});

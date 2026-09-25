import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppointment } from '../../../context/AppointmentContext';
import BackButton from '../../Common/BackButton';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// --- Mock Data ---
let SPECIALIZATIONS = [
  { id: 'sp1', name: 'Cardiologist' },
  { id: 'sp2', name: 'Dentist' },
  { id: 'sp3', name: 'Neurologist' },
  { id: 'sp4', name: 'Orthopedist' },
  { id: 'sp5', name: 'Pediatrician' },
];

let DOCTORS = [
  // Cardiologist
  { id: 'd1', name: 'Dr. John Doe', spId: 'sp1' },
  { id: 'd2', name: 'Dr. Sarah Smith', spId: 'sp1' },
  { id: 'd3', name: 'Dr. Mike Johnson', spId: 'sp1' },
  // Dentist
  { id: 'd6', name: 'Dr. Alice Brown', spId: 'sp2' },
  { id: 'd7', name: 'Dr. Charlie Clark', spId: 'sp2' },
  { id: 'd8', name: 'Dr. Emily Rose', spId: 'sp2' },
  // Neurologist
  { id: 'd11', name: 'Dr. Peter Parker', spId: 'sp3' },
  { id: 'd11_2', name: 'Dr. Stephen Strange', spId: 'sp3' },
  { id: 'd11_3', name: 'Dr. Charles Xavier', spId: 'sp3' },
  // Orthopedist
  { id: 'd12', name: 'Dr. Bruce Wayne', spId: 'sp4' },
  { id: 'd12_2', name: 'Dr. Steve Rogers', spId: 'sp4' },
  { id: 'd12_3', name: 'Dr. Tony Stark', spId: 'sp4' },
  // Pediatrician
  { id: 'd13', name: 'Dr. Clark Kent', spId: 'sp5' },
  { id: 'd13_2', name: 'Dr. Diana Prince', spId: 'sp5' },
  { id: 'd13_3', name: 'Dr. Barry Allen', spId: 'sp5' },
];

const STATES = [
  { id: 's1', name: 'Tamil Nadu' },
  { id: 's2', name: 'Kerala' },
  { id: 's3', name: 'Karnataka' },
];

const DISTRICTS = [
  { id: 'dt1', name: 'Salem', stateId: 's1' },
  { id: 'dt2', name: 'Chennai', stateId: 's1' },
  { id: 'dt3', name: 'Coimbatore', stateId: 's1' },
  { id: 'dt4', name: 'Kochi', stateId: 's2' },
  { id: 'dt5', name: 'Bangalore', stateId: 's3' },
];

let HOSPITALS = [
  { id: 'h1', name: 'City Hospital', districtId: 'dt1' },
  { id: 'h2', name: 'SKS Hospital', districtId: 'dt1' },
  { id: 'h3', name: 'Apollo Main', districtId: 'dt2' },
  { id: 'h4', name: 'PSG Hospitals', districtId: 'dt3' },
  { id: 'h5', name: 'Aster Medcity', districtId: 'dt4' },
  { id: 'h6', name: 'Fortis Hospital', districtId: 'dt5' },
];

export default function AppointmentsComponent() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addAppointment } = useAppointment();
  
  // Basic Info
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  
  // Appointment Type: 'doctor' | 'hospital'
  const [appointmentType, setAppointmentType] = useState<'doctor' | 'hospital'>('doctor');

  // Doctor Flow States
  const [selectedSpecialization, setSelectedSpecialization] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [consultationMode, setConsultationMode] = useState<'offline' | 'online'>('offline');
  const [isPreFilled, setIsPreFilled] = useState(false);

  // Hospital Flow States
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  // Optional Uploads
  const [oldReports, setOldReports] = useState<string[]>([]);

  useEffect(() => {
    if (route.params?.doctor) {
      const incomingDoctor = route.params.doctor;
      setAppointmentType('doctor');
      setIsPreFilled(true);
      
      let spec = SPECIALIZATIONS.find(s => s.name.toLowerCase() === incomingDoctor.specialization.toLowerCase());
      if (!spec) {
        spec = { id: `sp_custom_${Date.now()}`, name: incomingDoctor.specialization };
        SPECIALIZATIONS.push(spec);
      }
      setSelectedSpecialization(spec);
      
      let doc = DOCTORS.find(d => d.name === incomingDoctor.name);
      if (!doc) {
        doc = { id: incomingDoctor.id, name: incomingDoctor.name, spId: spec.id };
        DOCTORS.push(doc);
      }
      setSelectedDoctor(doc);
    } else if (route.params?.hospital) {
      const incomingHospital = route.params.hospital;
      setAppointmentType('hospital');
      setIsPreFilled(true);

      let dist = DISTRICTS.find(d => d.id === incomingHospital.districtId);
      if (!dist) {
        dist = DISTRICTS[0]; // fallback
      }
      let st = STATES.find(s => s.id === dist.stateId);
      
      setSelectedState(st);
      setSelectedDistrict(dist);

      let hosp = HOSPITALS.find(h => h.id === incomingHospital.id);
      if (!hosp) {
        hosp = { id: incomingHospital.id, name: incomingHospital.name, districtId: dist.id };
        HOSPITALS.push(hosp);
      }
      setSelectedHospital(hosp);
    }
  }, [route.params]);

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  const handleAddOldReport = () => {
    setIsUploadModalVisible(true);
  };

  // Dropdown Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState<any[]>([]);

  // Calendar Modal State
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [tempDate, setTempDate] = useState<number | null>(null);
  const [tempTime, setTempTime] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirmDateTime = () => {
    if (!tempDate) {
      Alert.alert('Error', 'Please select a date.');
      return;
    }
    if (!tempTime) {
      Alert.alert('Error', 'Please select a time.');
      return;
    }
    const dayStr = tempDate < 10 ? `0${tempDate}` : `${tempDate}`;
    setDate(`${dayStr}/10/2023 at ${tempTime}`);
    setIsCalendarVisible(false);
  };

  const handleDateChange = (text: string) => {
    if (text.length < date.length) {
      setDate(text);
      return;
    }

    let digits = text.replace(/\D/g, '');
    let letters = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    let dd = digits.substring(0, 2);
    let mm = digits.substring(2, 4);
    let yyyy = digits.substring(4, 8);
    let hh = digits.substring(8, 10);
    let min = digits.substring(10, 12);

    if (mm.length === 2) {
      let m = parseInt(mm);
      if (m > 12) mm = '12';
      if (m === 0) mm = '01';
    }

    if (dd.length === 2) {
      let d = parseInt(dd);
      if (d === 0) dd = '01';
      
      let maxDays = 31;
      if (mm.length === 2) {
        let m = parseInt(mm);
        if (m === 4 || m === 6 || m === 9 || m === 11) {
          maxDays = 30;
        } else if (m === 2) {
          if (yyyy.length === 4) {
            let y = parseInt(yyyy);
            let isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
            maxDays = isLeap ? 29 : 28;
          } else {
            maxDays = 29;
          }
        }
      }
      if (parseInt(dd) > maxDays) {
        dd = maxDays.toString();
      }
    }

    if (hh.length === 2 && parseInt(hh) > 12) hh = '12';
    if (hh.length === 2 && parseInt(hh) === 0) hh = '12';
    if (min.length === 2 && parseInt(min) > 59) min = '59';

    let formatted = '';
    if (dd.length > 0) formatted += dd;
    if (mm.length > 0) formatted += '/' + mm;
    if (yyyy.length > 0) formatted += '/' + yyyy;
    if (hh.length > 0) formatted += ' at ' + hh;
    if (min.length > 0) formatted += ':' + min;
    
    if (digits.length >= 12) {
      if (letters.includes('P')) formatted += ' PM';
      else if (letters.includes('A')) formatted += ' AM';
      else formatted += ' AM'; 
    }
    
    setDate(formatted);
  };

  const toggleAmPm = () => {
    if (date.includes(' AM')) {
      setDate(date.replace(' AM', ' PM'));
    } else if (date.includes(' PM')) {
      setDate(date.replace(' PM', ' AM'));
    } else {
      // if not complete yet but they tap it
      if (date.length >= 16) { 
        setDate(date + ' PM');
      }
    }
  };

  const openDropdown = (type: string, data: any[]) => {
    setModalType(type);
    setModalData(data);
    setIsModalVisible(true);
  };

  const handleSelectItem = (item: any) => {
    if (modalType === 'specialization') {
      setSelectedSpecialization(item);
      setSelectedDoctor(null); // reset dependent
    } else if (modalType === 'doctor') {
      setSelectedDoctor(item);
    } else if (modalType === 'state') {
      setSelectedState(item);
      setSelectedDistrict(null); // reset dependent
      setSelectedHospital(null); // reset dependent
    } else if (modalType === 'district') {
      setSelectedDistrict(item);
      setSelectedHospital(null); // reset dependent
    } else if (modalType === 'hospital') {
      setSelectedHospital(item);
    }
    setIsModalVisible(false);
  };

  const handleBookAppointment = () => {
    if (!patientName || !phone || !date) {
      Alert.alert('Error', 'Please fill in Name, Phone, and Date.');
      return;
    }
    if (phone.length !== 10) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits.');
      return;
    }
    if (appointmentType === 'doctor' && (!selectedSpecialization || !selectedDoctor)) {
      Alert.alert('Error', 'Please select a Specialization and Doctor.');
      return;
    }
    if (appointmentType === 'hospital' && (!selectedState || !selectedDistrict || !selectedHospital)) {
      Alert.alert('Error', 'Please select State, District, and Hospital.');
      return;
    }

    let successMsg = 'Your appointment has been successfully booked!';
    if (appointmentType === 'doctor') {
      successMsg = `Your ${consultationMode} appointment with ${selectedDoctor.name} has been booked!`;
      
      addAppointment({
        id: `appt_${Date.now()}`,
        patientName,
        doctorName: selectedDoctor.name,
        specialization: selectedSpecialization.name,
        date: date,
        image: route.params?.doctor?.image || null
      });
    } else if (appointmentType === 'hospital') {
      successMsg = `Your appointment at ${selectedHospital.name} has been booked!`;
      
      addAppointment({
        id: `appt_${Date.now()}`,
        patientName,
        doctorName: selectedHospital.name,
        specialization: selectedDistrict.name,
        date: date,
        image: route.params?.hospital?.image || null
      });
    }

    Alert.alert('Success', successMsg);
    
    // Instead of goBack(), navigate to MainTab to see the home screen update
    navigation.navigate('MainTab');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 48 }} />
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-details-outline" size={24} color="#3C72F2" />
            <Text style={styles.sectionTitle}>Patient Information</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#3C72F2" />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Patient Name"
              placeholderTextColor="#A0AAB5"
              value={patientName}
              onChangeText={setPatientName}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#3C72F2" />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Phone Number"
              placeholderTextColor="#A0AAB5"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#3C72F2" />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 12/10/2023 at 10:30 AM"
              placeholderTextColor="#A0AAB5"
              value={date}
              onChangeText={handleDateChange}
              keyboardType="numbers-and-punctuation"
            />
            {date.length >= 15 && (
              <TouchableOpacity onPress={toggleAmPm} style={styles.amPmButton}>
                <Text style={styles.amPmText}>{date.includes(' PM') ? 'AM' : 'PM'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setIsCalendarVisible(true)} style={styles.calendarButton}>
              <MaterialCommunityIcons name="calendar-search" size={24} color="#8B5CF6" />
            </TouchableOpacity>
          </View>

          {!isPreFilled && (
            <>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="hand-extended-outline" size={24} color="#3C72F2" />
                <Text style={styles.sectionTitle}>Appointment Type</Text>
              </View>
              
              <View style={styles.typeSelectorContainer}>
                <TouchableOpacity 
                  style={[styles.typeCard, appointmentType === 'doctor' && styles.typeCardActive]}
                  onPress={() => setAppointmentType('doctor')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.typeIconWrapper, appointmentType === 'doctor' && styles.typeIconWrapperActive]}>
                    <MaterialCommunityIcons name="stethoscope" size={28} color={appointmentType === 'doctor' ? '#3C72F2' : '#777'} />
                  </View>
                  <Text style={[styles.typeCardText, appointmentType === 'doctor' && styles.typeCardTextActive]}>Doctor</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.typeCard, appointmentType === 'hospital' && styles.typeCardActive]}
                  onPress={() => setAppointmentType('hospital')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.typeIconWrapper, appointmentType === 'hospital' && styles.typeIconWrapperActive]}>
                    <MaterialCommunityIcons name="hospital-building" size={28} color={appointmentType === 'hospital' ? '#3C72F2' : '#777'} />
                  </View>
                  <Text style={[styles.typeCardText, appointmentType === 'hospital' && styles.typeCardTextActive]}>Hospital</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />
            </>
          )}

          {appointmentType === 'doctor' ? (
            <View style={styles.flowContainer}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="doctor" size={24} color="#3C72F2" />
                <Text style={styles.sectionTitle}>Doctor Details</Text>
              </View>
              
              <Text style={styles.label}>Specialization</Text>
              <TouchableOpacity style={styles.dropdownSelector} onPress={() => openDropdown('specialization', SPECIALIZATIONS)}>
                <Text style={selectedSpecialization ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {selectedSpecialization ? selectedSpecialization.name : 'Select Specialization'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#777" />
              </TouchableOpacity>

              <Text style={styles.label}>Select Doctor</Text>
              <TouchableOpacity 
                style={[styles.dropdownSelector, !selectedSpecialization && styles.dropdownDisabled]} 
                onPress={() => {
                  if (!selectedSpecialization) return;
                  openDropdown('doctor', DOCTORS.filter(d => d.spId === selectedSpecialization.id));
                }}
                activeOpacity={!selectedSpecialization ? 1 : 0.7}
              >
                <Text style={selectedDoctor ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {selectedDoctor ? selectedDoctor.name : (selectedSpecialization ? 'Select Doctor' : 'Select Specialization First')}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#777" />
              </TouchableOpacity>

              <Text style={styles.label}>Consultation Mode</Text>
              <View style={styles.modeSelectorContainer}>
                <TouchableOpacity 
                  style={[styles.modeButton, consultationMode === 'offline' && styles.modeButtonActive]}
                  onPress={() => setConsultationMode('offline')}
                >
                  <MaterialCommunityIcons name="office-building-marker-outline" size={20} color={consultationMode === 'offline' ? '#FFF' : '#777'} />
                  <Text style={[styles.modeButtonText, consultationMode === 'offline' && styles.modeButtonTextActive]}>Offline</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modeButton, consultationMode === 'online' && styles.modeButtonActive]}
                  onPress={() => setConsultationMode('online')}
                >
                  <MaterialCommunityIcons name="video-outline" size={22} color={consultationMode === 'online' ? '#FFF' : '#777'} />
                  <Text style={[styles.modeButtonText, consultationMode === 'online' && styles.modeButtonTextActive]}>Online</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.flowContainer}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="hospital-marker" size={24} color="#3C72F2" />
                <Text style={styles.sectionTitle}>Hospital Details</Text>
              </View>
              
              <Text style={styles.label}>State</Text>
              <TouchableOpacity style={styles.dropdownSelector} onPress={() => openDropdown('state', STATES)}>
                <Text style={selectedState ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {selectedState ? selectedState.name : 'Select State'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#777" />
              </TouchableOpacity>

              <Text style={styles.label}>District</Text>
              <TouchableOpacity 
                style={[styles.dropdownSelector, !selectedState && styles.dropdownDisabled]} 
                onPress={() => {
                  if (!selectedState) return;
                  openDropdown('district', DISTRICTS.filter(d => d.stateId === selectedState.id));
                }}
                activeOpacity={!selectedState ? 1 : 0.7}
              >
                <Text style={selectedDistrict ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {selectedDistrict ? selectedDistrict.name : (selectedState ? 'Select District' : 'Select State First')}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#777" />
              </TouchableOpacity>

              <Text style={styles.label}>Select Hospital</Text>
              <TouchableOpacity 
                style={[styles.dropdownSelector, !selectedDistrict && styles.dropdownDisabled]} 
                onPress={() => {
                  if (!selectedDistrict) return;
                  openDropdown('hospital', HOSPITALS.filter(h => h.districtId === selectedDistrict.id));
                }}
                activeOpacity={!selectedDistrict ? 1 : 0.7}
              >
                <Text style={selectedHospital ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                  {selectedHospital ? selectedHospital.name : (selectedDistrict ? 'Select Hospital' : 'Select District First')}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#777" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.divider} />
          
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="folder-clock-outline" size={24} color="#3C72F2" />
            <Text style={styles.sectionTitle}>Old Reports (Optional)</Text>
          </View>

          <View style={styles.reportsContainer}>
            <TouchableOpacity style={styles.oldReportsUploadBox} onPress={handleAddOldReport}>
              <View style={styles.uploadIconCircle}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={28} color="#3C72F2" />
              </View>
              <Text style={styles.oldReportsUploadTitle}>Upload Old Reports</Text>
              <Text style={styles.oldReportsUploadSub}>Medical, Scan, or Lab reports</Text>
            </TouchableOpacity>

            {oldReports.length > 0 && (
              <View style={styles.uploadedFilesList}>
                {oldReports.map((fileName, index) => (
                  <View key={index} style={styles.uploadedFileItem}>
                    <MaterialCommunityIcons name={fileName.endsWith('.jpg') ? "file-image-outline" : "file-document-outline"} size={20} color="#00C473" />
                    <Text style={styles.uploadedFileName}>{fileName}</Text>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#00C473" style={{marginLeft: 'auto'}} />
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
            <Text style={styles.bookButtonText}>Confirm Appointment</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalVisible(false)}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Option</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalListItem} onPress={() => handleSelectItem(item)}>
                  <Text style={styles.modalListItemText}>{item.name}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#CCC" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.modalEmptyText}>No items found.</Text>}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Custom Calendar Modal */}
      <Modal visible={isCalendarVisible} transparent animationType="fade" onRequestClose={() => setIsCalendarVisible(false)}>
        <TouchableOpacity style={styles.calendarModalOverlay} activeOpacity={1} onPress={() => setIsCalendarVisible(false)}>
          <TouchableOpacity style={styles.calendarModalContainer} activeOpacity={1} onPress={() => {}}>
            
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarMonthText}>October 2023</Text>
              <View style={styles.calendarNav}>
                <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
                <MaterialCommunityIcons name="chevron-right" size={24} color="#333" style={{marginLeft: 16}} />
              </View>
            </View>
            
            {/* Days Row */}
            <View style={styles.calendarDaysRow}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
                <Text key={day} style={styles.calendarDayLabel}>{day}</Text>
              ))}
            </View>
            
            {/* Dates Grid */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <TouchableOpacity 
                  key={day} 
                  style={[styles.calendarDateCell, tempDate === day && styles.calendarDateCellActive]}
                  onPress={() => setTempDate(day)}
                >
                  <Text style={[styles.calendarDateText, tempDate === day && styles.calendarDateTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Slots */}
            <Text style={styles.timeTitle}>Select Time</Text>
            <View style={styles.timeGrid}>
              {['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:30 PM'].map(time => (
                <TouchableOpacity 
                  key={time} 
                  style={[styles.timeGridChip, tempTime === time && styles.timeGridChipActive]}
                  onPress={() => setTempTime(time)}
                >
                  <Text style={[styles.timeGridChipText, tempTime === time && styles.timeGridChipTextActive]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmDateTimeButton} onPress={handleConfirmDateTime}>
              <Text style={styles.confirmDateTimeButtonText}>Confirm</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Upload Modal */}
      <Modal visible={isUploadModalVisible} transparent animationType="slide" onRequestClose={() => setIsUploadModalVisible(false)}>
        <TouchableOpacity style={styles.uploadModalOverlay} activeOpacity={1} onPress={() => setIsUploadModalVisible(false)}>
          <TouchableOpacity style={styles.uploadModalContainer} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.uploadModalTitle}>Upload Old Reports</Text>
            
            <TouchableOpacity style={styles.uploadOptionButton} onPress={async () => {
              setIsUploadModalVisible(false);
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
              });
              if (!result.canceled) {
                const uri = result.assets[0].uri;
                const fileName = uri.split('/').pop() || 'photo.jpg';
                setOldReports([...oldReports, fileName]);
              }
            }}>
              <MaterialCommunityIcons name="camera-outline" size={24} color="#3C72F2" />
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadOptionButton} onPress={async () => {
              setIsUploadModalVisible(false);
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
              });
              if (!result.canceled) {
                const uri = result.assets[0].uri;
                const fileName = uri.split('/').pop() || 'gallery_image.jpg';
                setOldReports([...oldReports, fileName]);
              }
            }}>
              <MaterialCommunityIcons name="image-outline" size={24} color="#3C72F2" />
              <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadOptionButton} onPress={async () => {
              setIsUploadModalVisible(false);
              const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
              if (!result.canceled) {
                const uri = result.assets[0].uri;
                const fileName = result.assets[0].name || uri.split('/').pop() || 'document.pdf';
                setOldReports([...oldReports, fileName]);
              }
            }}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#3C72F2" />
              <Text style={styles.uploadOptionText}>Choose Document</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.uploadOptionButton, { borderBottomWidth: 0 }]} onPress={() => setIsUploadModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#FF4D4D" />
              <Text style={[styles.uploadOptionText, { color: '#FF4D4D' }]}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 60,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5F1F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
    fontWeight: '500',
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
  },
  typeCardActive: {
    backgroundColor: '#F4F7FE',
    borderColor: '#3C72F2',
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  typeIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIconWrapperActive: {
    backgroundColor: '#FFF',
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  typeCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777',
  },
  typeCardTextActive: {
    color: '#3C72F2',
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modeButtonActive: {
    backgroundColor: '#3C72F2',
    borderColor: '#3C72F2',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
    marginLeft: 8,
  },
  modeButtonTextActive: {
    color: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 24,
  },
  flowContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
    marginLeft: 4,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    height: 60,
  },
  dropdownDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  dropdownTextPlaceholder: {
    fontSize: 15,
    color: '#A0AAB5',
    fontWeight: '500',
  },
  dropdownTextSelected: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  reportsContainer: {
    marginBottom: 8,
  },
  oldReportsUploadBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 24,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5F1F8',
    borderStyle: 'dashed',
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5F1F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  oldReportsUploadTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
    marginBottom: 4,
  },
  oldReportsUploadSub: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  uploadedFilesList: {
    marginBottom: 16,
  },
  uploadedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#00C473',
  },
  uploadedFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  bookButton: {
    backgroundColor: '#3C72F2',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 10,
    marginBottom: 50,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  modalListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  modalListItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalEmptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: '#888',
  },
  amPmButton: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  amPmText: {
    color: '#3C72F2',
    fontWeight: '700',
    fontSize: 13,
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  calendarModalContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonthText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  calendarNav: {
    flexDirection: 'row',
  },
  calendarDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calendarDayLabel: {
    width: '14%',
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDateCell: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: 100,
  },
  calendarDateCellActive: {
    backgroundColor: '#3C72F2',
  },
  calendarDateText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  calendarDateTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeGridChip: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeGridChipActive: {
    backgroundColor: '#3C72F2',
    borderColor: '#3C72F2',
  },
  timeGridChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  timeGridChipTextActive: {
    color: '#FFF',
  },
  confirmDateTimeButton: {
    backgroundColor: '#00C473',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDateTimeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  uploadModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  uploadModalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  uploadOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  }
});



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/Common/BackButton';
import CustomDropdown from '../components/Common/CustomDropdown';
import { Colors } from '../theme/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const STATE_CITY_MAP: Record<string, string[]> = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tiruppur'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi']
};
const AVAILABLE_STATES = Object.keys(STATE_CITY_MAP);


export default function AddPersonScreen() {
  const navigation = useNavigation<any>();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [bloodGroup, setBloodGroup] = useState('');
  
  const [flatNo, setFlatNo] = useState('');
  const [street, setStreet] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('India');

  const [isSaving, setIsSaving] = useState(false);
  const route = useRoute<any>();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.editPerson) {
      const p = route.params.editPerson;
      setEditingId(p.id);
      setName(p.name || '');
      setEmail(p.email || '');
      setPhone(p.phone || '');
      setDob(p.dob || '');
      setBloodGroup(p.bloodGroup || '');
      setFlatNo(p.flatNo || '');
      setStreet(p.street || '');
      setStreet2(p.street2 || '');
      setCity(p.city || '');
      setPincode(p.pincode || '');
      setStateName(p.stateName || '');
      setCountry(p.country || 'India');
    }
  }, [route.params?.editPerson]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateValue(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setDob(`${day}/${month}/${year}`);
    }
  };

  

  const handleSave = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Name and Phone are required.');
      return;
    }
    setIsSaving(true);
    try {
      const userDataString = await AsyncStorage.getItem('my_details_list');
      let usersList = userDataString ? JSON.parse(userDataString) : [];
      
      if (editingId) {
        const index = usersList.findIndex((u: any) => u.id === editingId);
        if (index !== -1) {
          usersList[index] = { ...usersList[index], name, email, phone, dob, bloodGroup, flatNo, street, street2, city, pincode, stateName, country };
        }
      } else {
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          phone,
          dob,
          bloodGroup,
          flatNo,
          street,
          street2,
          city,
          pincode,
          stateName,
          country
        };
        usersList.push(newUser);
      }

      await AsyncStorage.setItem('my_details_list', JSON.stringify(usersList));
      Alert.alert('Success', editingId ? 'Person updated successfully.' : 'Person added successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save details.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{editingId ? 'Edit Person' : 'Add Person'}</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your full name" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
              <TextInput style={styles.input} value={phone} onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} placeholder="Enter your phone number" keyboardType="numeric" maxLength={10} />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Date of Birth</Text>
              <View style={[styles.inputWrapper, { paddingHorizontal: 8 }]}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ paddingVertical: 12, marginRight: 8, justifyContent: 'center' }}>
                  <Ionicons name="calendar-outline" size={20} color={Colors.color3C72F2} />
                </TouchableOpacity>
                <TextInput 
                  style={[styles.input, { padding: 0 }]} 
                  value={dob} 
                  onChangeText={(text) => {
                    // Only allow numbers and slash
                    let cleaned = text.replace(/[^0-9/]/g, '');
                    // Auto-insert slash after DD and MM
                    if (cleaned.length === 2 && !cleaned.includes('/')) cleaned += '/';
                    if (cleaned.length === 5 && (cleaned.match(/\//g) || []).length === 1) cleaned += '/';
                    setDob(cleaned.substring(0, 10));
                  }} 
                  placeholder="DD/MM/YYYY" 
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={dateValue}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()} // Can't be born in the future
                />
              )}
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Blood Group</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="water-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
                <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} placeholder="e.g. O+" />
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Address Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Flat / Door No</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="home-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
              <TextInput style={styles.input} value={flatNo} onChangeText={setFlatNo} placeholder="Enter Flat / Door No" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street / Area (Line 1)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="map-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
              <TextInput style={styles.input} value={street} onChangeText={setStreet} placeholder="Enter Street / Area" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street / Area (Line 2)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="map-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
              <TextInput style={styles.input} value={street2} onChangeText={setStreet2} placeholder="Landmark / Locality (Optional)" />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>City</Text>
              <CustomDropdown
                value={city}
                options={stateName ? STATE_CITY_MAP[stateName] : []}
                onSelect={setCity}
                placeholder={stateName ? "Select City" : "Select State First"}
                disabled={!stateName}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Pincode</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={20} color={Colors.color666} style={styles.inputIcon} />
                <TextInput style={styles.input} value={pincode} onChangeText={(text) => setPincode(text.replace(/[^0-9]/g, ''))} placeholder="Pincode" keyboardType="numeric" maxLength={6} />
              </View>
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>State</Text>
              <CustomDropdown
                value={stateName}
                options={AVAILABLE_STATES}
                onSelect={(state) => {
                  setStateName(state);
                  setCity(''); // Clear city when state changes
                }}
                placeholder="Select State"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Country</Text>
              <View style={[styles.inputWrapper, { backgroundColor: '#F0F0F0', paddingHorizontal: 12 }]}>
                <TextInput style={[styles.input, { color: Colors.color666 }]} value={country} editable={false} />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Details'}</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.colorF8F9FA },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  sectionHeader: { marginTop: 20, marginBottom: 15, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.primary },
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
  content: { flex: 1 },
  formContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.color333,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.colorF8F9FA,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.color333,
  },
  saveButton: {
    backgroundColor: Colors.color3C72F2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

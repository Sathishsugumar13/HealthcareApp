import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import CustomDropdown from '../components/Common/CustomDropdown';
import { useAppointment } from '../context/AppointmentContext';
import { usePharmacy } from '../context/PharmacyContext';
import BackButton from '../components/Common/BackButton';
import PaymentGatewayModal from '../components/Common/PaymentGatewayModal';
import PharmacyBillModal from '../components/Common/PharmacyBillModal';
import PaymentMethodSelector from '../components/Common/PaymentMethodSelector';
import { Colors } from '../theme/colors';


const STATE_CITY_MAP: Record<string, string[]> = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tiruppur'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi']
};
const AVAILABLE_STATES = Object.keys(STATE_CITY_MAP);

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addAppointment } = useAppointment();
    const { addOrder } = usePharmacy();
  
  const { apptDetails, successMsg, pharmacy } = route.params || {};
  
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  
  
  const [showSimModal, setShowSimModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  // Dynamic Pricing Logic for Pharmacy
  const selectedTablets = route.params?.selectedTablets || [];
  let subtotal = 0;
  let tabletPrices: {name: string, price: number}[] = [];
  
  if (pharmacy) {
    if (selectedTablets.length > 0) {
      selectedTablets.forEach((t: string) => {
        // Deterministic dummy price based on name length
        const price = 120 + (t.length * 10);
        subtotal += price;
        tabletPrices.push({ name: t, price });
      });
    } else if (route.params?.message) {
      const lines = route.params.message.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 2);
      if (lines.length > 0) {
        lines.forEach((l: string) => {
           // Extract just the tablet name (remove "1. ")
           const name = l.replace(/^\d+\.\s*/, '');
           const price = 120 + (name.length * 10);
           subtotal += price;
           tabletPrices.push({ name: name, price });
        });
      } else {
        subtotal = 350;
      }
    } else {
      // If no tablets selected (e.g., custom order or prescription)
      subtotal = 350;
    }
  }

  const gst = pharmacy ? Math.round(subtotal * 0.05) : 0;
  const deliveryCharge = pharmacy ? (subtotal > 500 ? 0 : 40) : 0;
  
  const finalPharmacyTotal = subtotal + gst + deliveryCharge;
  const totalAmount = pharmacy ? finalPharmacyTotal : (apptDetails?.fee || 500);
  const [simStep, setSimStep] = useState<string>(''); // 'upi_apps', 'processing', 'card_form', 'otp', 'bank_list', 'bank_login', 'success'
  const [loading, setLoading] = useState(false);
  
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState('');
  
  // Bank state
  const [selectedBank, setSelectedBank] = useState('');
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [selectedProfileName, setSelectedProfileName] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
    const [addressLine3, setAddressLine3] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country] = useState('India');
  const [pincode, setPincode] = useState('');
  const [savedCards, setSavedCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await AsyncStorage.getItem('my_details_list');
      if (data) {
        const list = JSON.parse(data);
        setSavedProfiles(list);
        
        // Do not auto-fill so the user can manually enter if they prefer.
      }
      } catch (error) {
        console.error('Error loading user details in payment screen', error);
      }
    };
    fetchUserDetails();
      const fetchCards = async () => {
        try {
          const data = await AsyncStorage.getItem('@saved_cards');
          if (data) setSavedCards(JSON.parse(data));
        } catch (e) {}
      };
      fetchCards();
    }, []);

  const handleProfileSelect = (name: string) => {
    setSelectedProfileName(name);
    const profile = savedProfiles.find(p => p.name === name);
    if (profile) {
      setPatientName(profile.name || '');
      setPhone(profile.phone || '');
      setAddressLine1(profile.flatNo || '');
      setAddressLine2(profile.street || '');
        setAddressLine3(profile.street2 || '');
      setCity(profile.city || '');
      setStateName(profile.stateName || '');
      setPincode(profile.pincode || '');
    }
  };

  let paymentMethods = [
    
      ...savedCards.map(c => ({ id: `saved_card_${c.id}`, name: `${c.type || 'Card'} **** ${c.number.slice(-4)}`, icon: 'card' as any })),
      { id: 'upi', name: 'UPI', icon: 'qr-code-outline' },
      { id: 'card', name: savedCards.length > 0 ? 'Add New Card' : 'Credit / Debit Card', icon: 'add-circle-outline' },
      { id: 'netbanking', name: 'Net Banking', icon: 'business-outline' },
      { id: 'cash', name: pharmacy ? 'Cash on Delivery' : 'Pay at Clinic', icon: 'cash-outline' },
    
  ];
  
  if (apptDetails?.consultationMode === 'online') {
    paymentMethods = paymentMethods.filter(m => m.id !== 'cash');
  }
  
  const upiApps = [
    { name: 'Google Pay', color: Colors.color4285F4 },
    { name: 'PhonePe', color: Colors.color5F259F },
    { name: 'Paytm', color: Colors.color002970 }
  ];
  
  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'];

  const finalizeAppointment = () => {
      const pMethodName = paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod;
      
      if (pharmacy) {
        if (!patientName || !phone || !addressLine1 || !city || !stateName || !pincode) {
          Alert.alert('Error', 'Please fill in Name, Phone, Address, City, State and Pincode.');
          return;
        }
        if (phone.length !== 10) {
          Alert.alert('Error', 'Phone number must be exactly 10 digits.');
          return;
        }
        const pStatus = selectedMethod === 'cash' ? 'Pending (COD)' : 'Paid';
        addOrder({
            id: `order_${Date.now()}`,
            pharmacyName: pharmacy.name,
            phone: phone,
            patientName: patientName,
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            message: tabletPrices.length > 0 ? tabletPrices.map((t: any) => t.name).join(', ') : 'Prescription Order',
            address: [addressLine1, addressLine2, addressLine3, city, stateName, pincode, country].filter(Boolean).join(', '),
            paymentMethod: pMethodName,
            paymentStatus: pStatus,
            items: tabletPrices,
            subtotal: subtotal,
            gst: gst,
            deliveryCharge: deliveryCharge,
            totalAmount: totalAmount
          });
      } else if (apptDetails) {
        const pStatus = selectedMethod === 'cash' ? 'Unpaid (Pay at Clinic)' : 'Paid';
        const finalApptDetails = {
          ...apptDetails,
          paymentMethod: pMethodName,
          paymentStatus: pStatus
        };
        addAppointment(finalApptDetails);
      }
      setShowSimModal(false);
      
      if (pharmacy) {
        // Prepare bill data and show bill modal
        const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        setBillData({
          pharmacyName: pharmacy.name,
          date: today,
          items: tabletPrices,
          subtotal: subtotal,
          gst: gst,
          deliveryCharge: deliveryCharge,
          total: totalAmount,
          patientName: patientName
        });
        setShowBillModal(true);
      } else {
        Alert.alert('Success', (successMsg || 'Payment successful and appointment booked!'), [
          { text: 'OK', onPress: () => navigation.navigate('MainTab') }
        ]);
      }
  };

  const processMockPayment = () => {
    setSimStep('processing');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSimStep('success');
      setTimeout(() => {
        finalizeAppointment();
      }, 1500);
    }, 2000);
  };

  const handlePayNow = () => {
    if (pharmacy) {
      if (!patientName || !phone || !addressLine1 || !city || !stateName || !pincode) {
        Alert.alert('Error', 'Please fill in Name, Phone, Address, City, State and Pincode.');
        return;
      }
      if (phone.length !== 10) {
        Alert.alert('Error', 'Phone number must be exactly 10 digits.');
        return;
      }
    }

    if (selectedMethod === 'cash') {
      finalizeAppointment();
      return;
    }
    
    setShowSimModal(true);
    
    if (selectedMethod.startsWith('saved_card_')) {
      setSimStep('saved_card_cvv');
      setCvv('');
    } else if (selectedMethod === 'upi') {
      setSimStep('upi_apps');
    } else if (selectedMethod === 'card') {
      setSimStep('card_form');
      setCardNumber('');
      setExpiry('');
      setCvv('');
    } else if (selectedMethod === 'netbanking') {
      setSimStep('bank_list');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.spacerWidth48} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{pharmacy ? 'Pharmacy Order Details' : 'Consultation Details'}</Text>
          
          {pharmacy ? (
            <>
              {savedProfiles.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <CustomDropdown
                    value={selectedProfileName}
                    options={savedProfiles.map((p: any) => p.name)}
                    onSelect={handleProfileSelect}
                    placeholder="Select Saved Address (Optional)"
                  />
                </View>
              )}

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  value={patientName}
                  onChangeText={setPatientName}
                />
              </View>
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter phone number"
                  keyboardType="numeric"
                  maxLength={10}
                  value={phone}
                  onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                />
              </View>
    
              <View style={styles.inputRow}>
                                <Text style={styles.inputLabel}>Delivery Address</Text>
                
                <View style={styles.inputRow}>
                  <Text style={{ fontSize: 13, color: Colors.color555, marginBottom: 6 }}>Flat / Door No</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Door No, Flat, Building"
                    value={addressLine1}
                    onChangeText={setAddressLine1}
                  />
                </View>
                
                <View style={styles.inputRow}>
                    <Text style={{ fontSize: 13, color: Colors.color555, marginBottom: 6 }}>Street / Area (Line 1)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Street, Area"
                      value={addressLine2}
                      onChangeText={setAddressLine2}
                    />
                  </View>
                  <View style={styles.inputRow}>
                    <Text style={{ fontSize: 13, color: Colors.color555, marginBottom: 6 }}>Street / Area (Line 2)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Landmark / Locality (Optional)"
                      value={addressLine3}
                      onChangeText={setAddressLine3}
                    />
                  </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
                    <Text style={{ fontSize: 13, color: Colors.color555, marginBottom: 6 }}>City</Text>
                    <CustomDropdown
                        value={city}
                        options={stateName ? STATE_CITY_MAP[stateName] : []}
                        onSelect={setCity}
                        placeholder={stateName ? "Select City" : "Select State First"}
                        disabled={!stateName}
                      />
                  </View>
                  <View style={[styles.inputRow, { flex: 1, marginLeft: 8 }]}>
                    <Text style={{ fontSize: 13, color: Colors.color555, marginBottom: 6 }}>Pincode</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Pincode"
                      value={pincode}
                      onChangeText={(text) => setPincode(text.replace(/[^0-9]/g, ''))}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                  </View>
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
                    <Text style={{ fontSize: 13, color: Colors.color555, marginBottom: 6 }}>State</Text>
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
                  <View style={[styles.inputRow, { flex: 1, marginLeft: 8 }]}>
                    <Text style={{ fontSize: 13, color: Colors.color555, marginBottom: 6 }}>Country</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: '#F0F0F0', color: Colors.color555 }]}
                      value={country}
                      editable={false}
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.divider} />
              
                              <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Pharmacy:</Text>
                  <Text style={styles.summaryValue}>{pharmacy.name}</Text>
                </View>
                {tabletPrices.length > 0 ? (
                  tabletPrices.map((t, idx) => (
                    <View style={styles.summaryRow} key={idx}>
                      <Text style={styles.summaryLabel}>{t.name}:</Text>
                      <Text style={styles.summaryValue}>₹{t.price}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Custom Order Estimate:</Text>
                    <Text style={styles.summaryValue}>₹{subtotal}</Text>
                  </View>
                )}

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>GST (5%):</Text>
                  <Text style={styles.summaryValue}>₹{gst}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Charge:</Text>
                  <Text style={[styles.summaryValue, deliveryCharge === 0 && { color: Colors.color00C473 }]}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </Text>
                </View>
                
                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { fontWeight: '700', color: Colors.color333 }]}>Total Amount:</Text>
                  <Text style={styles.feeValue}>₹{totalAmount}</Text>
                </View>
            </>
          ) : (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Patient:</Text>
                <Text style={styles.summaryValue}>{apptDetails?.patientName || 'N/A'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phone:</Text>
                <Text style={styles.summaryValue}>{apptDetails?.phone || 'N/A'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Doctor:</Text>
                <Text style={styles.summaryValue}>{apptDetails?.doctorName || 'N/A'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>{apptDetails?.date || 'N/A'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Consultation Fee:</Text>
                <Text style={styles.feeValue}>₹{totalAmount}</Text>
              </View>
            </>
          )}
        </View>

        <PaymentMethodSelector 
          methods={paymentMethods}
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />

        <View style={styles.spacerHeight80} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Text style={styles.payButtonText}>
            {selectedMethod === 'cash' ? (pharmacy ? 'Place Order (COD)' : 'Confirm Appointment') : (pharmacy ? 'Pay & Place Order' : `Pay ₹${totalAmount} & Book`)}
          </Text>
        </TouchableOpacity>
      </View>

      <PaymentGatewayModal 
        isVisible={showSimModal}
        onClose={() => setShowSimModal(false)}
        simStep={simStep}
        setSimStep={setSimStep}
        processMockPayment={processMockPayment}
        amount={totalAmount}
      />
      <PharmacyBillModal 
        isVisible={showBillModal} 
        onClose={() => { setShowBillModal(false); navigation.navigate('MainTab'); }} 
        billData={billData} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  spacerWidth48: { width: 48 },
  spacerHeight80: { height: 80 },

  safeArea: { flex: 1, backgroundColor: Colors.colorF8F9FA },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: Colors.colorFFF,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.color333 },
  container: { flex: 1, padding: 20 },
  summaryCard: {
    backgroundColor: Colors.colorFFF,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.color000,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: Colors.color333, marginBottom: 12 },
  inputRow: { marginBottom: 12 },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: Colors.white,
    color: Colors.color333
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: Colors.color666 },
  summaryValue: { fontSize: 14, color: Colors.color333, fontWeight: '500' },
  divider: { height: 1, backgroundColor: Colors.colorE0E0E0, marginVertical: 12 },
  feeValue: { fontSize: 16, color: Colors.color00C473, fontWeight: '700' },
  methodTitle: { fontSize: 16, fontWeight: '700', color: Colors.color333, marginBottom: 16 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colorFFF,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.colorE0E0E0,
  },
  methodCardSelected: { borderColor: Colors.color3C72F2, backgroundColor: Colors.colorF0F5FF },
  methodIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.colorF8F9FA,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  methodText: { flex: 1, fontSize: 16, color: Colors.color333 },
  methodTextSelected: { fontWeight: '700', color: Colors.color3C72F2 },
  footer: { padding: 20, backgroundColor: Colors.colorFFF, borderTopWidth: 1, borderTopColor: Colors.colorE0E0E0 },
  payButton: { backgroundColor: Colors.color3C72F2, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  payButtonText: { color: Colors.colorFFF, fontSize: 16, fontWeight: '700' },

  
  modalOverlay: {
    flex: 1, backgroundColor: Colors.overlay50, justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: Colors.colorFFF, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400
  },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  gwHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.colorEEE },
  gwHeaderText: { marginLeft: 8, fontSize: 14, color: Colors.color666, fontWeight: '600' },
  simContent: { flex: 1 },
  simTitle: { fontSize: 20, fontWeight: '700', color: Colors.color333, marginBottom: 8 },
  simSubtitle: { fontSize: 14, color: Colors.color666, marginBottom: 20 },
  
  upiAppBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: Colors.colorEEE, borderRadius: 12, marginBottom: 12 },
  upiIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  upiText: { flex: 1, fontSize: 16, fontWeight: '500' },
  
  inputWrapper: { marginBottom: 16 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  inputLabel: { fontSize: 12, color: Colors.color666, marginBottom: 6, fontWeight: '500' },
  inputField: { borderWidth: 1, borderColor: Colors.colorDDD, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: Colors.colorF9F9F9 },
  
  simPayBtn: { backgroundColor: Colors.color00C473, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  simPayBtnText: { color: Colors.colorFFF, fontSize: 16, fontWeight: 'bold' },
  
  bankBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.colorEEE },
  bankText: { flex: 1, fontSize: 16, marginLeft: 16, color: Colors.color333 },
  
  processingContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  processingText: { fontSize: 18, fontWeight: '600', color: Colors.color333, marginTop: 20, marginBottom: 8 },
  processingSub: { fontSize: 14, color: Colors.color666 },
  
  successText: { fontSize: 22, fontWeight: 'bold', color: Colors.color00C473, marginTop: 20, marginBottom: 8 },
  successSub: { fontSize: 16, color: Colors.color666 },
});

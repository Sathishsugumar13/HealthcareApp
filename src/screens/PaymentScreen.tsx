import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAppointment } from '../context/AppointmentContext';
import { usePharmacy } from '../context/PharmacyContext';
import BackButton from '../components/Common/BackButton';
import PaymentGatewayModal from '../components/Common/PaymentGatewayModal';
import PaymentMethodSelector from '../components/Common/PaymentMethodSelector';
import { Colors } from '../theme/colors';

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addAppointment } = useAppointment();
    const { addOrder } = usePharmacy();
  
  const { apptDetails, successMsg, pharmacy } = route.params || {};
  
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  
  
  const [showSimModal, setShowSimModal] = useState(false);
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
    const [address, setAddress] = useState('');
  const [savedCards, setSavedCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('my_details');
        if (userDataString) {
          const userObj = JSON.parse(userDataString);
          if (userObj.name) setPatientName(userObj.name);
          if (userObj.phone) setPhone(userObj.phone);
          if (userObj.address) setAddress(userObj.address);
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

  const paymentMethods = [
      ...savedCards.map(c => ({ id: `saved_card_${c.id}`, name: `${c.type || 'Card'} **** ${c.number.slice(-4)}`, icon: 'card' as any })),
      { id: 'upi', name: 'UPI', icon: 'qr-code-outline' },
      { id: 'card', name: savedCards.length > 0 ? 'Add New Card' : 'Credit / Debit Card', icon: 'add-circle-outline' },
      { id: 'netbanking', name: 'Net Banking', icon: 'business-outline' },
      { id: 'cash', name: pharmacy ? 'Cash on Delivery' : 'Pay at Clinic', icon: 'cash-outline' },
    ];
  
  const upiApps = [
    { name: 'Google Pay', color: Colors.color4285F4 },
    { name: 'PhonePe', color: Colors.color5F259F },
    { name: 'Paytm', color: Colors.color002970 }
  ];
  
  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'];

  const finalizeAppointment = () => {
      const pMethodName = paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod;
      
      if (pharmacy) {
        if (!patientName || !phone || !address) {
          Alert.alert('Error', 'Please fill in Name, Phone, and Address.');
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
          address: address,
          paymentMethod: pMethodName,
          paymentStatus: pStatus
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
    Alert.alert(pharmacy ? 'Order Confirmed' : 'Success', pharmacy ? 'Your pharmacy order has been placed successfully!' : (successMsg || 'Payment successful and appointment booked!'), [
      { text: 'OK', onPress: () => navigation.navigate('MainTab') }
    ]);
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
    if (selectedMethod === 'cash') {
      finalizeAppointment();
      return;
    }
    
    setShowSimModal(true);
    
    if (selectedMethod.startsWith('saved_card_')) {
      setSimStep('processing');
      simulateProcessing();
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
                <TextInput
                  style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Enter full address"
                  multiline
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pharmacy:</Text>
                <Text style={styles.summaryValue}>{pharmacy.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={styles.feeValue}>₹{pharmacy.id === 'p1' ? '1250' : '450'}</Text>
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
                <Text style={styles.feeValue}>₹500</Text>
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
            {selectedMethod === 'cash' ? (pharmacy ? 'Place Order (COD)' : 'Confirm Appointment') : (pharmacy ? 'Pay & Place Order' : 'Pay ₹500 & Book')}
          </Text>
        </TouchableOpacity>
      </View>

      <PaymentGatewayModal 
        isVisible={showSimModal}
        onClose={() => setShowSimModal(false)}
        simStep={simStep}
        setSimStep={setSimStep}
        processMockPayment={processMockPayment}
        amount={500}
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

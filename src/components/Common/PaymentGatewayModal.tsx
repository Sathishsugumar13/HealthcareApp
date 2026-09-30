import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface PaymentGatewayModalProps {
  isVisible: boolean;
  onClose: () => void;
  simStep: string;
  setSimStep: (step: string) => void;
  processMockPayment: () => void;
  amount: number;
}

export default function PaymentGatewayModal({ 
  isVisible, 
  onClose, 
  simStep, 
  setSimStep, 
  processMockPayment,
  amount
}: PaymentGatewayModalProps) {
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [selectedBank, setSelectedBank] = React.useState('');

  const upiApps = [
    { name: 'Google Pay', color: Colors.color4285F4 },
    { name: 'PhonePe', color: Colors.color5F259F },
    { name: 'Paytm', color: Colors.color002970 }
  ];
  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'];

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    if (cleaned.length >= 2) {
      const month = parseInt(cleaned.substring(0, 2), 10);
      if (month > 12) formatted = '12' + (cleaned.length > 2 ? '/' + cleaned.substring(2, 4) : '');
      else if (month === 0) formatted = '01' + (cleaned.length > 2 ? '/' + cleaned.substring(2, 4) : '');
    }
    setExpiry(formatted);
  };

  const renderSimContent = () => {
    switch (simStep) {
      case 'upi_apps':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>Pay via UPI</Text>
            <Text style={styles.simSubtitle}>Select UPI App to complete payment of ₹{amount}</Text>
            {upiApps.map((app, idx) => (
              <TouchableOpacity key={idx} style={styles.upiAppBtn} onPress={processMockPayment}>
                <View style={[styles.upiIcon, { backgroundColor: app.color }]}>
                  <Text style={styles.inlineColorFffFontweightBold}>{app.name[0]}</Text>
                </View>
                <Text style={styles.upiText}>{app.name}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.color999} />
              </TouchableOpacity>
            ))}
          </View>
        );
        
      case 'card_form':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>Enter Card Details</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput 
                style={styles.inputField} 
                placeholder="XXXX XXXX XXXX XXXX" 
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
              />
            </View>
            <View style={styles.rowInputs}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                <TextInput 
                  style={styles.inputField} 
                  placeholder="MM/YY" 
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={handleExpiryChange}
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput 
                  style={styles.inputField} 
                  placeholder="123" 
                  keyboardType="numeric" 
                  maxLength={3}
                  secureTextEntry
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/[^0-9]/g, ''))}
                />
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.simPayBtn, (!cardNumber || !expiry || !cvv) && { opacity: 0.5 }]} 
              disabled={!cardNumber || !expiry || !cvv}
              onPress={() => {
                setSimStep('processing');
                setTimeout(() => {
                  setSimStep('otp');
                  setOtp('');
                }, 1500);
              }}
            >
              <Text style={styles.simPayBtnText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        );

      case 'otp':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>Bank Authentication</Text>
            <Text style={styles.simSubtitle}>Enter the OTP sent to your registered mobile number.</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={[styles.inputField, { textAlign: 'center', fontSize: 20, letterSpacing: 5 }]} 
                placeholder="----" 
                keyboardType="numeric"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
              />
            </View>
            <TouchableOpacity 
              style={[styles.simPayBtn, otp.length < 4 && { opacity: 0.5 }]} 
              disabled={otp.length < 4}
              onPress={processMockPayment}
            >
              <Text style={styles.simPayBtnText}>Verify & Pay</Text>
            </TouchableOpacity>
          </View>
        );

      case 'bank_list':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>Select Bank</Text>
            <ScrollView style={styles.inlineMaxheight300}>
              {banks.map((bank, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.bankBtn} 
                  onPress={() => {
                    setSelectedBank(bank);
                    setSimStep('processing');
                    setTimeout(() => {
                      setSimStep('bank_login');
                    }, 1000);
                  }}
                >
                  <MaterialCommunityIcons name="bank" size={24} color={Colors.color555} />
                  <Text style={styles.bankText}>{bank}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.color999} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 'bank_login':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>{selectedBank} NetBanking</Text>
            <Text style={styles.simSubtitle}>Login to authorize payment of ₹{amount}</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Customer ID / User ID</Text>
              <TextInput style={styles.inputField} placeholder="Enter User ID" />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput style={styles.inputField} placeholder="Enter Password" secureTextEntry />
            </View>
            <TouchableOpacity style={styles.simPayBtn} onPress={processMockPayment}>
              <Text style={styles.simPayBtnText}>Login & Pay</Text>
            </TouchableOpacity>
          </View>
        );

      case 'processing':
        return (
          <View style={styles.processingContent}>
            <ActivityIndicator size="large" color={Colors.color3C72F2} />
            <Text style={styles.processingText}>Processing Payment...</Text>
            <Text style={styles.processingSub}>Please do not close this screen or press back</Text>
          </View>
        );

      case 'success':
        return (
          <View style={styles.processingContent}>
            <MaterialCommunityIcons name="check-circle" size={80} color={Colors.color00C473} />
            <Text style={styles.successText}>Payment Successful!</Text>
            <Text style={styles.successSub}>Redirecting to app...</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {(simStep !== 'processing' && simStep !== 'success') && (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={Colors.color333} />
            </TouchableOpacity>
          )}
          
          <View style={styles.gwHeader}>
            <MaterialCommunityIcons name="shield-check" size={20} color={Colors.color00C473} />
            <Text style={styles.gwHeaderText}>Secure Payment Gateway</Text>
          </View>

          {renderSimContent()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inlineColorFffFontweightBold: { color: Colors.colorFFF, fontWeight: 'bold' },
  inlineMaxheight300: { maxHeight: 300 },

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

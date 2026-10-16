import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface PaymentGatewayModalProps {
  isVisible: boolean;
  onClose: () => void;
  simStep: string;
  setSimStep: (step: string) => void;
  processMockPayment: () => void;
  amount: number;
  payeeName?: string;
}

export default function PaymentGatewayModal({ 
  isVisible, 
  onClose, 
  simStep, 
  setSimStep, 
  processMockPayment,
  amount,
  payeeName = 'HEALTHCARE APP'
}: PaymentGatewayModalProps) {
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardHolder, setCardHolder] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [selectedBank, setSelectedBank] = React.useState('');
  const [upiPin, setUpiPin] = React.useState('');
  const [selectedUpiApp, setSelectedUpiApp] = React.useState('');

  const upiApps = [
    { name: 'Google Pay', image: require('../../../assets/images/gpay.png') },
    { name: 'PhonePe', image: require('../../../assets/images/phonepe.png') },
    { name: 'Paytm', image: require('../../../assets/images/paytm.png') }
  ];
  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'];

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const [expiryError, setExpiryError] = React.useState('');

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let errorMessage = '';

    if (cleaned.length >= 2) {
      const month = parseInt(cleaned.substring(0, 2), 10);
      if (month < 1 || month > 12) {
        errorMessage = 'Invalid month (01-12)';
      }
    }

    if (cleaned.length === 4 && !errorMessage) {
      const year = parseInt(cleaned.substring(2, 4), 10);
      const currentYear = new Date().getFullYear() % 100;
      if (year < currentYear) {
        errorMessage = 'Card expired';
      }
    }

    setExpiryError(errorMessage);

    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    setExpiry(formatted);
  };

  const renderSimContent = () => {
    switch (simStep) {
      case 'saved_card_cvv':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>Security Check</Text>
            <Text style={styles.simSubtitle}>Enter the 3-digit CVV for your saved card.</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={[styles.inputField, { textAlign: 'center', fontSize: 20, letterSpacing: 5 }]} 
                placeholder="***" 
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                value={cvv}
                onChangeText={(t) => setCvv(t.replace(/[^0-9]/g, ''))}
              />
            </View>
            <TouchableOpacity 
              style={[styles.simPayBtn, (!cvv || cvv.length < 3) && { opacity: 0.5 }]} 
              disabled={!cvv || cvv.length < 3}
              onPress={() => {
                setSimStep('processing');
                setTimeout(() => {
                  setSimStep('otp');
                  setOtp('');
                }, 1000);
              }}
            >
              <Text style={styles.simPayBtnText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        );
      case 'upi_apps':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>Pay via UPI</Text>
            <Text style={styles.simSubtitle}>Select UPI App to complete payment of ₹{amount}</Text>
            {upiApps.map((app, idx) => (
              <TouchableOpacity key={idx} style={styles.upiAppBtn} onPress={() => { setSelectedUpiApp(app.name); setUpiPin(''); setSimStep('upi_pin'); }}>
                <Image source={(app as any).image} style={{ width: 40, height: 40, marginRight: 16, borderRadius: 8 }} resizeMode="contain" />
                <Text style={styles.upiText}>{app.name}</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.color999} />
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'upi_pin':
        return (
          <View style={[styles.simContent, { paddingHorizontal: 0, marginTop: -20 }]}>
            <View style={[styles.upiHeader, { justifyContent: 'flex-end' }]}>
              <TouchableOpacity onPress={() => setSimStep('upi_apps')}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentSummaryBox}>
              <View>
                <Text style={styles.summaryAmount}>Pay ₹{amount}</Text>
                <Text style={styles.summaryTo}>To {payeeName.toUpperCase()}</Text>
              </View>
              <View style={styles.summaryIconWrap}>
                <Ionicons name="person" size={20} color="#666" />
              </View>
            </View>

            <Text style={styles.enterPinText}>Enter your PIN</Text>
            
            <View style={styles.pinDotsContainer}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={[styles.pinDot, upiPin.length > i && styles.pinDotFilled]} />
              ))}
            </View>

            <Text style={styles.warningText}>
              <Ionicons name="information-circle-outline" size={14} /> Never enter your UPI PIN to receive money
            </Text>

            <View style={styles.keypadContainer}>
              {[ [1, 2, 3], [4, 5, 6], [7, 8, 9] ].map((row, rIdx) => (
                <View key={rIdx} style={styles.keypadRow}>
                  {row.map((num) => (
                    <TouchableOpacity key={num} style={styles.keyButton} onPress={() => upiPin.length < 4 && setUpiPin(upiPin + num.toString())}>
                      <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keyButton} onPress={() => setUpiPin(upiPin.slice(0, -1))}>
                  <Ionicons name="backspace-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyButton} onPress={() => upiPin.length < 4 && setUpiPin(upiPin + '0')}>
                  <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.payKeyButton, upiPin.length < 4 && { backgroundColor: '#A0BFF8' }]} 
                  disabled={upiPin.length < 4}
                  onPress={processMockPayment}
                >
                  <Text style={styles.payKeyText}>Pay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
        
      case 'card_form':
        return (
          <View style={styles.simContent}>
            <Text style={styles.simTitle}>Enter Card Details</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Card Holder Name</Text>
              <TextInput 
                style={styles.inputField} 
                placeholder="Name on card" 
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="characters"
              />
            </View>
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
                  style={[styles.inputField, expiryError ? { borderColor: Colors.colorEF4444, borderWidth: 1 } : null]} 
                  placeholder="MM/YY" 
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={handleExpiryChange}
                />
                {expiryError ? <Text style={styles.errorText}>{expiryError}</Text> : null}
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
              style={[styles.simPayBtn, (!cardNumber || !cardHolder || !expiry || !cvv) && { opacity: 0.5 }]} 
              disabled={!cardNumber || !cardHolder || !expiry || !cvv}
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
                  <Ionicons name="business-outline" size={24} color={Colors.color555} />
                  <Text style={styles.bankText}>{bank}</Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.color999} />
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
            <Ionicons name="checkmark-circle" size={80} color={Colors.color3C72F2} />
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {(simStep !== 'processing' && simStep !== 'success') && (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.color333} />
            </TouchableOpacity>
          )}
          
          <View style={styles.gwHeader}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.color3C72F2} />
            <Text style={styles.gwHeaderText}>Secure Payment Gateway</Text>
          </View>

          {renderSimContent()}
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: Colors.colorFFF, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, minHeight: 400
  },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  gwHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.colorEEE },
  gwHeaderText: { marginLeft: 8, fontSize: 14, color: Colors.color666, fontWeight: '600' },
  simContent: {  },
  simTitle: { fontSize: 20, fontWeight: '700', color: Colors.color333, marginBottom: 8 },
  simSubtitle: { fontSize: 14, color: Colors.color666, marginBottom: 20 },
  
  upiAppBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: Colors.colorEEE, borderRadius: 12, marginBottom: 12 },
  upiIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  upiText: { flex: 1, fontSize: 16, fontWeight: '500' },
  
  inputWrapper: { marginBottom: 16 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  inputLabel: { fontSize: 12, color: Colors.color666, marginBottom: 6, fontWeight: '500' },
  errorText: { color: Colors.colorEF4444, fontSize: 12, marginTop: 4 },
  inputField: { borderWidth: 1, borderColor: Colors.colorDDD, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: Colors.colorF9F9F9 },
  

  keypadContainer: { marginTop: 40, paddingHorizontal: 10 },
  keypadRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  keyButton: { width: 70, height: 50, backgroundColor: '#EFEFEF', borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 24, fontWeight: '400', color: '#333', fontStyle: 'italic' },
  payKeyButton: { width: 70, height: 50, backgroundColor: Colors.color3C72F2, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  payKeyText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  pinDotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  pinDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#999', marginHorizontal: 12 },
  pinDotFilled: { backgroundColor: '#333', borderColor: '#333' },
  upiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  upiHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  upiHeaderText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  paymentSummaryBox: { backgroundColor: '#F5F4EC', padding: 16, borderRadius: 12, marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryAmount: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  summaryTo: { fontSize: 12, color: '#666', marginTop: 4 },
  summaryIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  enterPinText: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 10 },
  warningText: { textAlign: 'center', fontSize: 12, color: '#999', fontStyle: 'italic', marginTop: 40 },
  simPayBtn: { backgroundColor: Colors.color3C72F2, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  simPayBtnText: { color: Colors.colorFFF, fontSize: 16, fontWeight: 'bold' },
  
  bankBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.colorEEE },
  bankText: { flex: 1, fontSize: 16, marginLeft: 16, color: Colors.color333 },
  
  processingContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  processingText: { fontSize: 18, fontWeight: '600', color: Colors.color333, marginTop: 20, marginBottom: 8 },
  processingSub: { fontSize: 14, color: Colors.color666 },
  
  successText: { fontSize: 22, fontWeight: 'bold', color: Colors.color3C72F2, marginTop: 20, marginBottom: 8 },
  successSub: { fontSize: 16, color: Colors.color666 },
});

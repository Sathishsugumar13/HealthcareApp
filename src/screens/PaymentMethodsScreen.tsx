import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/Common/BackButton';
import { Colors } from '../theme/colors';

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<any>();
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Card State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await AsyncStorage.getItem('@saved_cards');
      if (data) {
        setSavedCards(JSON.parse(data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveCard = async () => {
    if (!cardName || cardNumber.length < 16 || expiry.length < 5 || cvv.length < 3) {
      Alert.alert('Invalid Details', 'Please fill in valid card details.');
      return;
    }
    
    const newCard = {
      id: Date.now().toString(),
      name: cardName,
      number: cardNumber,
      expiry: expiry,
      type: cardNumber.startsWith('4') ? 'Visa' : 'MasterCard' // Simple mock logic
    };

    try {
      const updatedCards = [...savedCards, newCard];
      await AsyncStorage.setItem('@saved_cards', JSON.stringify(updatedCards));
      setSavedCards(updatedCards);
      setIsAddModalOpen(false);
      
      // Reset fields
      setCardName('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      
      Alert.alert('Success', 'Card added successfully!');
    } catch (e) {
      Alert.alert('Error', 'Could not save the card.');
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const updatedCards = savedCards.filter(c => c.id !== id);
      await AsyncStorage.setItem('@saved_cards', JSON.stringify(updatedCards));
      setSavedCards(updatedCards);
    } catch (e) {
      console.log(e);
    }
  };

  const formatCardNumber = (num: string) => {
    const cleaned = ('' + num).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?$/);
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
    }
    return num;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Saved Cards</Text>

        {savedCards.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={50} color={Colors.colorA0AAB5} />
            <Text style={styles.emptyText}>No cards saved yet.</Text>
          </View>
        ) : (
          savedCards.map(card => (
            <View key={card.id} style={styles.cardBox}>
              <View style={styles.cardHeader}>
                <Ionicons 
                  name={card.type === 'Visa' ? "logo-venmo" : "card"} 
                  size={24} 
                  color={Colors.color3C72F2} 
                />
                <TouchableOpacity onPress={() => deleteCard(card.id)}>
                  <Ionicons name="trash-outline" size={20} color={Colors.colorEF4444} />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardNumber}>**** **** **** {card.number.slice(-4)}</Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Card Holder</Text>
                  <Text style={styles.cardValue}>{card.name}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardValue}>{card.expiry}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setIsAddModalOpen(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color={Colors.color3C72F2} />
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.color333} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="John Doe"
                value={cardName}
                onChangeText={setCardName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="0000 0000 0000 0000"
                keyboardType="numeric"
                maxLength={19}
                value={formatCardNumber(cardNumber)}
                onChangeText={(text) => setCardNumber(text.replace(/\s/g, ''))}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={(text) => setExpiry(formatExpiry(text))}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCard}>
              <Text style={styles.saveBtnText}>Save Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.color333, marginBottom: 16 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { color: Colors.color666, marginTop: 10, fontSize: 16 },
  
  cardBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardNumber: { fontSize: 22, fontWeight: 'bold', letterSpacing: 2, color: Colors.color333, marginBottom: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 12, color: Colors.color777, marginBottom: 4 },
  cardValue: { fontSize: 14, fontWeight: '600', color: Colors.color333, textTransform: 'uppercase' },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.color3C72F2,
    borderRadius: 12,
    backgroundColor: Colors.colorE6EEFD,
    marginTop: 10,
  },
  addButtonText: { marginLeft: 8, fontSize: 16, fontWeight: '600', color: Colors.color3C72F2 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.color333 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.color333, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: Colors.colorF8F9FA,
  },
  saveBtn: {
    backgroundColor: Colors.color3C72F2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});

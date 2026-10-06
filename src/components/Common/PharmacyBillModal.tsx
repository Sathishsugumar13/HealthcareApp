import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BillData, generatePharmacyBill } from '../../utils/BillGenerator';
import { useNavigation } from '@react-navigation/native';

interface PharmacyBillModalProps {
  isVisible: boolean;
  onClose: () => void;
  billData: BillData | null;
}

export default function PharmacyBillModal({ isVisible, onClose, billData }: PharmacyBillModalProps) {
  const navigation = useNavigation<any>();

  if (!billData) return null;

  const handleDownload = async () => {
    await generatePharmacyBill(billData);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={styles.successHeader}>
            <Ionicons name="checkmark-circle" size={60} color={Colors.color00C473} />
            <Text style={styles.successTitle}>Order Confirmed!</Text>
            <Text style={styles.successSub}>Your medicines will be delivered soon.</Text>
          </View>

          <View style={styles.billContainer}>
            <View style={styles.billHeader}>
              <Text style={styles.pharmacyName}>{billData.pharmacyName}</Text>
              <Text style={styles.billDate}>{billData.date}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
              {billData.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.divider} />
            
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>₹{billData.subtotal}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>GST (5%)</Text>
                <Text style={styles.totalValue}>₹{billData.gst}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Delivery Charge</Text>
                <Text style={styles.totalValue}>{billData.deliveryCharge === 0 ? 'FREE' : `₹${billData.deliveryCharge}`}</Text>
              </View>
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total Amount</Text>
                <Text style={styles.grandTotalValue}>₹{billData.total}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
              <Ionicons name="download-outline" size={20} color={Colors.white} />
              <Text style={styles.downloadBtnText}>Download Bill</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.homeBtn} onPress={handleClose}>
              <Text style={styles.homeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  successHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.color333,
    marginTop: 10,
  },
  successSub: {
    fontSize: 14,
    color: Colors.color666,
    marginTop: 4,
  },
  billContainer: {
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.color3C72F2,
    flex: 1,
  },
  billDate: {
    fontSize: 12,
    color: Colors.color999,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  itemsList: {
    maxHeight: 150,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: Colors.color444,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.color333,
    fontWeight: '500',
    marginLeft: 10,
  },
  totalsContainer: {
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.color666,
  },
  totalValue: {
    fontSize: 13,
    color: Colors.color444,
    fontWeight: '500',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderTopStyle: 'dashed',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color00C473,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  downloadBtn: {
    backgroundColor: Colors.color3C72F2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  downloadBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  homeBtn: {
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  homeBtnText: {
    color: Colors.color3C72F2,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

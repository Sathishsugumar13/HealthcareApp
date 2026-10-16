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

  const modalTotalQty = billData.items.reduce((sum, item) => sum + (item.count || 1), 0);

  const handleDownload = async () => {
    await generatePharmacyBill(billData);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide" statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={styles.successHeader}>
            <Ionicons name="checkmark-circle" size={60} color={Colors.color3C72F2} />
            <Text style={styles.successTitle}>Order Confirmed!</Text>
            <Text style={styles.successSub}>Your medicines will be delivered soon.</Text>
          </View>

          <View style={styles.billContainer}>
            <View style={styles.billHeader}>
              <Text style={styles.pharmacyName}>{billData.pharmacyName}</Text>
              <Text style={styles.billDate}>{billData.date}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.billTableHeader}>
              <Text style={styles.billHeaderMedicine}>Medicine</Text>
              <Text style={styles.billHeaderQty}>Qty</Text>
              <Text style={styles.billHeaderPrice}>Price</Text>
            </View>
            <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
              {billData.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemQtyText}>{item.count || 1}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={[styles.itemRow, { borderTopWidth: 1, borderTopColor: '#EEEEEE', paddingTop: 8, marginTop: 4, marginBottom: 8 }]}>
              <Text style={[styles.itemName, { fontWeight: '700', color: Colors.color333 }]}>
                Product Total:
              </Text>
              <Text style={[styles.itemQtyText, { fontWeight: '700', color: Colors.color333 }]}>
                {modalTotalQty}
              </Text>
              <Text style={[styles.itemPrice, { fontWeight: '700', color: Colors.color333 }]}>
                ₹{billData.subtotal}
              </Text>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>GST (5%)</Text>
                <Text style={styles.totalValue}>₹{billData.gst}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Delivery Charge</Text>
                <Text style={[styles.totalValue, billData.deliveryCharge === 0 && { color: Colors.color00C473, fontWeight: '700' }]}>
                  {billData.deliveryCharge === 0 ? 'FREE' : `₹${billData.deliveryCharge}`}
                </Text>
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
  billTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  billHeaderMedicine: {
    flex: 2,
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
  },
  billHeaderQty: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
  },
  billHeaderPrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
  },
  itemsList: {
    maxHeight: 150,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#444',
    flex: 2,
    marginRight: 8,
  },
  itemQtyText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.color555,
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    color: Colors.color333,
    fontWeight: '500',
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
    color: '#444',
    fontWeight: '500',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderStyle: 'dashed',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  grandTotalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.color3C72F2,
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

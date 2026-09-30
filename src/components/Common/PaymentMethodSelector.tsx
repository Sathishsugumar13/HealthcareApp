import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onSelect: (id: string) => void;
}

export default function PaymentMethodSelector({ methods, selectedMethod, onSelect }: PaymentMethodSelectorProps) {
  return (
    <View>
      <Text style={styles.methodTitle}>Select Payment Method</Text>

      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.methodCardSelected,
          ]}
          onPress={() => onSelect(method.id)}
        >
          <View style={styles.methodIcon}>
            <MaterialCommunityIcons 
              name={method.icon} 
              size={24} 
              color={selectedMethod === method.id ? Colors.color3C72F2 : Colors.color666} 
            />
          </View>
          <Text style={[
            styles.methodText,
            selectedMethod === method.id && styles.methodTextSelected
          ]}>
            {method.name}
          </Text>
          {selectedMethod === method.id && (
            <MaterialCommunityIcons name="check-circle" size={24} color={Colors.color3C72F2} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});

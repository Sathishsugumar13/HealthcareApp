import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface DropdownItem {
  id: string;
  name: string;
}

interface ReusableDropdownModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  data: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
}

export default function ReusableDropdownModal({ 
  isVisible, 
  onClose, 
  title, 
  data, 
  onSelect 
}: ReusableDropdownModalProps) {
  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={Colors.color333} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalListItem} onPress={() => onSelect(item)}>
                <Text style={styles.modalListItemText}>{item.name}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.colorCCC} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.modalEmptyText}>No items found.</Text>}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay50,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.colorFFF,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.colorEAEAEA,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  modalListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorF0F0F0,
  },
  modalListItemText: {
    fontSize: 16,
    color: Colors.color333,
  },
  modalEmptyText: {
    textAlign: 'center',
    color: Colors.color888,
    marginTop: 20,
    fontSize: 16,
  }
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface DropdownItem {
  label: string;
  value: string | null;
  icon?: string;
}

interface DropdownProps {
  data: DropdownItem[];
  value: string | null;
  onSelect: (value: string | null) => void;
  placeholder?: string;
}

export default function Dropdown({ data, value, onSelect, placeholder = 'Select...' }: DropdownProps) {
  const [visible, setVisible] = useState(false);

  const selectedItem = data.find(item => item.value === value) || data[0]; // fallback to first item

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setVisible(!visible)} 
        activeOpacity={0.7}
      >
        <View style={styles.dropdownButtonContent}>
          {selectedItem.icon && (
            <MaterialCommunityIcons name={selectedItem.icon} size={16} color="#333" style={{ marginRight: 6 }} />
          )}
          <Text style={styles.dropdownButtonText}>{selectedItem.label}</Text>
        </View>
        <MaterialCommunityIcons name={visible ? "chevron-up" : "chevron-down"} size={20} color="#666" style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.dropdownMenuItem, item.value === value && styles.dropdownMenuItemActive]}
                onPress={() => {
                  onSelect(item.value);
                  setVisible(false);
                }}
              >
                {item.icon && (
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={18} 
                    color={item.value === value ? "#4A80F0" : "#555"} 
                    style={{ marginRight: 8 }} 
                  />
                )}
                <Text style={[styles.dropdownMenuItemText, item.value === value && styles.dropdownMenuItemTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 16,
    marginTop: 5,
    minWidth: 180,
    backgroundColor: '#FFF',
    borderRadius: 8,
    maxHeight: 250,
    paddingVertical: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownMenuItemActive: {
    backgroundColor: '#F0F5FF',
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownMenuItemTextActive: {
    color: '#4A80F0',
    fontWeight: '600',
  }
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

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

  const selectedItem = data.find(item => item.value === value) || data[0]; 

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setVisible(!visible)} 
        activeOpacity={0.7}
      >
        <View style={styles.dropdownButtonContent}>
          {selectedItem.icon && (
            <MaterialCommunityIcons name={selectedItem.icon} size={16} color={Colors.color333} style={styles.inlineMarginright6} />
          )}
          <Text style={styles.dropdownButtonText}>{selectedItem.label}</Text>
        </View>
        <MaterialCommunityIcons name={visible ? "chevron-up" : "chevron-down"} size={20} color={Colors.color666} style={styles.inlineMarginleft8} />
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
                    color={item.value === value ? Colors.color4A80F0 : Colors.color555} 
                    style={styles.inlineMarginright8} 
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
  inlineMarginright6: { marginRight: 6 },
  inlineMarginleft8: { marginLeft: 8 },
  inlineMarginright8: { marginRight: 8 },

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
    backgroundColor: Colors.colorFFF,
    borderWidth: 1,
    borderColor: Colors.colorE0E0E0,
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
    color: Colors.color333,
    fontWeight: '500',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 16,
    marginTop: 5,
    minWidth: 180,
    backgroundColor: Colors.colorFFF,
    borderRadius: 8,
    maxHeight: 250,
    paddingVertical: 4,
    elevation: 10,
    shadowColor: Colors.color000,
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
    backgroundColor: Colors.colorF0F5FF,
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: Colors.color333,
  },
  dropdownMenuItemTextActive: {
    color: Colors.color4A80F0,
    fontWeight: '600',
  }
});

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface CustomDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export default function CustomDropdown({ label, value, options, onSelect, placeholder, disabled = false }: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<any>({});
  const buttonRef = useRef<TouchableOpacity>(null);

  const openDropdown = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      const screenHeight = Dimensions.get('window').height;
      const spaceBelow = screenHeight - (py + height);
      
      // If space below is less than maxHeight (220) and space above is greater than space below
      if (spaceBelow < 220 && py > spaceBelow) {
        // Open upwards
        setDropdownStyle({ bottom: screenHeight - py + 1, left: px, width: width });
      } else {
        // Open downwards
        setDropdownStyle({ top: py + height - 1, left: px, width: width });
      }
      
      setModalVisible(true);
    });
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        ref={buttonRef}
        style={[styles.dropdownButton, disabled && { opacity: 0.5, backgroundColor: '#F0F0F0' }]}
        onPress={openDropdown}
        disabled={disabled}
      >
        <Text style={[styles.dropdownButtonText, !value && { color: Colors.colorA0AAB5 }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down-outline" size={18} color={Colors.color555} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.dropdownMenu, dropdownStyle]}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.optionItem, value === item && styles.optionItemSelected]}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, value === item && styles.optionTextSelected]}>{item}</Text>
                  {value === item && <Ionicons name="checkmark-circle" size={18} color={Colors.color3C72F2} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // removed margin as it is handled by parent row
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.color555,
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.white,
    height: 48,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: Colors.color333,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorF5F5F5,
  },
  optionItemSelected: {
    backgroundColor: '#F0F5FF',
  },
  optionText: {
    fontSize: 14,
    color: Colors.color333,
  },
  optionTextSelected: {
    color: Colors.color3C72F2,
    fontWeight: '600',
  },
});

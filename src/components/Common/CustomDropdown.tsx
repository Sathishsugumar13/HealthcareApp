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
  leftIcon?: React.ReactNode;
  centered?: boolean;
  highlightSelected?: boolean;
  variant?: 'default' | 'pill';
  menuMaxHeight?: number;
}

export default function CustomDropdown({ label, value, options, onSelect, placeholder, disabled = false, leftIcon, centered = false, highlightSelected = false, variant = 'default', menuMaxHeight = 350 }: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<any>({});
  const buttonRef = useRef<any>(null);

  const openDropdown = () => {
    buttonRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      const screenHeight = Dimensions.get('window').height;
      const spaceBelow = screenHeight - (py + height);
      
      // If space below is less than maxHeight and space above is greater than space below
      if (spaceBelow < menuMaxHeight && py > spaceBelow) {
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
        style={[
          styles.dropdownButton, 
          variant === 'pill' && { borderRadius: 30, backgroundColor: '#F8F9FA', borderWidth: 0, height: 56 },
          disabled && { opacity: 0.5, backgroundColor: '#F0F0F0' },
          highlightSelected && value ? { 
            backgroundColor: variant === 'pill' ? '#EBF1FF' : '#F0F5FF', 
            borderColor: Colors.color3C72F2, 
            borderWidth: variant === 'pill' ? 0 : 1.5 
          } : null
        ]}
        onPress={openDropdown}
        disabled={disabled}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
          {leftIcon && <View style={{ marginRight: 10 }}>{leftIcon}</View>}
          <Text numberOfLines={1} style={[
            styles.dropdownButtonText, 
            variant === 'pill' && { fontSize: 16 },
            !value && { color: Colors.secondaryText }, 
            { flex: 1 }, 
            centered && { textAlign: 'center' },
            highlightSelected && value ? { color: Colors.color3C72F2, fontWeight: 'bold' } : null
          ]}>
            {value || placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down-outline" size={18} color={highlightSelected && value ? Colors.color3C72F2 : Colors.color555} />
      </TouchableOpacity>

      {modalVisible && (
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
          <View style={[
            styles.dropdownMenu, 
            dropdownStyle, 
            variant === 'pill' && { paddingVertical: 8, borderRadius: 16 },
            { maxHeight: menuMaxHeight }
          ]}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem, 
                    variant === 'pill' && { borderBottomWidth: 0, borderRadius: 24, marginHorizontal: 8, marginVertical: 2, paddingVertical: 10 },
                    value === item && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, value === item && styles.optionTextSelected, centered && { textAlign: 'center', flex: 1 }, variant === 'pill' && { fontSize: 16 }]}>{item}</Text>
                  {value === item && !centered && <Ionicons name="checkmark-circle" size={18} color={Colors.color3C72F2} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      )}
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
    borderRadius: 12,
    padding: 12,
    backgroundColor: Colors.white,
    height: 50,
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

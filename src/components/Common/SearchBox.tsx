import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
}

export default function SearchBox({
  value,
  onChangeText,
  placeholder = "Search...",
  style,
  iconFamily = 'Ionicons'
}: SearchBoxProps) {
  return (
    <View style={[styles.searchContainer, style]}>
      {iconFamily === 'Ionicons' ? (
        <Ionicons name="search-outline" size={20} color={Colors.secondaryText} style={styles.searchIcon} />
      ) : (
        <MaterialCommunityIcons name="magnify" size={24} color={Colors.secondaryText} style={styles.searchIcon} />
      )}
      
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.secondaryText}
        value={value}
        onChangeText={onChangeText}
      />
      
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearIcon}>
          <MaterialCommunityIcons name="close-circle" size={20} color={Colors.secondaryText} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.colorE0E0E0,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.color333,
  },
  clearIcon: {
    padding: 4,
  }
});

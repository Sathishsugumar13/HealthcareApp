import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        <Ionicons name="search-outline" size={20} color="#A0A0A0" style={styles.searchIcon} />
      ) : (
        <MaterialCommunityIcons name="magnify" size={24} color="#A0A0A0" style={styles.searchIcon} />
      )}
      
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        value={value}
        onChangeText={onChangeText}
      />
      
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearIcon}>
          <MaterialCommunityIcons name="close-circle" size={20} color="#A0A0A0" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  clearIcon: {
    padding: 4,
  }
});

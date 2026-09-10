import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../theme/colors';

interface Props {
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function HomeSearchBar({ searchText, setSearchText }: Props) {
  return (
    <View style={styles.searchContainer}>
      <MaterialCommunityIcons name="magnify" size={24} color="#A0A0A0" style={styles.searchIcon} />
      <TextInput 
        style={styles.searchInput}
        placeholder="Search doctor, drugs, articles..."
        placeholderTextColor="#A0A0A0"
        value={searchText}
        onChangeText={setSearchText}
      />
      {searchText.length > 0 && (
        <Pressable onPress={() => setSearchText('')} style={{ padding: 4 }}>
          <MaterialCommunityIcons name="close-circle" size={20} color="#A0A0A0" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
});

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/Common/BackButton';
import { Colors } from '../theme/colors';

export default function MyDetailsScreen() {
  const navigation = useNavigation<any>();
  const [persons, setPersons] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchPersons = async () => {
        try {
          const data = await AsyncStorage.getItem('my_details_list');
          if (data) {
            setPersons(JSON.parse(data));
          }
        } catch (error) {
          console.error("Error fetching details list", error);
        }
      };
      fetchPersons();
    }, [])
  );

  const deletePerson = async (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to remove this person?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = persons.filter(p => p.id !== id);
            await AsyncStorage.setItem('my_details_list', JSON.stringify(updated));
            setPersons(updated);
          } catch (e) {
            console.error(e);
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>My Details</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {persons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color={Colors.colorA0AAB5} />
            <Text style={styles.emptyText}>No persons added yet.</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {persons.map((person) => (
              <View key={person.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={20} color={Colors.primary} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.cardName}>{person.name}</Text>
                      {person.bloodGroup ? <Text style={styles.cardBlood}>Blood: {person.bloodGroup}</Text> : null}
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('AddPerson', { editPerson: person })} style={{ marginRight: 16 }}>
                      <Ionicons name="pencil-outline" size={20} color={Colors.color3C72F2} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deletePerson(person.id)}>
                      <Ionicons name="trash-outline" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.cardDivider} />
                
                <View style={styles.cardInfoRow}>
                  <Ionicons name="call-outline" size={16} color={Colors.color666} />
                  <Text style={styles.cardInfoText}>{person.phone}</Text>
                </View>
                
                {person.city ? (
                  <View style={[styles.cardInfoRow, { marginTop: 6 }]}>
                    <Ionicons name="location-outline" size={16} color={Colors.color666} />
                    <Text style={styles.cardInfoText}>{person.city}, {person.stateName}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate('AddPerson')}
          >
            <Ionicons name="add-circle-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>Add Person</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.colorF8F9FA },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.color101623,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.colorA0AAB5,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.color101623,
  },
  cardBlood: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.color555,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  }
});

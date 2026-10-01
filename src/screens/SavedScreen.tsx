import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/Common/BackButton';
import { Colors } from '../theme/colors';



export default function SavedScreen() {
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await AsyncStorage.getItem('@saved_articles');
        if (data) {
          setSavedItems(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchSaved();
  }, []);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>My Saved</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={60} color={Colors.colorA0AAB5} />
            <Text style={styles.emptyText}>You haven't saved anything yet.</Text>
          </View>
        ) : (
          savedItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.savedCard}>
              <Image source={typeof (item.imageSource || item.image) === 'number' ? (item.imageSource || item.image) : { uri: item.imageSource || item.image }} style={styles.savedImage} />
              <View style={styles.savedDetails}>
                <View style={styles.savedHeader}>
                  <Text style={styles.savedType}>{item.type}</Text>
                  <Ionicons name="bookmark" size={22} color={Colors.color3C72F2} />
                </View>
                <Text style={styles.savedName}>{item.name}</Text>
                
                {item.type === 'Doctor' ? (
                  <>
                    <Text style={styles.savedSubText}>{item.specialty} • {item.hospital}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.savedSubText}>{item.author}</Text>
                    <Text style={styles.savedSubText2}>{item.readTime}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.color333 },
  content: { flex: 1, padding: 20 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, color: Colors.color666 },
  savedCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  savedImage: { width: 80, height: 80, borderRadius: 12, marginRight: 16 },
  savedDetails: { flex: 1, justifyContent: 'center' },
  savedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  savedType: { fontSize: 12, fontWeight: '600', color: Colors.color3C72F2, textTransform: 'uppercase' },
  savedName: { fontSize: 16, fontWeight: 'bold', color: Colors.color333, marginBottom: 4 },
  savedSubText: { fontSize: 13, color: Colors.color666, marginBottom: 4 },
  savedSubText2: { fontSize: 12, color: Colors.colorA0AAB5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '600', color: Colors.color333, marginLeft: 4 },
});

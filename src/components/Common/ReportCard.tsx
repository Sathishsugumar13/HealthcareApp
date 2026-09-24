import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export interface Report {
  id: number;
  title: string;
  date: string;
}

interface ReportCardProps {
  item: Report;
  onPress?: () => void;
}

export default function ReportCard({ item, onPress }: ReportCardProps) {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name="clipboard-pulse-outline" size={20} color="#5D85CE" />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.title}</Text>
        <Text style={{ color: 'gray', fontSize: 13, marginTop: 2 }}>{item.date}</Text>
      </View>
      
      <View>
        <Feather name="more-horizontal" size={20} color="black" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#EEF3FF',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  }
});

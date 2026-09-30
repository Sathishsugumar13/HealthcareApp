import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

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
        <MaterialCommunityIcons name="clipboard-pulse-outline" size={20} color={Colors.color5D85CE} />
      </View>
      
      <View style={styles.flex1}>
        <Text style={styles.inlineFontweightBoldFontsize15}>{item.title}</Text>
        <Text style={styles.inlineColorGrayFontsize13Margi}>{item.date}</Text>
      </View>
      
      <View>
        <Feather name="more-horizontal" size={20} color="black" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  inlineFontweightBoldFontsize15: { fontWeight: 'bold', fontSize: 15 },
  inlineColorGrayFontsize13Margi: { color: Colors.gray, fontSize: 13, marginTop: 2 },

  listItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.colorCCC,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: Colors.colorEEF3FF,
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  }
});

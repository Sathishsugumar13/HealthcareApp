import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NotificationCardProps {
  item: any;
  isUnread: boolean;
  onPress: (item: any, isUnread: boolean) => void;
}

export default function NotificationCard({ item, isUnread, onPress }: NotificationCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.notiBox, !isUnread && styles.notiBoxRead]} 
      key={item.request.identifier}
      onPress={() => onPress(item, isUnread)}
      activeOpacity={0.7}
    >
      {item.request.content.title && (
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: isUnread ? '#333' : '#777', marginBottom: 4 }}>
          {item.request.content.title}
        </Text>
      )}
      <Text style={{ fontSize: 16, color: isUnread ? '#555' : '#888' }} numberOfLines={2}>
        {item.request.content.body}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notiBox: {
    padding: 15,
    backgroundColor: '#EEF3FF',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0E3F0'
  },
  notiBoxRead: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0'
  },
});

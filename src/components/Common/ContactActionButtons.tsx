import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';

interface ContactActionButtonsProps {
  recipientName: string;
  phoneNumber?: string;
}

export default function ContactActionButtons({ recipientName, phoneNumber }: ContactActionButtonsProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.contactButtonsRow}>
      <TouchableOpacity 
        style={[styles.contactButton, { backgroundColor: Colors.colorE8F0FE, borderColor: Colors.colorE8F0FE, marginRight: 4 }]}
        onPress={() => navigation.navigate('Chat', { recipientName })}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.color1A73E8} />
        <Text style={[styles.contactButtonText, { color: Colors.color1A73E8 }]}>Message</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.contactButton, { backgroundColor: Colors.colorE6F4EA, borderColor: Colors.colorE6F4EA, marginHorizontal: 4 }]}
        onPress={() => {
          if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
          } else {
            Alert.alert('Calling', `Dialing ${recipientName}...`);
          }
        }}
      >
        <Ionicons name="call-outline" size={18} color={Colors.color137333} />
        <Text style={[styles.contactButtonText, { color: Colors.color137333 }]}>Call</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.contactButton, { backgroundColor: '#FCE8E6', borderColor: '#FCE8E6', marginLeft: 4 }]}
        onPress={() => Alert.alert('Video Call', `Starting video call with ${phoneNumber || recipientName}...`)}
      >
        <Ionicons name="videocam-outline" size={18} color="#D93025" />
        <Text style={[styles.contactButtonText, { color: '#D93025' }]}>Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contactButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

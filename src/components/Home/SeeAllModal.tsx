import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface SeeAllModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SeeAllModal({ visible, onClose, title, children }: SeeAllModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.listModalOverlay}>
        <View style={styles.listModalContent}>
          <View style={styles.listModalHeader}>
            <Text style={styles.listModalTitle}>{title}</Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </Pressable>
          </View>
          <ScrollView style={styles.listModalScroll}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  listModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  listModalContent: {
    width: '100%',
    height: '80%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  listModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listModalScroll: {
    flex: 1,
  },
});

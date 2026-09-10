/**
 * Component: SuccessModal
 * Originally created for: Common use across auth screens (SignUp, ForgotPassword)
 * Usage: Modal to show success messages
 */
import React from 'react';
import { Colors } from '../../theme/colors';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({
  visible,
  title,
  message,
  onClose
}: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Feather name="check" size={40} color={Colors.success} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable 
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

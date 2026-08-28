import { Colors } from '../../theme/colors';
import { Modal, View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './SuccessModal.styles';

export default function SuccessModal({
  visible,
  title,
  message,
  onClose
}: any) {
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
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

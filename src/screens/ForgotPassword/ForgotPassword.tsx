import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import { styles } from './ForgotPassword.styles';
import SuccessModal from '../../components/SuccessModal/SuccessModal';

export default function ForgotPassword({ back, onSend }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const sendLink = async () => {
    setErrorMessage('');

    let missingFields = [];
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!confirm) missingFields.push('confirm');

    if (missingFields.length === 3) {
      setErrorMessage('Please enter your registered email id and new password.');
      return;
    }

    if (missingFields.length > 1) {
      setErrorMessage('Please enter remaining mandatory fields.');
      return;
    }

    if (missingFields.length === 1) {
      const field = missingFields[0];
      if (field === 'email') setErrorMessage('Please enter your email id.');
      else if (field === 'password') setErrorMessage('Please enter a new password.');
      else if (field === 'confirm') setErrorMessage('Please confirm your new password.');
      return;
    }
    
    if (password !== confirm) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    let storedUserStr = null;
    if (Platform.OS === 'web') {
      try {
        storedUserStr = window.sessionStorage.getItem('user');
      } catch (e) {
        console.error(e);
      }
    } else {
      storedUserStr = await AsyncStorage.getItem('user');
    }

    if (!storedUserStr) {
      setErrorMessage('No account found. Please sign up first.');
      return;
    }

    const storedUser = JSON.parse(storedUserStr);

    if (storedUser.email !== email) {
      setErrorMessage('Entered email id does not match the registered account.');
      return;
    }

    const updatedUser = { ...storedUser, password };

    if (Platform.OS === 'web') {
      try {
        window.sessionStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }

    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onSend) onSend();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SuccessModal 
        visible={showSuccess}
        title="Password Reset"
        message="Your password has been changed successfully. You can now login with your new password."
        onClose={handleSuccessClose}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.header}>
          <Pressable onPress={back} style={styles.backBtn}>
            <Feather name="chevron-left" size={32} color={Colors.text} />
          </Pressable>
          <Text style={styles.heading}>Reset Password</Text>
          <View style={styles.backBtn} />
        </View>

        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <Text style={styles.description}>
          Enter your registered email id and create a new password.
        </Text>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color={Colors.secondaryText} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your Gmail ID"
            placeholderTextColor={Colors.secondaryText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color={Colors.secondaryText} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={Colors.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <Pressable onPress={() => setShowPass(!showPass)}>
            <Feather name={showPass ? 'eye' : 'eye-off'} size={20} color={Colors.secondaryText} />
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color={Colors.secondaryText} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={Colors.secondaryText}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
          />
          <Pressable onPress={() => setShowConfirm(!showConfirm)}>
            <Feather name={showConfirm ? 'eye' : 'eye-off'} size={20} color={Colors.secondaryText} />
          </Pressable>
        </View>

        <Pressable style={styles.button} onPress={sendLink}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

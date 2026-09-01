import { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import CustomInput from '../../components/SignIn/CustomInput';
import PrimaryButton from '../../components/Common/PrimaryButton';
import SuccessModal from '../../components/Common/SuccessModal';

export default function ForgotPassword({ back, onSend }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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
        
        <Header title="Reset Password" onBackPress={back} />

        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <Text style={styles.description}>
          Enter your registered email id and create a new password.
        </Text>

        <CustomInput
          icon="mail"
          placeholder="Enter your Gmail ID"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          icon="lock"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
        />

        <CustomInput
          icon="lock"
          placeholder="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          isPassword={true}
        />

        <PrimaryButton 
          title="Reset Password" 
          onPress={sendLink} 
          style={{ marginTop: 10 }} // Adjusted margin to visually compensate for original spacing difference
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 25,
  },
  contentContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 30,
    textAlign: 'center',
  },
});

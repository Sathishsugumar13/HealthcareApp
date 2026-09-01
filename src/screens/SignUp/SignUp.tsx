import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import CustomInput from '../../components/SignIn/CustomInput';
import PrimaryButton from '../../components/Common/PrimaryButton';
import TermsCheckbox from '../../components/SignUp/TermsCheckbox';
import SuccessModal from '../../components/Common/SuccessModal';
import AuthBottomLink from '../../components/Common/AuthBottomLink';

export default function SignUp({ back, onSuccess, onSignIn }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const signup = async () => {
    setErrorMessage(''); // Clear previous error

    let missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!confirm) missingFields.push('confirm');
    if (!agree) missingFields.push('terms');

    if (missingFields.length === 5) {
      setErrorMessage('Please enter all mandatory fields.');
      return;
    }

    if (missingFields.length > 1) {
      setErrorMessage('Please enter remaining mandatory fields.');
      return;
    }

    if (missingFields.length === 1) {
      const field = missingFields[0];
      if (field === 'name') setErrorMessage('Please enter your name.');
      else if (field === 'email') setErrorMessage('Please enter your email id.');
      else if (field === 'password') setErrorMessage('Please enter a password.');
      else if (field === 'confirm') setErrorMessage('Please confirm your password.');
      else if (field === 'terms') setErrorMessage('Please accept the terms & conditions.');
      return;
    }

    if (password !== confirm) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const user = { name, email, password };

    if (Platform.OS === 'web') {
      try {
        window.sessionStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error('Session storage error', e);
      }
    } else {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }

    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onSuccess) onSuccess();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SuccessModal 
        visible={showSuccess}
        title="Account Created!"
        message="Your account has been successfully created. You can now sign in."
        onClose={handleSuccessClose}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
      >
        <Header title="Sign Up" onBackPress={back} />

        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <CustomInput
          icon="user"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <CustomInput
          icon="mail"
          placeholder="Enter your email id"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          icon="lock"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
        />

        <CustomInput
          icon="lock"
          placeholder="Confirm your password"
          value={confirm}
          onChangeText={setConfirm}
          isPassword={true}
        />

        <TermsCheckbox 
          agree={agree}
          onToggle={() => setAgree(!agree)}
        />

        <View style={styles.spacer} />

        <PrimaryButton 
          title="Sign Up" 
          onPress={signup} 
          style={{ marginTop: 30 }}
        />

        <AuthBottomLink 
          text="Already have an account? " 
          linkText="Sign In" 
          onPress={onSignIn} 
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
  spacer: {
    flex: 1,
    minHeight: 40,
  },
});

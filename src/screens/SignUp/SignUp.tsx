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
import { styles } from './SignUp.styles';
import SuccessModal from '../../components/SuccessModal/SuccessModal';

export default function SignUp({ back, onSuccess, onSignIn }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
        <View style={styles.header}>
          <Pressable onPress={back} style={styles.backBtn}>
            <Feather name="chevron-left" size={32} color={Colors.text} />
          </Pressable>
          <Text style={styles.heading}>Sign Up</Text>
          <View style={styles.backBtn} />
        </View>

        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color={Colors.secondaryText} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={Colors.secondaryText}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color={Colors.secondaryText} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email id"
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
            placeholder="Enter your password"
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
            placeholder="Confirm your password"
            placeholderTextColor={Colors.secondaryText}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
          />
          <Pressable onPress={() => setShowConfirm(!showConfirm)}>
            <Feather name={showConfirm ? 'eye' : 'eye-off'} size={20} color={Colors.secondaryText} />
          </Pressable>
        </View>

        <Pressable style={styles.terms} onPress={() => setAgree(!agree)}>
          <View style={[styles.checkbox, agree && styles.checkboxActive]}>
            {agree && <Feather name="check" size={14} color={Colors.white} />}
          </View>
          <Text style={styles.termsText}>
            I agree to the healthcare{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </Pressable>

        <View style={styles.spacer} />

        <Pressable style={styles.button} onPress={signup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <View style={styles.signin}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <Pressable onPress={onSignIn}>
            <Text style={styles.link}>Sign In</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

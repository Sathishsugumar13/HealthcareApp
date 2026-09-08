import { useState } from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../theme/colors';

import CustomInput from '../../SignIn/CustomInput';
import PrimaryButton from '../../Common/PrimaryButton';

export default function ForgotRegisterEmailId(props: any) {
  // state for forgot email
  const [emailValue, setEmailValue] = useState('');
  const [errorText, setErrorText] = useState('');

  // run when continue button clicked
  const handleContinueClick = async () => {
    setErrorText('');

    if (emailValue === '') {
      setErrorText('Please enter your email id.');
    } else {
      let savedUserString = await AsyncStorage.getItem('user');

      if (savedUserString === null) {
        setErrorText('No account found. Please sign up first.');
      } else {
        const savedUserObject = JSON.parse(savedUserString);
        if (savedUserObject.email !== emailValue) {
          setErrorText('Entered email id does not match the registered account.');
        } else {
          // move to otp step
          console.log("Email match found!");
          props.onSuccess(emailValue);
        }
      }
    }
  };

  return (
    <>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>Enter your email to receive an OTP.</Text>

      {errorText !== '' ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}

      <CustomInput
        icon="mail"
        placeholder="Enter your email id"
        value={emailValue}
        onChangeText={(text: string) => setEmailValue(text)}
        keyboardType="email-address"
      />

      <View style={styles.spacer} />

      <PrimaryButton 
        title="Continue" 
        onPress={handleContinueClick} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginBottom: 30,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  spacer: {
    height: 40,
  },
});

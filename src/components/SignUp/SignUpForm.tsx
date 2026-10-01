import { useState } from 'react';
import { Text, View, Platform, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/colors';

import CustomInput from '../SignIn/CustomInput';
import CustomButton from '../Common/CustomButton';
import TermsCheckbox from './TermsCheckbox';
import PasswordValidator from '../Common/PasswordValidator';

export default function SignUpForm(props: any) {
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Password condition checks for display and validation
  let hasCapitalLetter = false;
  let hasSmallLetter = false;
  let hasNumber = false;
  let hasSpecialCharacter = false;
  let isValidLength = false;

  if (userPassword.length >= 8 && userPassword.length <= 15) {
    isValidLength = true;
  }

  // Simple loop to check characters
  for (let i = 0; i < userPassword.length; i++) {
    let char = userPassword[i];
    if (char >= 'A' && char <= 'Z') {
      hasCapitalLetter = true;
    } else if (char >= 'a' && char <= 'z') {
      hasSmallLetter = true;
    } else if (char >= '0' && char <= '9') {
      hasNumber = true;
    } else {
      hasSpecialCharacter = true;
    }
  }

  
  const handleSignUpClick = async () => {
    
    setErrorText(''); 

    // check if all fields are filled
    if (userName === '') {
      setErrorText('Please enter your name.');
    } else if (userEmail === '') {
      setErrorText('Please enter your email id.');
    } else if (userPassword === '') {
      setErrorText('Please enter a password.');
    } else if (isValidLength === false) {
      setErrorText('Password must be between 8 to 15 letters.');
    } else if (hasCapitalLetter === false) {
      setErrorText('Password must have at least one capital letter.');
    } else if (hasSmallLetter === false) {
      setErrorText('Password must have at least one small letter.');
    } else if (hasNumber === false) {
      setErrorText('Password must have at least one number.');
    } else if (hasSpecialCharacter === false) {
      setErrorText('Password must have at least one special character.');
    } else if (confirmPassword === '') {
      setErrorText('Please confirm your password.');
    } else if (isTermsAgreed === false) {
      setErrorText('Please accept the terms & conditions.');
    } else if (userPassword !== confirmPassword) {
      setErrorText('Passwords do not match.');
    } else {
      // create a user object
      const newUser = {
        name: userName,
        email: userEmail,
        password: userPassword
      };

      // save to storage based on platform
      if (Platform.OS === 'web') {
        window.sessionStorage.setItem('user', JSON.stringify(newUser));
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      }

      console.log("Account created successfully!");
      
      
      props.onSuccess();
    }
  };

  return (
    <>
      {errorText !== '' ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}

      <CustomInput
        icon="person-outline"
        placeholder="Enter your name"
        value={userName}
        onChangeText={(text: string) => setUserName(text)}
      />

      <CustomInput
        icon="mail-outline"
        placeholder="Enter your email id"
        value={userEmail}
        onChangeText={(text: string) => setUserEmail(text)}
        keyboardType="email-address"
      />

      <CustomInput
        icon="lock-closed-outline"
        placeholder="Enter your password"
        value={userPassword}
        onChangeText={(text: string) => setUserPassword(text)}
        isPassword={true}
      />

      <CustomInput
        icon="lock-closed-outline"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={(text: string) => setConfirmPassword(text)}
        isPassword={true}
      />

      <TermsCheckbox 
        agree={isTermsAgreed}
        onToggle={() => {
          if (isTermsAgreed === true) {
            setIsTermsAgreed(false);
          } else {
            setIsTermsAgreed(true);
          }
        }}
      />

      <View style={styles.spacer} />

      
      <PasswordValidator 
        isValidLength={isValidLength}
        hasCapitalLetter={hasCapitalLetter}
        hasSmallLetter={hasSmallLetter}
        hasNumber={hasNumber}
        hasSpecialCharacter={hasSpecialCharacter}
      />

      <CustomButton 
        title="Sign Up" 
        onPress={handleSignUpClick} 
        style={styles.inlineMargintop10}
      />

      <View style={styles.authLinkContainer}>
        <Text style={styles.authBottomText}>Already have an account? </Text>
        <Pressable onPress={props.onSignIn}>
          <Text style={styles.authLink}>Sign In</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inlineMargintop10: { marginTop: 10 },

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
  authLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40, 
  },
  authBottomText: {
    fontSize: 15,
    color: Colors.text,
  },
  authLink: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});


import { useState } from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../theme/colors';

import CustomInput from '../../SignIn/CustomInput';
import PrimaryButton from '../../Common/PrimaryButton';
import TermsCheckbox from '../TermsCheckbox';
import AuthBottomLink from '../../Common/AuthBottomLink';

export default function SignUpForm(props: any) {
  // states for storing user inputs
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [errorText, setErrorText] = useState('');

  // function to run when sign up is clicked
  const handleSignUpClick = async () => {
    // clear any previous error
    setErrorText(''); 

    // check if all fields are filled
    if (userName === '') {
      setErrorText('Please enter your name.');
    } else if (userEmail === '') {
      setErrorText('Please enter your email id.');
    } else if (userPassword === '') {
      setErrorText('Please enter a password.');
    } else if (confirmPassword === '') {
      setErrorText('Please confirm your password.');
    } else if (isTermsAgreed === false) {
      setErrorText('Please accept the terms & conditions.');
    } else {
      // check if passwords match
      if (userPassword !== confirmPassword) {
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
        
        // call the success function from parent
        props.onSuccess();
      }
    }
  };

  return (
    <>
      {errorText !== '' ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}

      <CustomInput
        icon="user"
        placeholder="Enter your name"
        value={userName}
        onChangeText={(text: string) => setUserName(text)}
      />

      <CustomInput
        icon="mail"
        placeholder="Enter your email id"
        value={userEmail}
        onChangeText={(text: string) => setUserEmail(text)}
        keyboardType="email-address"
      />

      <CustomInput
        icon="lock"
        placeholder="Enter your password"
        value={userPassword}
        onChangeText={(text: string) => setUserPassword(text)}
        isPassword={true}
      />

      <CustomInput
        icon="lock"
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

      <PrimaryButton 
        title="Sign Up" 
        onPress={handleSignUpClick} 
        style={{ marginTop: 30 }}
      />

      <AuthBottomLink 
        text="Already have an account? " 
        linkText="Sign In" 
        onPress={props.onSignIn} 
      />
    </>
  );
}

const styles = StyleSheet.create({
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

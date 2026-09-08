import { useState } from 'react';
import { Text, Pressable, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../theme/colors';

import CustomInput from '../CustomInput';
import PrimaryButton from '../../Common/PrimaryButton';
import Divider from '../Divider';
import SocialButton from '../SocialButton';
import AuthBottomLink from '../../Common/AuthBottomLink';

export default function SignInForm(props: any) {
  // state for login form
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // function when user clicks login button
  const handleLoginClick = async () => {
    // clear error first
    setErrorMsg(''); 

    // check if fields are empty
    if (emailValue === '' && passwordValue === '') {
      setErrorMsg('Please enter your email id and password.');
    } else if (emailValue === '') {
      setErrorMsg('Please enter your email id.');
    } else if (passwordValue === '') {
      setErrorMsg('Please enter your password.');
    } else {
      // both are entered, so check in local storage
      let savedUserString = null;
      
      if (Platform.OS === 'web') {
        savedUserString = window.sessionStorage.getItem('user');
      } else {
        savedUserString = await AsyncStorage.getItem('user');
      }

      // if no user is found
      if (savedUserString === null) {
        setErrorMsg('No account found. Please sign up first.');
      } else {
        // user is found, parse it
        const savedUserObject = JSON.parse(savedUserString);

        // check if email and password match
        if (savedUserObject.email !== emailValue || savedUserObject.password !== passwordValue) {
          setErrorMsg('Invalid Email id or Password.');
        } else {
          // login success
          console.log('Login success for user: ', savedUserObject.email);
          props.onLogin(savedUserObject);
        }
      }
    }
  };

  return (
    <>
      {errorMsg !== '' ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : null}

      <CustomInput
        icon="mail"
        placeholder="Enter your email id"
        value={emailValue}
        onChangeText={(text: string) => setEmailValue(text)}
        keyboardType="email-address"
      />

      <CustomInput
        icon="lock"
        placeholder="Enter your password"
        value={passwordValue}
        onChangeText={(text: string) => setPasswordValue(text)}
        isPassword={true}
      />

      <Pressable style={styles.forgot} onPress={props.onForgot}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </Pressable>

      <PrimaryButton title="Sign In" onPress={handleLoginClick} />

      <AuthBottomLink 
        text="Don't have an account? " 
        linkText="Sign up" 
        onPress={props.onSignUp} 
      />

      <Divider text="OR" />

      <SocialButton 
        title="Sign in with Google" 
        icon="google" 
        color="#DB4437" 
        provider="google"
      />

      <SocialButton 
        title="Sign in with Facebook" 
        icon="facebook" 
        color="#4267B2" 
        provider="facebook"
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
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

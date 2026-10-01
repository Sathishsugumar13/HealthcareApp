import { useState } from 'react';
import { Text, Pressable, Platform, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/colors';

import CustomInput from './CustomInput';
import CustomButton from '../Common/CustomButton';
import SocialButton from './SocialButton';

export default function SignInForm(props: any) {
  
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
      // getting user data
      let data = await AsyncStorage.getItem('user');
      savedUserString = data;

      
      if (savedUserString === null) {
        setErrorMsg('No account found. Please sign up first.');
      } else {
        
        const savedUserObject = JSON.parse(savedUserString);

        
        if (savedUserObject.email !== emailValue || savedUserObject.password !== passwordValue) {
          setErrorMsg('Invalid Email id or Password.');
        } else {
          
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
        icon="mail-outline"
        placeholder="Enter your email id"
        value={emailValue}
        onChangeText={(text: string) => setEmailValue(text)}
        keyboardType="email-address"
      />

      <CustomInput
        icon="lock-closed-outline"
        placeholder="Enter your password"
        value={passwordValue}
        onChangeText={(text: string) => setPasswordValue(text)}
        isPassword={true}
      />

      <Pressable style={styles.forgot} onPress={props.onForgot}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </Pressable>

      <CustomButton title="Sign In" onPress={handleLoginClick} />

      <View style={styles.authLinkContainer}>
        <Text style={styles.authBottomText}>Don't have an account? </Text>
        <Pressable onPress={props.onSignUp}>
          <Text style={styles.authLink}>Sign up</Text>
        </Pressable>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <SocialButton 
        title="Sign in with Google" 
        icon="google" 
        color={Colors.colorDB4437} 
        provider="google"
      />

      <SocialButton 
        title="Sign in with Facebook" 
        icon="facebook" 
        color={Colors.color4267B2} 
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
});


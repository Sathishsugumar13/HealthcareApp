import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Platform,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import CustomInput from '../../components/SignIn/CustomInput';
import PrimaryButton from '../../components/Common/PrimaryButton';
import Divider from '../../components/SignIn/Divider';
import SocialButton from '../../components/SignIn/SocialButton';
import AuthBottomLink from '../../components/Common/AuthBottomLink';

export default function SignIn(props: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const signin = async () => {
    setErrorMessage(''); // Clear previous error

    if (!email && !password) {
      setErrorMessage('Please enter your email id and password.');
      return;
    }

    if (!email) {
      setErrorMessage('Please enter your email id.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
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

    if (storedUser.email !== email || storedUser.password !== password) {
      setErrorMessage('Invalid Email id or Password.');
      return;
    }
    
    if (props.onLogin) {
      props.onLogin();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        <Header title="Sign In" onBackPress={props.back} />

        {!!errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

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

        <Pressable style={styles.forgot} onPress={props.onForgot}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <PrimaryButton title="Sign In" onPress={signin} />

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

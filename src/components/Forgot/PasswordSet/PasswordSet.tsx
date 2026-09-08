import { useState } from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../theme/colors';

import CustomInput from '../../SignIn/CustomInput';
import PrimaryButton from '../../Common/PrimaryButton';

export default function PasswordSet(props: any) {
  // states for password
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [errorText, setErrorText] = useState('');

  // run when change password is clicked
  const handleChangePasswordClick = async () => {
    setErrorText('');

    if (newPasswordValue === '') {
      setErrorText('Please enter a new password.');
    } else if (confirmPasswordValue === '') {
      setErrorText('Please confirm your new password.');
    } else {
      if (newPasswordValue !== confirmPasswordValue) {
        setErrorText('Passwords do not match.');
      } else {
        // save new password
        let savedUserString = null;
        // getting user data
        let data = await AsyncStorage.getItem('user');
        savedUserString = data;

        if (savedUserString === null) {
          setErrorText('No user found to update password.');
        } else {
          let savedUserObject = JSON.parse(savedUserString);
          
          // update password property
          savedUserObject.password = newPasswordValue;

          // save it back
          if (Platform.OS === 'android') {
            window.sessionStorage.setItem('user', JSON.stringify(savedUserObject));
          } else {
            await AsyncStorage.setItem('user', JSON.stringify(savedUserObject));
          }

          console.log('Password successfully updated!');
          props.onSuccess();
        }
      }
    }
  };

  return (
    <>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Create a new password for your account.</Text>

      {errorText !== '' ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}

      <CustomInput
        icon="lock"
        placeholder="New password"
        value={newPasswordValue}
        onChangeText={(text: string) => setNewPasswordValue(text)}
        isPassword={true}
      />

      <CustomInput
        icon="lock"
        placeholder="Confirm password"
        value={confirmPasswordValue}
        onChangeText={(text: string) => setConfirmPasswordValue(text)}
        isPassword={true}
      />

      <View style={styles.spacer} />

      <PrimaryButton 
        title="Change Password" 
        onPress={handleChangePasswordClick} 
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

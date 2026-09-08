import { useState, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '../../../theme/colors';

import PrimaryButton from '../../Common/PrimaryButton';

export default function ForgotOtp(props: any) {
  // state to store the otp typed by user
  const [otpValue, setOtpValue] = useState('');
  const [errorText, setErrorText] = useState('');

  // reference to the hidden input box
  const hiddenInputRef = useRef<TextInput>(null);

  // run when continue is clicked
  const handleVerifyClick = () => {
    setErrorText('');

    if (otpValue === '') {
      setErrorText('Please enter the OTP.');
    } else if (otpValue.length < 6) {
      setErrorText('OTP must be 6 digits.');
    } else {
      // success
      console.log('OTP verified successfully!');
      props.onSuccess();
    }
  };

  // create an array of 6 empty spaces for the boxes
  const boxArray = [0, 1, 2, 3, 4, 5];

  return (
    <>
      <Text style={styles.title}>Enter OTP</Text>
      
      {props.email ? (
        <Text style={styles.subtitle}>OTP sent to {props.email}</Text>
      ) : (
        <Text style={styles.subtitle}>Enter the OTP sent to your email.</Text>
      )}

      {errorText !== '' ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}

      {/* When user clicks the boxes, open the keyboard for the hidden input */}
      <Pressable 
        style={styles.otpContainer} 
        onPress={() => hiddenInputRef.current?.focus()}
      >
        {boxArray.map((index) => {
          // get the number at this box's position
          const digit = otpValue[index] || '';
          
          // check if this is the current box being typed in
          const isCurrentBox = index === otpValue.length;

          return (
            <View 
              key={index} 
              style={[
                styles.otpBox, 
                isCurrentBox ? styles.otpBoxActive : null
              ]}
            >
              <Text style={styles.otpText}>{digit}</Text>
            </View>
          );
        })}
      </Pressable>

      {/* Hidden text input to actually capture the typing */}
      <TextInput
        ref={hiddenInputRef}
        value={otpValue}
        onChangeText={(text: string) => {
          // only allow up to 6 numbers
          if (text.length <= 6) {
            setOtpValue(text);
          }
        }}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus={true}
        style={styles.hiddenInput}
      />

      <View style={styles.spacer} />

      <PrimaryButton 
        title="Continue" 
        onPress={handleVerifyClick} 
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  otpBoxActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.white,
  },
  otpText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});

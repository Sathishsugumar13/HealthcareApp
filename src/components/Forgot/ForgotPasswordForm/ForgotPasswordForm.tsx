import { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../theme/colors';

import CustomInput from '../../SignIn/CustomInput';
import PrimaryButton from '../../Common/PrimaryButton';

export default function ForgotPasswordForm(props: any) {
  // state for step
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = Password Set

  // state for email
  const [emailValue, setEmailValue] = useState('');
  
  // state for otp
  const [otpValue, setOtpValue] = useState('');
  const hiddenInputRef = useRef<TextInput>(null);

  // state for timer
  const [timer, setTimer] = useState(30);

  // state to track if OTP was submitted for validation styles
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // state for password
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  const [errorText, setErrorText] = useState('');

  // Timer logic for OTP step
  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Email Continue
  const handleEmailContinue = async () => {
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
          setStep(2);
          setTimer(30); // reset timer when going to step 2
          setIsOtpSubmitted(false); // reset otp submission state
        }
      }
    }
  };

  // Handle OTP Verify
  const handleVerifyClick = () => {
    setIsOtpSubmitted(true);
    setErrorText('');
    if (otpValue === '') {
      setErrorText('Please enter the OTP.');
    } else if (otpValue.length < 6) {
      setErrorText('OTP must be 6 digits.');
    } else {
      setStep(3);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    setErrorText('');
    setOtpValue(''); // clear old OTP
    setTimer(30); // restart the timer
    // Normally we would call API to resend OTP here
    console.log("OTP Resent!");
  };

  // Password condition checks for display and validation
  let hasCapitalLetter = false;
  let hasSmallLetter = false;
  let hasNumber = false;
  let hasSpecialCharacter = false;
  let isValidLength = false;

  if (newPasswordValue.length >= 8 && newPasswordValue.length <= 15) {
    isValidLength = true;
  }

  // Simple loop to check characters (very 'fresher' logic instead of complex regex)
  for (let i = 0; i < newPasswordValue.length; i++) {
    let char = newPasswordValue[i];
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

  // Handle Change Password
  const handleChangePasswordClick = async () => {
    setErrorText('');

    if (newPasswordValue === '') {
      setErrorText('Please enter a new password.');
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
    } else if (confirmPasswordValue === '') {
      setErrorText('Please confirm your new password.');
    } else if (newPasswordValue !== confirmPasswordValue) {
      setErrorText('Passwords do not match.');
    } else {
      let savedUserString = await AsyncStorage.getItem('user');
      if (savedUserString === null) {
        setErrorText('No user found to update password.');
      } else {
        let savedUserObject = JSON.parse(savedUserString);
        savedUserObject.password = newPasswordValue;
        await AsyncStorage.setItem('user', JSON.stringify(savedUserObject));
        if(props.onSuccess) {
          props.onSuccess();
        }
      }
    }
  };

  const boxArray = [0, 1, 2, 3, 4, 5];

  return (
    <View style={{ width: '100%' }}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your email to receive an OTP.</Text>

          {errorText !== '' && <Text style={styles.errorText}>{errorText}</Text>}

          <CustomInput
            icon="mail"
            placeholder="Enter your email id"
            value={emailValue}
            onChangeText={(text: string) => setEmailValue(text)}
            keyboardType="email-address"
          />

          <View style={styles.spacer} />
          <PrimaryButton title="Continue" onPress={handleEmailContinue} />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>OTP sent to {emailValue}</Text>

          {errorText !== '' && <Text style={styles.errorText}>{errorText}</Text>}

          <Pressable 
            style={styles.otpContainer} 
            onPress={() => hiddenInputRef.current?.focus()}
          >
            {boxArray.map((index) => {
              const digit = otpValue[index] || '';
              const isCurrentBox = index === otpValue.length;
              
              // Simple validation logic for fresher feel
              let showRedBorder = false;
              if (isOtpSubmitted === true && digit === '') {
                showRedBorder = true;
              }

              return (
                <View 
                  key={index} 
                  style={[
                    styles.otpBox, 
                    isCurrentBox ? styles.otpBoxActive : null,
                    showRedBorder ? { borderColor: 'red' } : null
                  ]}
                >
                  <Text style={styles.otpText}>{digit}</Text>
                </View>
              );
            })}
          </Pressable>

          <TextInput
            ref={hiddenInputRef}
            value={otpValue}
            onChangeText={(text: string) => {
              if (text.length <= 6) {
                setOtpValue(text);
              }
              // hide red border when typing
              if (isOtpSubmitted) {
                setIsOtpSubmitted(false);
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus={true}
            style={styles.hiddenInput}
          />

          {/* Resend OTP Section */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend OTP in {timer} seconds</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.spacerSmall} />
          <PrimaryButton title="Continue" onPress={handleVerifyClick} />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Create a new password for your account.</Text>

          {errorText !== '' && <Text style={styles.errorText}>{errorText}</Text>}

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
          <PrimaryButton title="Change Password" onPress={handleChangePasswordClick} />

          {/* Password Conditions Display below button */}
          <View style={[styles.conditionsWrapper, { marginTop: 15, marginBottom: 0 }]}>
            <Text style={[styles.conditionText, { color: isValidLength ? 'green' : 'gray' }]}>
              • Minimum 8 to 15 letters
            </Text>
            <Text style={[styles.conditionText, { color: hasCapitalLetter ? 'green' : 'gray' }]}>
              • Minimum 1 capital letter
            </Text>
            <Text style={[styles.conditionText, { color: hasSmallLetter ? 'green' : 'gray' }]}>
              • Minimum 1 small letter
            </Text>
            <Text style={[styles.conditionText, { color: hasNumber ? 'green' : 'gray' }]}>
              • Minimum 1 number
            </Text>
            <Text style={[styles.conditionText, { color: hasSpecialCharacter ? 'green' : 'gray' }]}>
              • Minimum 1 special character
            </Text>
          </View>
        </>
      )}
    </View>
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
  spacerSmall: {
    height: 20,
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
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  timerText: {
    color: Colors.secondaryText,
    fontSize: 14,
  },
  resendText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  conditionsWrapper: {
    marginBottom: 15,
    marginLeft: 5,
  },
  conditionText: {
    fontSize: 12,
    marginBottom: 4,
  }
});

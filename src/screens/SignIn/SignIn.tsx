import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import SuccessModal from '../../components/Common/SuccessModal';

import SignInForm from '../../components/SignIn/SignInForm/SignInForm';
import ForgotRegisterEmailId from '../../components/Forgot/ForgotRegisterEmailId/ForgotRegisterEmailId';
import ForgotOtp from '../../components/Forgot/ForgotOtp/ForgotOtp';
import PasswordSet from '../../components/Forgot/PasswordSet/PasswordSet';

export default function SignIn(props: any) {
  // Navigation State to know which view to show
  const [currentStep, setCurrentStep] = useState<'Sign in' | 'ForgotRegisterEmailId' | 'OTP' | 'Passwordset'>('Sign in');

  // We only need to store forgotEmail in SignIn so we can pass it to OTP step
  const [forgotEmailValue, setForgotEmailValue] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // function when back button is pressed
  const handleBackButtonClick = () => {
    if (currentStep === 'Sign in') {
      if (props.back) {
        props.back();
      }
    } else if (currentStep === 'ForgotRegisterEmailId') {
      setCurrentStep('Sign in');
    } else if (currentStep === 'OTP') {
      setCurrentStep('ForgotRegisterEmailId');
    } else if (currentStep === 'Passwordset') {
      setCurrentStep('OTP');
    }
  };

  // function when success modal is closed
  const handleSuccessPopupClose = () => {
    setIsSuccessModalOpen(false);
    // Reset flow and go to sign in
    setForgotEmailValue('');
    setCurrentStep('Sign in');
  };

  // determine title based on step
  let headerTitle;
  if (currentStep === 'Sign in') {
    headerTitle = "Sign In";
  } else {
    headerTitle = "Forgot Password";
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Show success modal if password is changed */}
      <SuccessModal 
        visible={isSuccessModalOpen}
        title="Password Reset"
        message="Your password has been changed successfully. You can now login with your new password."
        onClose={handleSuccessPopupClose}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header component */}
        <Header 
          title={headerTitle} 
          onBackPress={handleBackButtonClick} 
        />

        {/* Show forms based on current step */}
        {currentStep === 'Sign in' ? (
          <SignInForm 
            onLogin={props.onLogin}
            onSignUp={props.onSignUp}
            onForgot={() => setCurrentStep('ForgotRegisterEmailId')}
          />
        ) : null}

        {currentStep === 'ForgotRegisterEmailId' ? (
          <ForgotRegisterEmailId 
            onSuccess={(validEmail: string) => {
              setForgotEmailValue(validEmail);
              setCurrentStep('OTP');
            }} 
          />
        ) : null}

        {currentStep === 'OTP' ? (
          <ForgotOtp 
            email={forgotEmailValue} 
            onSuccess={() => setCurrentStep('Passwordset')} 
          />
        ) : null}

        {currentStep === 'Passwordset' ? (
          <PasswordSet 
            onSuccess={() => setIsSuccessModalOpen(true)} 
          />
        ) : null}

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
});

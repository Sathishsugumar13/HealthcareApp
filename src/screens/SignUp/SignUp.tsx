import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import SuccessModal from '../../components/Common/SuccessModal';
import SignUpForm from '../../components/SignUp/SignUpForm/SignUpForm';

export default function SignUp(props: any) {
  // state to show or hide the success popup
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  // function to close the popup and go back to sign in
  const handleSuccessPopupClose = () => {
    setIsSuccessPopupOpen(false);
    
    // call the parent function to go to sign in screen
    if (props.onSuccess) {
      props.onSuccess();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Success Modal */}
      <SuccessModal 
        visible={isSuccessPopupOpen}
        title="Account Created!"
        message="Your account has been successfully created. You can now sign in."
        onClose={handleSuccessPopupClose}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header */}
        <Header title="Sign Up" onBackPress={props.back} />

        {/* The sign up form component */}
        <SignUpForm 
          onSuccess={() => setIsSuccessPopupOpen(true)}
          onSignIn={props.onSignIn}
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
});

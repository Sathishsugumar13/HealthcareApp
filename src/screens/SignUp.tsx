import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../theme/colors';

import Header from '../components/SignIn/Header';
import SuccessModal from '../components/Common/SuccessModal';
import SignUpForm from '../components/SignUp/SignUpForm';

export default function SignUp(props: any) {
  
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  
  const handleSuccessPopupClose = () => {
    setIsSuccessPopupOpen(false);
    console.log("Success! Going to SignIn page now.");
    props.navigation.navigate('SignIn');
  };

  const handleBack = () => {
    console.log("user pressed back button in signup");
    props.navigation.goBack();
  };

  const goToSignIn = () => {
    console.log("user clicked already have account");
    props.navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {}
      <SuccessModal 
        visible={isSuccessPopupOpen}
        title="Account Created!"
        message="Your account has been successfully created. You can now sign in."
        onClose={handleSuccessPopupClose}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {}
        <Header title="Sign Up" onBackPress={handleBack} />

        {}
        <SignUpForm 
          onSuccess={() => setIsSuccessPopupOpen(true)}
          onSignIn={goToSignIn}
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



import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import SuccessModal from '../../components/Common/SuccessModal';
import ForgotPasswordForm from '../../components/ForgotPassword/ForgotPassword';

export default function ForgotPassword(props: any) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleBackButtonClick = () => {
    console.log("forgot password back clicked");
    props.navigation.goBack();
  };

  const handleSuccessPopupClose = () => {
    setIsSuccessModalOpen(false);
    // Go back to sign in after closing success modal
    console.log("popup closed, going back");
    props.navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      <SuccessModal 
        visible={isSuccessModalOpen}
        title="Password Reset"
        message="Your password has been changed successfully. You can now login with your new password."
        onClose={handleSuccessPopupClose}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        <Header 
          title="Forgot Password" 
          onBackPress={handleBackButtonClick} 
        />

        <ForgotPasswordForm 
          onSuccess={() => setIsSuccessModalOpen(true)}
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

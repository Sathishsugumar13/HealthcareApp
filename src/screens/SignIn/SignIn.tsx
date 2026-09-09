
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import SignInForm from '../../components/SignIn/SignInForm/SignInForm';

export default function SignIn(props: any) {

  // function when back button is pressed
  const handleBackButtonClick = () => {
    if (props.back) {
      props.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header component */}
        <Header 
          title="Sign In" 
          onBackPress={handleBackButtonClick} 
        />

        <SignInForm 
          onLogin={props.onLogin}
          onSignUp={props.onSignUp}
          onForgot={() => {
            if (props.onForgotPassword) {
              props.onForgotPassword();
            }
          }}
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

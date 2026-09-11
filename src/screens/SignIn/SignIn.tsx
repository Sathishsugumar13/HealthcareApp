
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

import Header from '../../components/SignIn/Header';
import SignInForm from '../../components/SignIn/SignInForm/SignInForm';

export default function SignIn(props: any) {

  const handleBackButtonClick = () => {
    console.log("going back from sign in");
    props.navigation.goBack();
  };

  const loginSuccess = (data: any) => {
    console.log("login success function called, passing data: ", data);
    props.navigation.replace('MainTab', { user: data });
  };

  const goToSignUp = () => {
    console.log("going to sign up screen");
    props.navigation.navigate('SignUp');
  };

  const goToForgot = () => {
    console.log("going to forgot password");
    props.navigation.navigate('ForgotPassword');
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
          onLogin={loginSuccess}
          onSignUp={goToSignUp}
          onForgot={goToForgot}
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

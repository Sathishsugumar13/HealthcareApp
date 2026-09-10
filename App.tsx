import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Splash from './src/screens/Splash/Splash';
import Onboarding from './src/screens/Onboarding/Onboarding';
import SignUp from './src/screens/SignUp/SignUp';
import SignIn from './src/screens/SignIn/SignIn';
import ForgotPassword from './src/screens/ForgotPassword/ForgotPassword';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { usePushNotifications } from './src/hooks/usePushNotifications';

export default function App() {
  // call push notification
  usePushNotifications();
  
  // state to store which screen to show
  const [currentScreenName, setCurrentScreenName] = useState('splash');
  const [onboardingPageNumber, setOnboardingPageNumber] = useState(1);
  const [userData, setUserData] = useState<any>(null);

  // function to go to onboarding screen
  const goToOnboardingScreen = (pageNumber: number) => {
    setOnboardingPageNumber(pageNumber);
    setCurrentScreenName('onboarding');
  };

  // function to go to sign in screen
  const goToSignInScreen = () => {
    setCurrentScreenName('signin');
  };

  // function to go to sign up screen
  const goToSignUpScreen = () => {
    setCurrentScreenName('signup');
  };
  
  // function to go to forgot password screen
  const goToForgotPasswordScreen = () => {
    setCurrentScreenName('forgotpassword');
  };

  // function to go to home screen
  const goToHomeScreen = (data: any) => {
    if (data !== undefined) {
      setUserData(data);
    }
    setCurrentScreenName('home');
  };

  // variable to hold the screen UI
  let screenUI;

  // check which screen name is active and set the UI
  if (currentScreenName === 'splash') {
    screenUI = <Splash next={() => goToOnboardingScreen(1)} />;
  } else if (currentScreenName === 'onboarding') {
    screenUI = <Onboarding 
      initialPage={onboardingPageNumber}
      signUp={() => {
        setOnboardingPageNumber(3);
        goToSignUpScreen();
      }} 
      login={() => {
        setOnboardingPageNumber(3);
        goToSignInScreen();
      }}
    />;
  } else if (currentScreenName === 'signup') {
    screenUI = <SignUp 
      back={() => goToOnboardingScreen(3)}
      onSuccess={goToSignInScreen}
      onSignIn={goToSignInScreen}
    />;
  } else if (currentScreenName === 'signin') {
    screenUI = <SignIn 
      back={() => goToOnboardingScreen(3)}
      onSignUp={goToSignUpScreen}
      onLogin={goToHomeScreen}
      onForgotPassword={goToForgotPasswordScreen}
    />;
  } else if (currentScreenName === 'forgotpassword') {
    screenUI = <ForgotPassword back={goToSignInScreen} />;
  } else if (currentScreenName === 'home') {
    screenUI = <MainTabNavigator user={userData} onLogout={goToSignInScreen} />;
  }

  // return the final UI
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          {screenUI}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
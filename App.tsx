import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Splash from './src/screens/Splash/Splash';
import Onboarding from './src/screens/Onboarding/Onboarding';
import SignUp from './src/screens/SignUp/SignUp';
import SignIn from './src/screens/SignIn/SignIn';
import ForgotPassword from './src/screens/ForgotPassword/ForgotPassword';
import HomeScreen from './src/screens/Home/HomeScreen';
import { usePushNotifications } from './src/hooks/usePushNotifications';

export default function App() {
  usePushNotifications();
  const [screen, setScreen] = useState('splash');
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [user, setUser] = useState<any>(null);

  const goToOnboarding = (page = 1) => {
    setOnboardingPage(page);
    setScreen('onboarding');
  };

  const goToSignIn = () => {
    setScreen('signin');
  };

  const goToSignUp = () => {
    setScreen('signup');
  };

  const goToForgot = () => {
    setScreen('forgot');
  };

  const goToHome = (userData?: any) => {
    if (userData) {
      setUser(userData);
    }
    setScreen('home');
  };

  let currentScreen;

  if (screen === 'splash') {
    currentScreen = <Splash next={() => goToOnboarding(1)} />;
  } else if (screen === 'onboarding') {
    currentScreen = <Onboarding 
      initialPage={onboardingPage}
      signUp={() => {
        setOnboardingPage(3);
        goToSignUp();
      }} 
      login={() => {
        setOnboardingPage(3);
        goToSignIn();
      }}
    />;
  } else if (screen === 'signup') {
    currentScreen = <SignUp 
      back={() => goToOnboarding(3)}
      onSuccess={goToSignIn}
      onSignIn={goToSignIn}
    />;
  } else if (screen === 'signin') {
    currentScreen = <SignIn 
      back={() => goToOnboarding(3)}
      onSignUp={goToSignUp}
      onForgot={goToForgot}
      onLogin={goToHome}
    />;
  } else if (screen === 'forgot') {
    currentScreen = <ForgotPassword 
      back={goToSignIn}
      onSend={goToSignIn}
    />;
  } else if (screen === 'home') {
    currentScreen = <HomeScreen user={user} onLogout={goToSignIn} />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        {currentScreen}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
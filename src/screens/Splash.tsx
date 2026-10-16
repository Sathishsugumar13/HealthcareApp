import { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Common/Logo';
import { images } from '../assets/images';
import { Colors } from '../theme/colors';

export default function Splash(props: any) {
  useEffect(() => {
    let isMounted = true;

    const navigateNext = async () => {
      try {
        const [userStr, isLoggedIn] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('isLoggedIn'),
          new Promise((resolve) => setTimeout(resolve, 1500))
        ]);

        if (!isMounted) return;

        // If user data exists and user hasn't explicitly logged out
        if (userStr && isLoggedIn !== 'false') {
          const userObj = JSON.parse(userStr);
          props.navigation.replace('MainTab', { user: userObj });
        } else {
          props.navigation.replace('Onboarding');
        }
      } catch (e) {
        if (isMounted) {
          props.navigation.replace('Onboarding');
        }
      }
    };

    navigateNext();

    return () => {
      isMounted = false;
    };
  }, []);

  
  return (
    <ImageBackground
      source={images.common.splashNew}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        <Logo size={200} style={styles.logo} />
        <Text style={styles.title}>Healthcare</Text>
        <Text style={styles.subtitle}>Medical app</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.brandDark,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.brandDark,
  },
});

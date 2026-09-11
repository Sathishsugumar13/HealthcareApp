import { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Logo from '../../components/Common/Logo';

export default function Splash(props: any) {

  // wait for 5 seconds and go to next screen
  useEffect(() => {
    // create a timer
    const myTimer = setTimeout(() => {
      console.log("5 seconds over, going to Onboarding screen");
      props.navigation.replace('Onboarding');
    }, 5000);

    // clear timer if component unmounts
    return () => clearTimeout(myTimer);
  }, []);

  // render the background image and text
  return (
    <ImageBackground
      source={require('../../assets/images/splash-new.png')}
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
    color: '#223A6A',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#223A6A',
  },
});
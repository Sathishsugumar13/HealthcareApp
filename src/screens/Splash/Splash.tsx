import { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Logo from '../../components/Common/Logo';

export default function Splash({
  next,
}: any) {

  useEffect(() => {
    const timer = setTimeout(next, 5000);

    return () => clearTimeout(timer);
  }, []);

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
import { useEffect } from 'react';
import {
  Image,
  View,
  Text,
  ImageBackground,
} from 'react-native';
import { styles } from './Splash.styles';

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
        <Image
          source={require('../../assets/images/healthcare-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Healthcare</Text>
        <Text style={styles.subtitle}>Medical app</Text>
      </View>
    </ImageBackground>
  );
}
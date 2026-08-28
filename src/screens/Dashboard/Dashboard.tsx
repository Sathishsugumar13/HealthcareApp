import { Image, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Dashboard.styles';

export default function Dashboard(props: any) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/healthcare-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome healthcare</Text>
      </View>

      <Pressable style={styles.signOutButton} onPress={props.onSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

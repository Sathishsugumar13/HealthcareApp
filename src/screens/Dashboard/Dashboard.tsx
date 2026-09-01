import { Text, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import Logo from '../../components/Common/Logo';

export default function Dashboard(props: any) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Logo size={150} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome healthcare</Text>
      </View>

      <Pressable 
        style={({ pressed }) => [styles.signOutButton, pressed && { opacity: 0.8 }]} 
        onPress={props.onSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 30,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  signOutButton: {
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  signOutText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
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
    width: 150,
    height: 150,
    resizeMode: 'contain',
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
    backgroundColor: Colors.error, // Red color for sign out, or use standard blue if preferred
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

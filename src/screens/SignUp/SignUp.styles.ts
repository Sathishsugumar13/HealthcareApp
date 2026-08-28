import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 25,
  },
  contentContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 10,
  },
  backBtn: {
    width: 40,
  },
  back: {
    fontSize: 40,
    color: Colors.text,
    lineHeight: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: Colors.background,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
    color: Colors.secondaryText,
  },
  eyeIcon: {
    fontSize: 20,
    color: Colors.secondaryText,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingRight: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: Colors.secondaryText,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkMark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.primary,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  button: {
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  signin: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  bottomText: {
    fontSize: 15,
    color: Colors.text,
  },
  link: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});
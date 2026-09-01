/**
 * Component: TermsCheckbox
 * Originally created for: Sign Up Page
 * Usage: Checkbox for accepting terms and conditions
 */
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface TermsCheckboxProps {
  agree: boolean;
  onToggle: () => void;
}

export default function TermsCheckbox({ agree, onToggle }: TermsCheckboxProps) {
  return (
    <Pressable style={styles.terms} onPress={onToggle}>
      <View style={[styles.checkbox, agree && styles.checkboxActive]}>
        {agree && <Feather name="check" size={14} color={Colors.white} />}
      </View>
      <Text style={styles.termsText}>
        I agree to the healthcare{' '}
        <Text style={styles.linkText}>Terms of Service</Text> and{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  termsText: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.primary,
  },
});

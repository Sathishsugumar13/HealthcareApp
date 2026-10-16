import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface PasswordValidatorProps {
  isValidLength: boolean;
  hasCapitalLetter: boolean;
  hasSmallLetter: boolean;
  hasNumber: boolean;
  hasSpecialCharacter: boolean;
  passwordsMatch?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PasswordValidator({
  isValidLength,
  hasCapitalLetter,
  hasSmallLetter,
  hasNumber,
  hasSpecialCharacter,
  passwordsMatch,
  style
}: PasswordValidatorProps) {
  return (
    <View style={[styles.conditionsWrapper, style]}>
      <Text style={[styles.conditionText, { color: isValidLength ? 'green' : 'red' }]}>
        • Minimum 8 to 15 letters
      </Text>
      <Text style={[styles.conditionText, { color: hasCapitalLetter ? 'green' : 'red' }]}>
        • Minimum 1 capital letter
      </Text>
      <Text style={[styles.conditionText, { color: hasSmallLetter ? 'green' : 'red' }]}>
        • Minimum 1 small letter
      </Text>
      <Text style={[styles.conditionText, { color: hasNumber ? 'green' : 'red' }]}>
        • Minimum 1 number
      </Text>
      <Text style={[styles.conditionText, { color: hasSpecialCharacter ? 'green' : 'red' }]}>
        • Minimum 1 special character
      </Text>
      {passwordsMatch !== undefined && (
        <Text style={[styles.conditionText, { color: passwordsMatch ? 'green' : 'red' }]}>
          • Passwords match
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  conditionsWrapper: {
    marginBottom: 15,
    marginLeft: 5,
  },
  conditionText: {
    fontSize: 12,
    marginBottom: 4,
  }
});

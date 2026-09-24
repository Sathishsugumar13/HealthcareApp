import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export interface PasswordValidatorProps {
  isValidLength: boolean;
  hasCapitalLetter: boolean;
  hasSmallLetter: boolean;
  hasNumber: boolean;
  hasSpecialCharacter: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PasswordValidator({
  isValidLength,
  hasCapitalLetter,
  hasSmallLetter,
  hasNumber,
  hasSpecialCharacter,
  style
}: PasswordValidatorProps) {
  return (
    <View style={[styles.conditionsWrapper, style]}>
      <Text style={[styles.conditionText, { color: isValidLength ? 'green' : 'gray' }]}>
        • Minimum 8 to 15 letters
      </Text>
      <Text style={[styles.conditionText, { color: hasCapitalLetter ? 'green' : 'gray' }]}>
        • Minimum 1 capital letter
      </Text>
      <Text style={[styles.conditionText, { color: hasSmallLetter ? 'green' : 'gray' }]}>
        • Minimum 1 small letter
      </Text>
      <Text style={[styles.conditionText, { color: hasNumber ? 'green' : 'gray' }]}>
        • Minimum 1 number
      </Text>
      <Text style={[styles.conditionText, { color: hasSpecialCharacter ? 'green' : 'gray' }]}>
        • Minimum 1 special character
      </Text>
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

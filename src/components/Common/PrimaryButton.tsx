/**
 * Component: PrimaryButton
 * Originally created for: Sign In Page (Also used in Onboarding)
 * Usage: Main action button across the app
 */
import React from 'react';
import { Pressable, Text, PressableProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../theme/colors';

interface PrimaryButtonProps extends PressableProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}

export default function PrimaryButton({ title, style, ...props }: PrimaryButtonProps) {
  return (
    <Pressable style={[styles.button, style]} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

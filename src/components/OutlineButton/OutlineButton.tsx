/**
 * Component: OutlineButton
 * Originally created for: Onboarding Page
 * Usage: Outlined variant of primary button
 */
import React from 'react';
import { Pressable, Text, PressableProps, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface OutlineButtonProps extends PressableProps {
  title: string;
}

export default function OutlineButton({ title, ...props }: OutlineButtonProps) {
  return (
    <Pressable style={styles.button} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});

/**
 * Component: IconButton
 * Originally created for: Onboarding Page
 * Usage: Circular icon button for next actions
 */
import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface IconButtonProps extends PressableProps {
  icon: keyof typeof Feather.glyphMap;
  size?: number;
}

export default function IconButton({ icon, size = 30, ...props }: IconButtonProps) {
  return (
    <Pressable 
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} 
      {...props}
    >
      <Feather name={icon} size={size} color={Colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

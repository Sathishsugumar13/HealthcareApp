import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export interface BackButtonProps {
  onPress: () => void;
  iconName?: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function BackButton({
  onPress,
  iconName = 'chevron-back',
  size = 28,
  color = Colors.color333,
  style,
}: BackButtonProps) {
  
  return (
    <TouchableOpacity style={[styles.backButton, style]} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={iconName as any} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

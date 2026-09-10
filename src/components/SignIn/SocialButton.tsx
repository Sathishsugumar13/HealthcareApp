/**
 * Component: SocialButton
 * Originally created for: Sign In Page
 * Usage: Google/Facebook login buttons
 */
import React from 'react';
import { Pressable, Text, PressableProps, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../../theme/colors';

interface SocialButtonProps extends PressableProps {
  title: string;
  icon: string;
  color: string;
  provider: 'google' | 'facebook';
}

export default function SocialButton({ title, icon, color, provider, ...props }: SocialButtonProps) {
  return (
    <Pressable 
      style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.7, backgroundColor: Colors.background }]} 
      {...props}
    >
      {provider === 'google' ? (
        <AntDesign name={icon as any} size={24} color={color} style={styles.socialIcon} />
      ) : (
        <FontAwesome name={icon as any} size={24} color={color} style={styles.socialIcon} />
      )}
      <Text style={styles.socialText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: Colors.white,
  },
  socialIcon: {
    position: 'absolute',
    left: 20,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});

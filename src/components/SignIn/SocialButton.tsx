
import React from 'react';
import { Pressable, Text, PressableProps, StyleSheet, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { images } from '../../assets/images';

interface SocialButtonProps extends PressableProps {
  title: string;
  icon: string;
  color: string;
  provider: 'google' | 'facebook';
}

export default function SocialButton({ title, icon, color, provider, ...props }: SocialButtonProps) {
  const logoSource = provider === 'google' ? images.common.googleLogo : images.common.facebookLogo;
  
  return (
    <Pressable 
      style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.7, backgroundColor: Colors.background }]} 
      {...props}
    >
      <Image source={logoSource} style={styles.socialIcon} resizeMode="contain" />
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
    width: 24,
    height: 24,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});

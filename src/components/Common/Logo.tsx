/**
 * Component: Logo
 * Originally created for: Common use across Splash, Onboarding, and Dashboard
 * Usage: Renders the Healthcare logo image
 */
import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface LogoProps {
  style?: StyleProp<ImageStyle>;
  size?: number;
}

export default function Logo({ style, size }: LogoProps) {
  const baseStyle: ImageStyle = {
    resizeMode: 'contain',
  };

  if (size) {
    baseStyle.width = size;
    baseStyle.height = size;
  }

  return (
    <Image
      source={require('../../assets/images/healthcare-logo.png')}
      style={[baseStyle, style]}
    />
  );
}

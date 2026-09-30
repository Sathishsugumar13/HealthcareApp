
import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { images } from '../../assets/images';

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
      source={images.common.healthcareLogo}
      style={[baseStyle, style]}
    />
  );
}

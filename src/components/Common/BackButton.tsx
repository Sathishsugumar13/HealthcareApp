import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

export interface BackButtonProps {
  onPress: () => void;
  iconFamily?: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather';
  iconName?: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function BackButton({
  onPress,
  iconFamily = 'MaterialCommunityIcons',
  iconName,
  size = 28,
  color = '#333',
  style,
}: BackButtonProps) {
  
  const getIconName = () => {
    if (iconName) return iconName;
    if (iconFamily === 'Ionicons') return 'arrow-back';
    if (iconFamily === 'Feather') return 'chevron-left';
    return 'arrow-left'; // default for MaterialCommunityIcons
  };

  const renderIcon = () => {
    const name = getIconName();
    if (iconFamily === 'Ionicons') {
      return <Ionicons name={name} size={size} color={color} />;
    }
    if (iconFamily === 'Feather') {
      return <Feather name={name} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  };

  return (
    <TouchableOpacity style={[styles.backButton, style]} onPress={onPress} activeOpacity={0.7}>
      {renderIcon()}
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

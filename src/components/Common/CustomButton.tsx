import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../theme/colors';

export interface CustomButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'text' | 'danger' | 'ghost';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: string;
  rightIcon?: string;
  iconFamily?: 'MaterialCommunityIcons' | 'Feather' | 'Ionicons';
  iconSize?: number;
  iconColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
  isRound?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  leftIcon,
  rightIcon,
  iconFamily = 'MaterialCommunityIcons',
  iconSize = 20,
  iconColor,
  isLoading = false,
  disabled = false,
  isRound = false,
}: CustomButtonProps) {

  const getContainerStyle = () => {
    let containerStyle: ViewStyle = { ...styles.baseButton };

    if (isRound) {
      containerStyle.width = 65;
      containerStyle.height = 65;
      containerStyle.borderRadius = 32.5;
      containerStyle.paddingHorizontal = 0;
    }

    switch (variant) {
      case 'primary':
        containerStyle.backgroundColor = Colors.primary;
        containerStyle.borderColor = Colors.primary;
        break;
      case 'outline':
        containerStyle.backgroundColor = 'transparent';
        containerStyle.borderColor = Colors.primary;
        containerStyle.borderWidth = 1;
        break;
      case 'text':
      case 'ghost':
        containerStyle.backgroundColor = 'transparent';
        containerStyle.elevation = 0;
        break;
      case 'danger':
        containerStyle.backgroundColor = '#FF4D4D';
        break;
    }

    if (disabled || isLoading) {
      containerStyle.opacity = 0.6;
    }

    return containerStyle;
  };

  const getTextColor = () => {
    if (variant === 'primary' || variant === 'danger') return Colors.white;
    return Colors.primary;
  };

  const renderIcon = (iconName: string) => {
    const finalColor = iconColor || getTextColor();
    if (iconFamily === 'Feather') {
      return <Feather name={iconName} size={iconSize} color={finalColor} />;
    }
    if (iconFamily === 'Ionicons') {
      return <Ionicons name={iconName} size={iconSize} color={finalColor} />;
    }
    return <MaterialCommunityIcons name={iconName} size={iconSize} color={finalColor} />;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        getContainerStyle(),
        style,
        pressed && !disabled && { opacity: 0.8 },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={title ? styles.leftIconMargin : null}>{renderIcon(leftIcon)}</View>}
          
          {title && (
            <Text style={[styles.buttonText, { color: getTextColor() }, textStyle]}>
              {title}
            </Text>
          )}

          {rightIcon && <View style={title ? styles.rightIconMargin : null}>{renderIcon(rightIcon)}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  leftIconMargin: {
    marginRight: 10,
  },
  rightIconMargin: {
    marginLeft: 10,
  },
});

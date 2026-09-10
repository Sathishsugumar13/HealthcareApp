/**
 * Component: CustomInput
 * Originally created for: Sign In Page
 * Usage: Reusable input field across auth screens
 */
import React, { useState } from 'react';
import { View, TextInput, Pressable, TextInputProps, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from '../../theme/colors';

interface CustomInputProps extends TextInputProps {
  icon: string;
  isPassword?: boolean;
}

export default function CustomInput({ icon, isPassword = false, ...props }: CustomInputProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Feather name={icon} size={20} color={Colors.secondaryText} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.secondaryText}
        secureTextEntry={isPassword && !showPass}
        autoCapitalize={isPassword ? "none" : props.autoCapitalize}
        {...props}
      />
      {isPassword && (
        <Pressable onPress={() => setShowPass(!showPass)}>
          <Feather name={showPass ? 'eye' : 'eye-off'} size={20} color={Colors.secondaryText} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: Colors.background,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
});

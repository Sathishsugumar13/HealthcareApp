/**
 * Component: AuthBottomLink
 * Originally created for: Common/Auth Screens
 * Usage: Link at the bottom to toggle between Sign In and Sign Up
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface AuthBottomLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export default function AuthBottomLink({ text, linkText, onPress }: AuthBottomLinkProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.bottomText}>{text}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.link}>{linkText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40, // Usually space below it in auth screens
  },
  bottomText: {
    fontSize: 15,
    color: Colors.text,
  },
  link: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});

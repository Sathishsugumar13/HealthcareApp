import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export interface ProfileMenuItemProps {
  title: string;
  iconName: string;
  iconType: 'Feather' | 'AntDesign';
  onPress: () => void;
}

export default function ProfileMenuItem({ title, iconName, iconType, onPress }: ProfileMenuItemProps) {
  let iconComponent = null;
  if (iconType === 'Feather') {
    iconComponent = <Feather name={iconName as any} size={20} color={Colors.color4A80F0} />;
  }
  if (iconType === 'AntDesign') {
    iconComponent = <AntDesign name={iconName as any} size={20} color={Colors.color4A80F0} />;
  }

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.inlineFlexdirectionRowAlignite}>
        <View style={styles.iconCircle}>
          {iconComponent}
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="gray" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inlineFlexdirectionRowAlignite: { flexDirection: 'row', alignItems: 'center' },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorF0F0F0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.colorEEF3FF,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
});

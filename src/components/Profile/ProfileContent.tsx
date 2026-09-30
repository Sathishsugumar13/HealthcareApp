import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import StatBox from './StatBox';
import ProfileMenuItem from './ProfileMenuItem';
import { Colors } from '../../theme/colors';

export default function ProfileContent(props: any) {

  
  const menuItems = [
    { id: 1, title: 'My Saved', icon: 'heart', type: 'Feather' },
    { id: 2, title: 'Appointment', icon: 'file-text', type: 'Feather' },
    { id: 3, title: 'Payment Method', icon: 'credit-card', type: 'Feather' },
    { id: 4, title: 'FAQs', icon: 'message-circle', type: 'Feather' },
    { id: 5, title: 'Logout', icon: 'log-out', type: 'Feather' },
  ];

  
  let userName = props.user?.name || 'User Name';
  let userAvatar = props.profileImage;

  return (
    <ScrollView style={styles.mainContainer}>
      
      {}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={props.onAvatarClick}>
          {userAvatar ? (
            <Image 
              source={{ uri: userAvatar }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: Colors.colorF0F0F0, justifyContent: 'center', alignItems: 'center' }]}>
              <MaterialCommunityIcons name="account" size={50} color="gray" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileEmail}>{props.user?.email || 'user@example.com'}</Text>
      </View>

      {}
      <View style={styles.statsContainer}>
        {}
        <StatBox iconFamily="Ionicons" iconName="heart" label="Heart rate" value="97bpm" />

        {}
        <View style={styles.divider}></View>

        {}
        <StatBox iconFamily="Ionicons" iconName="water" label="Calories" value="756cal" />

        <View style={styles.divider}></View>

        {}
        <StatBox iconFamily="MaterialCommunityIcons" iconName="weight" label="Weight" value="155lbs" />
      </View>

      {}
      <View style={styles.inlineMargintop20}>
        {}
        {menuItems.map((item) => {
          return (
            <ProfileMenuItem 
              key={item.id}
              title={item.title}
              iconName={item.icon}
              iconType={item.type as 'Feather' | 'AntDesign'}
              onPress={() => {
                if (item.title === 'Logout') {
                  if (props.onLogoutPress) {
                    props.onLogoutPress();
                  }
                }
              }}
            />
          )
        })}
      </View>

      <View style={styles.spacerHeight40}></View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inlineMargintop20: { marginTop: 20 },
  spacerHeight40: { height: 40 },

  mainContainer: {
    padding: 15,
    paddingTop: 70, 
    backgroundColor: Colors.white,
    
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.color666,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.colorEEEEEE,
  }
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import StatBox from './StatBox';
import ProfileMenuItem from './ProfileMenuItem';
import { Colors } from '../../theme/colors';

export default function ProfileContent(props: any) {
  const navigation = useNavigation<any>();
  
  const menuItems = [
      { id: 0, title: 'My Details', icon: 'person', type: 'Ionicons' },
    { id: 1, title: 'My Saved', icon: 'heart', type: 'Ionicons' },
    { id: 2, title: 'Appointment', icon: 'document-text', type: 'Ionicons' },
    { id: 3, title: 'Payment Method', icon: 'card', type: 'Ionicons' },
    { id: 5, title: 'Logout', icon: 'log-out', type: 'Ionicons' },
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
              <Ionicons name="person" size={50} color="gray" />
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
        <StatBox iconFamily="Ionicons" iconName="flame" label="Calories" value="756cal" />

        <View style={styles.divider}></View>

        {}
        <StatBox iconFamily="FontAwesome5" iconName="weight" label="Weight" value="155lbs" />
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
              iconType={item.type as 'Ionicons'}
              onPress={() => {
                if (item.title === 'Logout') {
                    if (props.onLogoutPress) {
                      props.onLogoutPress();
                    }
                  } else if (item.title === 'My Details') {
                      navigation.navigate('MyDetails');
                    } else if (item.title === 'My Saved') {
                    navigation.navigate('Saved');
                  } else if (item.title === 'Payment Method') {
                      navigation.navigate('PaymentMethods');
                    } else if (item.title === 'Appointment') {
                    navigation.navigate('MyAppointments');
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

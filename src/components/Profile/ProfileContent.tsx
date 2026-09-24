import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
// importing icons
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { handleAppLogout } from '../Logout/logoutHelper';
import StatBox from './StatBox';
import ProfileMenuItem from './ProfileMenuItem';

export default function ProfileContent(props: any) {

  // dummy menu list
  const menuItems = [
    { id: 1, title: 'My Saved', icon: 'heart', type: 'Feather' },
    { id: 2, title: 'Appointment', icon: 'file-text', type: 'Feather' },
    { id: 3, title: 'Payment Method', icon: 'credit-card', type: 'Feather' },
    { id: 4, title: 'FAQs', icon: 'message-circle', type: 'Feather' },
    { id: 5, title: 'Logout', icon: 'log-out', type: 'Feather' },
  ];

  // getting from props like a beginner
  let userName = props.user?.name || 'User Name';
  let userAvatar = props.profileImage;

  return (
    <ScrollView style={styles.mainContainer}>
      
      {/* Profile Pic Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={props.onChangePhoto}>
          {userAvatar ? (
            <Image 
              source={{ uri: userAvatar }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' }]}>
              <MaterialCommunityIcons name="account" size={50} color="gray" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{userName}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {/* Stat 1 for heart rate */}
        <StatBox iconFamily="Ionicons" iconName="heart" label="Heart rate" value="97bpm" />

        {/* line divider */}
        <View style={styles.divider}></View>

        {/* Stat 2 for calories */}
        <StatBox iconFamily="Ionicons" iconName="water" label="Calories" value="756cal" />

        <View style={styles.divider}></View>

        {/* Stat 3 for weight */}
        <StatBox iconFamily="MaterialCommunityIcons" iconName="weight" label="Weight" value="155lbs" />
      </View>

      {/* Menu List items */}
      <View style={{ marginTop: 20 }}>
        {/* mapping the list */}
        {menuItems.map((item) => {
          return (
            <ProfileMenuItem 
              key={item.id}
              title={item.title}
              iconName={item.icon}
              iconType={item.type as 'Feather' | 'AntDesign'}
              onPress={() => {
                if (item.title === 'Logout') {
                  handleAppLogout(props.onLogout);
                }
              }}
            />
          )
        })}
      </View>

      <View style={{ height: 40 }}></View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 15,
    paddingTop: 70, // pushed down further
    backgroundColor: 'white',
    // height: '100%'
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // making it circle
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
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
    backgroundColor: '#EEEEEE',
  }
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
// importing icons
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { handleAppLogout } from '../Logout/logoutHelper';

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
        <View style={styles.statBox}>
          <Ionicons name="heart" size={24} color="#4A80F0" />
          <Text style={styles.statLabel}>Heart rate</Text>
          <Text style={styles.statValue}>97bpm</Text>
        </View>

        {/* line divider */}
        <View style={styles.divider}></View>

        {/* Stat 2 for calories */}
        <View style={styles.statBox}>
          <Ionicons name="water" size={24} color="#4A80F0" />
          <Text style={styles.statLabel}>Calories</Text>
          <Text style={styles.statValue}>756cal</Text>
        </View>

        <View style={styles.divider}></View>

        {/* Stat 3 for weight */}
        <View style={styles.statBox}>
          <MaterialCommunityIcons name="weight" size={24} color="#4A80F0" />
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>103lbs</Text>
        </View>
      </View>

      {/* Menu List items */}
      <View style={{ marginTop: 20 }}>
        {/* mapping the list */}
        {menuItems.map((item) => {
          
          // checking icon type
          let iconComponent = null;
          if (item.type === 'Feather') {
            iconComponent = <Feather name={item.icon as any} size={20} color="#4A80F0" />;
          }
          if (item.type === 'AntDesign') {
            iconComponent = <AntDesign name={item.icon as any} size={20} color="#4A80F0" />;
          }

          return (
            <TouchableOpacity 
              style={styles.menuItem} 
              key={item.id}
              onPress={() => {
                if (item.title === 'Logout') {
                  // using the reusable logout function
                  handleAppLogout(props.onLogout);
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.iconCircle}>
                  {iconComponent}
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
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
  statBox: {
    alignItems: 'center',
    width: '30%',
  },
  statLabel: {
    color: '#888', // gray color
    fontSize: 12,
    marginTop: 5,
  },
  statValue: {
    color: '#4A80F0', // blue color
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#EEEEEE',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20, // circle background
    backgroundColor: '#EEF3FF', // light blue color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold', // bold text for menu
    color: 'black',
  }
});

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/Home/HomeScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator(props: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'clipboard-pulse' : 'clipboard-pulse-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'bell' : 'bell-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
        },
        tabBarActiveTintColor: '#3572E1',
        tabBarInactiveTintColor: '#8A8A8A',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 95 : 80,
          paddingBottom: Platform.OS === 'ios' ? 28 : 15,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          marginTop: 6,
        },
      })}
    >
      <Tab.Screen name="Home">
        {(screenProps) => <HomeScreen {...screenProps} user={props.user} onLogout={props.onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Profile">
         {(screenProps) => <ProfileScreen {...screenProps} user={props.user} onLogout={props.onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

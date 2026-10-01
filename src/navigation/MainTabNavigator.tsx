import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useGlobalNotifications } from '../context/NotificationContext';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator(props: any) {
  const { unreadCount } = useGlobalNotifications();
  const [userObj, setUserObj] = useState<any>(props.route?.params?.user || null);

  useEffect(() => {
    if (!userObj) {
      const fetchUser = async () => {
        const data = await AsyncStorage.getItem('user');
        if (data) {
          setUserObj(JSON.parse(data));
        }
      };
      fetchUser();
    }
  }, []);

  const doLogout = () => {
    console.log("logout button clicked in tabs");
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  }

  const handleUpdateUser = async (updatedUser: any) => {
    setUserObj(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reports') {
            return <MaterialCommunityIcons name="file-sign" size={32} color={color} />;
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={32} color={color} />;
        },
        tabBarActiveTintColor: Colors.color3572E1,
        tabBarInactiveTintColor: Colors.color8A8A8A,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.colorF0F0F0,
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
        {(screenProps) => <HomeScreen {...screenProps} user={userObj} onLogout={doLogout} onUpdateUser={handleUpdateUser} />}
      </Tab.Screen>
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen 
        name="Notification" 
        component={NotificationScreen} 
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.red, color: Colors.white },
        }}
      />
      <Tab.Screen name="Profile">
         {(screenProps) => <ProfileScreen {...screenProps} user={userObj} onLogout={doLogout} onUpdateUser={handleUpdateUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}


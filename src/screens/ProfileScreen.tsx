import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ProfileContent from '../components/Profile/ProfileContent';
import { useProfileImage } from '../hooks/useProfileImage';
import { Colors } from '../theme/colors';

import ProfileModal from '../components/Profile/ProfileModal';
import LogoutModal from '../components/Logout/LogoutModal';

export default function ProfileScreen(props: any) {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(props.user || props.route?.params?.user || null);

  useEffect(() => {
    if (!user) {
      AsyncStorage.getItem('user').then(val => {
        if (val) {
          try {
            setUser(JSON.parse(val));
          } catch (e) {}
        }
      });
    }
  }, []);

  useEffect(() => {
    if (props.user) {
      setUser(props.user);
    }
  }, [props.user]);

  const profileImageHook = useProfileImage(user);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleUserLogout = () => {
    setIsProfileModalOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    if (props.onLogout) {
      props.onLogout();
    } else {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
  };

  const handleUpdateUser = async (updatedUser: any) => {
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    if (props.onUpdateUser) {
      props.onUpdateUser(updatedUser);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileContent 
        user={user} 
        profileImage={profileImageHook.profileImage} 
        onLogoutPress={() => setIsLogoutModalOpen(true)} 
        onAvatarClick={() => setIsProfileModalOpen(true)} 
      />
      
      <ProfileModal 
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        profileImageHook={profileImageHook}
        user={user}
        handleUserLogout={handleUserLogout}
        onUpdateUser={handleUpdateUser}
      />

      <LogoutModal 
        isVisible={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
  }
});


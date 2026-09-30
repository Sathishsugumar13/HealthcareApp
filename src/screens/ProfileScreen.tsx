import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileContent from '../components/Profile/ProfileContent';
import { useProfileImage } from '../hooks/useProfileImage';
import { Colors } from '../theme/colors';

import ProfileModal from '../components/Profile/ProfileModal';
import LogoutModal from '../components/Logout/LogoutModal';

export default function ProfileScreen(props: any) {
  const { user, onLogout } = props;
  const profileImageHook = useProfileImage(user);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleUserLogout = () => {
    setIsProfileModalOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    if (onLogout) {
      onLogout();
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
        onUpdateUser={props.onUpdateUser}
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


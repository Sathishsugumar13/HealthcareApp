import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ProfileContent from '../../components/Profile/ProfileContent';
import { useProfileImage } from '../../hooks/useProfileImage';

export default function ProfileScreen(props: any) {
  const { user, onLogout } = props;
  const { profileImage, onChangePhoto } = useProfileImage(user);

  return (
    <SafeAreaView style={styles.container}>
      <ProfileContent user={user} profileImage={profileImage} onLogout={onLogout} onChangePhoto={onChangePhoto} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  }
});

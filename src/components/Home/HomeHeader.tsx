import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HomeHeaderProps {
  user: any;
  profileImage: string | null;
  onProfilePress: () => void;
}

export default function HomeHeader({ user, profileImage, onProfilePress }: HomeHeaderProps) {
  return (
    <SafeAreaView style={styles.topSection} edges={['top']}>
      <View style={styles.headerContent}>
        <Pressable style={styles.profileImagePlaceholder} onPress={onProfilePress}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.smallAvatarImage} />
          ) : (
            <MaterialCommunityIcons name="account" size={30} color={Colors.gray} />
          )}
        </Pressable>
        <Text style={styles.welcomeText}>welcome !</Text>
        <Text style={styles.nameText}>{user?.name || 'User'}</Text>
        <Text style={styles.greetingText}>How are you feeling today ?</Text>
      </View>
      
      {/* Doctor Image Placeholder on the right */}
      <View style={styles.doctorImageWrapper}>
         <Image source={require('../../assets/images/home_doctor.png')} style={styles.largeDoctorImage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  headerContent: {
    flex: 1,
    zIndex: 2,
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D0E3F0',
    overflow: 'hidden',
  },
  welcomeText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 14,
    color: '#8CA1B0',
    fontWeight: '500',
  },
  doctorImageWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,
    opacity: 0.9,
  },
  largeDoctorImage: {
    width: 130,
    height: 150,
    resizeMode: 'contain',
  },
  smallAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

import { useState, useCallback } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

export function useProfileImage(user: any) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (user?.email) {
        loadProfileImage(user.email);
      }
    }, [user])
  );

  const loadProfileImage = async (email: string) => {
    console.log("loading profile image for email: ", email);
    try {
      const image = await AsyncStorage.getItem(`profile_img_${email}`);
      if (image) {
        console.log("found image in storage");
        setProfileImage(image);
      } else {
        console.log("no image found, setting to null empty avatar");
        setProfileImage(null);
      }
    } catch (error) {
      console.log("error loading image", error);
      setProfileImage(null);
    }
  };

  const saveProfileImage = async (uri: string) => {
    if (user?.email) {
      try {
        await AsyncStorage.setItem(`profile_img_${user.email}`, uri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Sorry, we need camera permissions to make this work!');
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (result.canceled === false) {
      setProfileImage(result.assets[0].uri);
      saveProfileImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (result.canceled === false) {
      setProfileImage(result.assets[0].uri);
      saveProfileImage(result.assets[0].uri);
    }
  };

  const removePhoto = async () => {
    console.log("remove photo button clicked");
    setProfileImage(null); 
    if (user && user.email) {
      try {
        console.log("removing from storage for email: ", user.email);
        await AsyncStorage.removeItem(`profile_img_${user.email}`);
        console.log("removed successfully");
      } catch (error) {
        console.log("Error removing photo", error);
      }
    } else {
      console.log("no user email found to remove photo");
    }
  };

  return { profileImage, takePhoto, pickImage, removePhoto };
}

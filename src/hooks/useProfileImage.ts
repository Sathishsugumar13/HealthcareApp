import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export function useProfileImage(user: any) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      loadProfileImage(user.email);
    }
  }, [user]);

  const loadProfileImage = async (email: string) => {
    try {
      const image = await AsyncStorage.getItem(`profile_img_${email}`);
      if (image) {
        setProfileImage(image);
      }
    } catch (error) {
      console.error(error);
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
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
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
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
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

  const onChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return { profileImage, onChangePhoto };
}

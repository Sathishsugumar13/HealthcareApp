import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../components/Common/BackButton';
import ChatBubble, { Message } from '../components/Common/ChatBubble';
import { Colors } from '../theme/colors';


export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const recipientName = route.params?.recipientName || 'Message';

  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! You are connected with ${recipientName}. How can we help you today?`,
      isSender: false,
      time: '10:00 AM'
    }
  ]);

  const pickImage = async () => {
    setShowAttachmentMenu(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });
    if (!result.canceled) {
      Alert.alert('Image Selected', 'Attachment ready to be sent.');
    }
  };

  const pickDocument = async () => {
    setShowAttachmentMenu(false);
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      Alert.alert('Document Selected', 'Document ready to be sent.');
    }
  };

  const pickContact = () => {
    setShowAttachmentMenu(false);
    Alert.alert('Contacts', 'Contact picker opens here.');
  };

  const pickCamera = async () => {
    setShowAttachmentMenu(false);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });
    if (!result.canceled) {
      Alert.alert('Camera', 'Photo captured.');
    }
  };

  const pickAudio = () => {
    setShowAttachmentMenu(false);
    Alert.alert('Audio', 'Audio picker opens here.');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate auto-reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. We will get back to you shortly.',
        isSender: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <ChatBubble item={item} />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{recipientName}</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <TouchableOpacity style={styles.phoneButton}>
          <MaterialCommunityIcons name="phone-outline" size={24} color={Colors.color3C72F2} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />

        {showAttachmentMenu && (
          <View style={styles.attachmentMenu}>
            <TouchableOpacity style={styles.attachmentOption} onPress={pickDocument}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#5E66D1' }]}>
                <MaterialCommunityIcons name="file-document" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Document</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachmentOption} onPress={pickCamera}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#D93025' }]}>
                <MaterialCommunityIcons name="camera" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#E95273' }]}>
                <MaterialCommunityIcons name="image" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={pickAudio}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#E87C28' }]}>
                <MaterialCommunityIcons name="headphones" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={pickContact}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#2196F3' }]}>
                <MaterialCommunityIcons name="account" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Contact</Text>
            </TouchableOpacity>
          </View>
        )}

        {}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}>
            <MaterialCommunityIcons name="paperclip" size={24} color={Colors.color888} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.color888}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim().length > 0 && styles.sendButtonActive]} 
            onPress={sendMessage}
          >
            <MaterialCommunityIcons name="send" size={20} color={Colors.colorFFF} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorF5F5F5,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.colorFFF,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorE0E0E0,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.success,
    marginTop: 2,
  },
  phoneButton: {
    padding: 8,
  },
  chatList: {
    padding: 16,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.colorFFF,
    borderTopWidth: 1,
    borderTopColor: Colors.colorEAEAEA,
  },
  attachButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.colorF5F5F5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
    color: Colors.color333,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.colorB0C4DE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.color3C72F2,
  },
  attachmentMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: Colors.colorFFF,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.colorEAEAEA,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  attachmentOption: {
    alignItems: 'center',
    width: '33.33%',
    marginBottom: 20,
  },
  attachmentIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 12,
    color: Colors.color555,
    fontWeight: '500',
  }
});


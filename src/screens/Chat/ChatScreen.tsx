import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../../components/Common/BackButton';
import ChatBubble, { Message } from '../../components/Common/ChatBubble';


export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const recipientName = route.params?.recipientName || 'Message';

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! You are connected with ${recipientName}. How can we help you today?`,
      isSender: false,
      time: '10:00 AM'
    }
  ]);

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
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{recipientName}</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <TouchableOpacity style={styles.phoneButton}>
          <MaterialCommunityIcons name="phone-outline" size={24} color="#3C72F2" />
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

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <MaterialCommunityIcons name="paperclip" size={24} color="#888" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim().length > 0 && styles.sendButtonActive]} 
            onPress={sendMessage}
          >
            <MaterialCommunityIcons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4CAF50',
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
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  attachButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
    color: '#333',
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B0C4DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3C72F2',
  }
});

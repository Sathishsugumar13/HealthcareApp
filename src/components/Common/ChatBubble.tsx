import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface Message {
  id: string;
  text: string;
  isSender: boolean;
  time: string;
}

interface ChatBubbleProps {
  item: Message;
}

export default function ChatBubble({ item }: ChatBubbleProps) {
  return (
    <View style={[styles.messageBubble, item.isSender ? styles.senderBubble : styles.receiverBubble]}>
      <Text style={[styles.messageText, item.isSender ? styles.senderText : styles.receiverText]}>
        {item.text}
      </Text>
      <Text style={[styles.messageTime, item.isSender ? styles.senderTime : styles.receiverTime]}>
        {item.time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  senderBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3C72F2',
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  senderText: {
    color: '#FFF',
  },
  receiverText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  senderTime: {
    color: '#D0E0FF',
  },
  receiverTime: {
    color: '#888',
  },
});

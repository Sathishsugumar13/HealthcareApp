import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, Keyboard, Pressable, StatusBar as RNStatusBar, Modal, ScrollView, Dimensions, Animated, BackHandler, Image, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import BackButton from '../components/Common/BackButton';
import ChatBubble, { Message, MessageStatus } from '../components/Common/ChatBubble';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CAPTION_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉',
  '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😜', '🤪', '🤗',
  '🤔', '🤐', '🤨', '😐', '😏', '😒', '🙄', '😬', '😌', '😔',
  '😷', '🤒', '🤕', '🤢', '🤧', '🥵', '🥶', '🥴', '😵', '🥳',
  '😎', '🤓', '🥺', '😮', '😯', '😲', '😳', '😦', '😢', '😭',
  '😱', '😖', '😩', '😤', '😡', '😠', '❤️', '🧡', '💛', '💚',
  '💙', '💜', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗',
  '💖', '💘', '💝', '👍', '👎', '👏', '🙌', '👐', '🤝', '🙏',
  '💪', '✌️', '🤞', '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆',
  '👇', '💊', '💉', '🩺', '🩹', '🩸', '🏥', '🚑', '🧬', '🔬',
  '🌡️', '📋', '📄', '💯', '🔥', '✨', '⭐', '🎉', '💐', '🌸'
];

const cleanDocumentName = (rawName?: string | null, rawUri?: string | null, fallback = 'Document.pdf'): string => {
  const sanitize = (val?: string | null): string | null => {
    if (!val || typeof val !== 'string') return null;
    let s = val.trim();
    if (s.includes('://') || s.startsWith('content:') || s.startsWith('file:') || s.startsWith('/')) {
      try {
        const decoded = decodeURIComponent(s);
        const segment = decoded.split('/').pop()?.split('?')[0];
        if (segment && segment.includes('.') && !segment.includes(':') && !segment.startsWith('document') && !segment.startsWith('raw')) {
          s = segment;
        } else {
          return null;
        }
      } catch (_) {
        return null;
      }
    }
    if (s.includes('://') || s.includes('/') || s.includes(':') || s.startsWith('content') || s.startsWith('file')) {
      return null;
    }
    return s.length > 0 ? s : null;
  };

  return sanitize(rawName) || sanitize(rawUri) || fallback;
};

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const recipientName = route.params?.recipientName || 'Message';
  const insets = useSafeAreaInsets();
  const chatStorageKey = `@chat_messages_${recipientName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const shouldScrollToEndRef = useRef(true);

  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordTimerRef = useRef<any>(null);
  const isCanceledRef = useRef<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showContactInfoModal, setShowContactInfoModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [showImageEmojiPicker, setShowImageEmojiPicker] = useState(false);
  const [showDocPreviewModal, setShowDocPreviewModal] = useState(false);
  const [pendingDoc, setPendingDoc] = useState<{
    uri: string;
    name: string;
    size: string;
    mimeType: string;
    base64?: string;
  } | null>(null);
  const [firstPageUri, setFirstPageUri] = useState<string | null>(null);
  const [docPagesCount, setDocPagesCount] = useState<string>('1 page');
  const [isRenderingFirstPage, setIsRenderingFirstPage] = useState(false);
  const [docCaption, setDocCaption] = useState('');
  const [showDocEmojiPicker, setShowDocEmojiPicker] = useState(false);
  const docCaptionInputRef = useRef<TextInput>(null);
  const [showChatEmojiPicker, setShowChatEmojiPicker] = useState(false);
  const captionInputRef = useRef<TextInput>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<any>(null);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  };

  // Load chat messages from AsyncStorage on mount and every time screen gains focus
  const loadMessages = React.useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(chatStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          shouldScrollToEndRef.current = true;
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 80);
          return;
        }
      }
    } catch (err) {
      console.warn('Error loading chat messages:', err);
    }

    const initial: Message[] = [
      {
        id: '1',
        text: `Hello! You are connected with ${recipientName}. How can we help you today?`,
        isSender: false,
        time: '10:00 AM'
      }
    ];
    setMessages(initial);
    AsyncStorage.setItem(chatStorageKey, JSON.stringify(initial)).catch(() => {});
  }, [chatStorageKey, recipientName]);

  useFocusEffect(
    React.useCallback(() => {
      shouldScrollToEndRef.current = true;
      loadMessages();

      const t1 = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
      const t2 = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 250);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, [loadMessages])
  );

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollToBottom = (animated = true) => {
    shouldScrollToEndRef.current = true;
    try {
      flatListRef.current?.scrollToEnd({ animated });
    } catch (_) {}
  };

  const triggerKeyboardScroll = () => {
    shouldScrollToEndRef.current = true;
    scrollToBottom(false);
    setTimeout(() => scrollToBottom(false), 50);
    setTimeout(() => scrollToBottom(true), 120);
    setTimeout(() => scrollToBottom(true), 250);
    setTimeout(() => scrollToBottom(true), 400);
  };

  useEffect(() => {
    const handleKeyboardShow = (e: any) => {
      const height = e?.endCoordinates?.height || 0;
      setKeyboardHeight(height);
      setShowChatEmojiPicker(false);
      triggerKeyboardScroll();
    };

    const handleKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const showSub1 = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      handleKeyboardShow
    );
    const showSub2 = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow
    );
    const hideSub1 = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      handleKeyboardHide
    );
    const hideSub2 = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide
    );

    return () => {
      showSub1.remove();
      showSub2.remove();
      hideSub1.remove();
      hideSub2.remove();
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  const handleMicTap = () => {
    Alert.alert(
      'Voice Message', 
      'Mic icon-ai azhuthi pidithu (Hold / Long press) pesavum. Pesiyavudan kaiyai eduthaal audio message automatic-ah send aagum.'
    );
  };

  const startRecording = async () => {
    if (isBlocked) {
      Alert.alert('Contact Blocked', `Unblock ${recipientName} to send voice messages.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unblock', onPress: () => setIsBlocked(false) }
      ]);
      return;
    }
    try {
      isCanceledRef.current = false;
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Microphone Permission', 'Audio record seiya microphone permission thevai.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordDuration(0);

      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Failed to start recording', err);
      // Fallback timer if environment limits audio hardware
      setIsRecording(true);
      setRecordDuration(0);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const cancelRecording = async () => {
    isCanceledRef.current = true;
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordDuration(0);
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (_) {}
      recordingRef.current = null;
    }
  };

  const stopAndSendRecording = async () => {
    if (!isRecording) return;

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    const currentDuration = recordDuration;
    setIsRecording(false);
    setRecordDuration(0);

    if (isCanceledRef.current) {
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch (_) {}
        recordingRef.current = null;
      }
      return;
    }

    let uri: string | null = null;
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
        uri = recordingRef.current.getURI();
      } catch (err) {
        console.warn('Error stopping recording', err);
      }
      recordingRef.current = null;
    }

    // Require at least 1 second recording
    if (currentDuration < 1) {
      return;
    }

    const mins = Math.floor(currentDuration / 60);
    const secs = currentDuration % 60;
    const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const messageId = Date.now().toString();
    const newAudioMessage: Message = {
      id: messageId,
      text: 'Voice message',
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'audio',
      audioUri: uri || undefined,
      audioDuration: formattedDuration,
      status: 'sent'
    };

    addMessageAndPersist(newAudioMessage);

    handleOutgoingMessageLifecycle(
      messageId,
      'Doctor received your audio message and will review it shortly.'
    );
  };

  const updateMessageStatus = (messageId: string, status: MessageStatus) => {
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === messageId ? { ...m, status } : m));
      AsyncStorage.setItem(chatStorageKey, JSON.stringify(updated)).catch((err) => {
        console.warn('Error saving updated message status:', err);
      });
      return updated;
    });
  };

  const handleOutgoingMessageLifecycle = (messageId: string, replyText: string) => {
    // 1. Delivered to recipient after 1.2s (Double gray tick)
    setTimeout(() => {
      updateMessageStatus(messageId, 'delivered');
    }, 1200);

    // 2. Read by recipient after 2.6s (Double blue tick)
    setTimeout(() => {
      updateMessageStatus(messageId, 'read');
    }, 2600);

    // 3. Opponent sends reply after 3.8s
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isSender: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addMessageAndPersist(replyMessage);
    }, 3800);
  };

  const addMessageAndPersist = (msg: Message) => {
    shouldScrollToEndRef.current = true;
    setMessages((prev) => {
      const updated = [...prev, msg];
      AsyncStorage.setItem(chatStorageKey, JSON.stringify(updated)).catch((err) => {
        console.warn('Error saving chat message:', err);
      });
      return updated;
    });
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear all messages in this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            const initial: Message[] = [
              {
                id: '1',
                text: `Hello! You are connected with ${recipientName}. How can we help you today?`,
                isSender: false,
                time: '10:00 AM'
              }
            ];
            setMessages(initial);
            await AsyncStorage.setItem(chatStorageKey, JSON.stringify(initial)).catch(() => {});
          }
        }
      ]
    );
  };

  const handleExportChat = () => {
    const exportPreview = messages
      .map((m) => `[${m.time}] ${m.isSender ? 'You' : recipientName}: ${m.type === 'audio' ? '🎤 Voice message' : m.text}`)
      .join('\n');

    Alert.alert(
      'Export Chat',
      `Conversation with ${recipientName} has ${messages.length} messages.\n\nPreview:\n${exportPreview.slice(0, 160)}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Copy / Share', 
          onPress: () => Alert.alert('Chat Exported', 'Full conversation transcript has been prepared.') 
        }
      ]
    );
  };

  const handleToggleBlock = () => {
    if (isBlocked) {
      Alert.alert(
        'Unblock Contact',
        `Unblock ${recipientName} to resume messaging and calls?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Unblock', 
            onPress: () => {
              setIsBlocked(false);
              Alert.alert('Unblocked', `${recipientName} has been unblocked.`);
            } 
          }
        ]
      );
    } else {
      Alert.alert(
        'Block Contact',
        `Blocked contacts will not be able to message or call you. Block ${recipientName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Block', 
            style: 'destructive',
            onPress: () => {
              setIsBlocked(true);
              Alert.alert('Blocked', `${recipientName} has been blocked.`);
            } 
          }
        ]
      );
    }
  };

  const toggleImageEmojiPicker = () => {
    if (showImageEmojiPicker) {
      setShowImageEmojiPicker(false);
      captionInputRef.current?.focus();
    } else {
      Keyboard.dismiss();
      setShowImageEmojiPicker(true);
    }
  };

  const handleSelectCaptionEmoji = (emoji: string) => {
    setImageCaption((prev) => prev + emoji);
  };

  const handleCaptionBackspace = () => {
    setImageCaption((prev) => {
      const arr = Array.from(prev);
      arr.pop();
      return arr.join('');
    });
  };

  const toggleChatEmojiPicker = () => {
    if (showChatEmojiPicker) {
      setShowChatEmojiPicker(false);
      inputRef.current?.focus();
    } else {
      Keyboard.dismiss();
      setShowAttachmentMenu(false);
      setShowChatEmojiPicker(true);
      triggerKeyboardScroll();
    }
  };

  const handleSelectChatEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleChatBackspace = () => {
    setInputText((prev) => {
      const arr = Array.from(prev);
      arr.pop();
      return arr.join('');
    });
  };

  const handleSendPendingImage = () => {
    if (!pendingImageUri) return;
    Keyboard.dismiss();
    setShowImageEmojiPicker(false);
    const messageId = Date.now().toString();
    const photoMessage: Message = {
      id: messageId,
      text: imageCaption.trim(),
      type: 'image',
      imageUri: pendingImageUri,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    addMessageAndPersist(photoMessage);
    handleOutgoingMessageLifecycle(messageId, 'Photo received clearly. Thank you.');
    setShowImagePreviewModal(false);
    setPendingImageUri(null);
    setImageCaption('');
  };

  const handleCancelPendingImage = () => {
    Keyboard.dismiss();
    setShowImageEmojiPicker(false);
    setShowImagePreviewModal(false);
    setPendingImageUri(null);
    setImageCaption('');
  };

  const toggleDocEmojiPicker = () => {
    if (showDocEmojiPicker) {
      setShowDocEmojiPicker(false);
      docCaptionInputRef.current?.focus();
    } else {
      Keyboard.dismiss();
      setShowDocEmojiPicker(true);
    }
  };

  const handleSelectDocCaptionEmoji = (emoji: string) => {
    setDocCaption((prev) => prev + emoji);
  };

  const handleDocCaptionBackspace = () => {
    setDocCaption((prev) => {
      const arr = Array.from(prev);
      arr.pop();
      return arr.join('');
    });
  };

  const handleSendPendingDoc = () => {
    if (!pendingDoc) return;
    Keyboard.dismiss();
    setShowDocEmojiPicker(false);
    const messageId = Date.now().toString();
    const caption = docCaption.trim();

    const docMessage: Message = {
      id: messageId,
      text: caption.length > 0 ? caption : pendingDoc.name,
      type: 'document',
      documentUri: pendingDoc.uri,
      documentName: pendingDoc.name,
      documentSize: pendingDoc.size,
      documentPages: docPagesCount || '1 page',
      documentMimeType: pendingDoc.mimeType,
      firstPageThumbnail: (firstPageUri && firstPageUri !== 'default_pdf' && firstPageUri !== 'rendering') ? firstPageUri : undefined,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    addMessageAndPersist(docMessage);
    showToast('Document sent successfully');
    handleOutgoingMessageLifecycle(
      messageId, 
      `Received your document (${pendingDoc.name}). The doctor is reviewing your report.`
    );
    setShowDocPreviewModal(false);
    setPendingDoc(null);
    setFirstPageUri(null);
    setIsRenderingFirstPage(false);
    setDocCaption('');
  };

  const handleCancelPendingDoc = () => {
    Keyboard.dismiss();
    setShowDocEmojiPicker(false);
    setShowDocPreviewModal(false);
    setPendingDoc(null);
    setFirstPageUri(null);
    setIsRenderingFirstPage(false);
    setDocCaption('');
  };

  const pickImage = async () => {
    setShowAttachmentMenu(false);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photo gallery.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setPendingImageUri(asset.uri);
      setImageCaption('');
      setShowImageEmojiPicker(false);
      setShowImagePreviewModal(true);
    }
  };

  const pickDocument = async () => {
    setShowAttachmentMenu(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const docUri = asset.uri;
        const cleanName = cleanDocumentName(asset.name, asset.uri, 'Medical_Report.pdf');
        const docSizeInBytes = asset.size;

        // Calculate formatted size (KB / MB)
        let formattedSize = 'Document';
        if (typeof docSizeInBytes === 'number' && docSizeInBytes > 0) {
          if (docSizeInBytes < 1024) {
            formattedSize = `${docSizeInBytes} B`;
          } else if (docSizeInBytes < 1024 * 1024) {
            formattedSize = `${(docSizeInBytes / 1024).toFixed(1)} KB`;
          } else {
            formattedSize = `${(docSizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
          }
        }

        const nameOrUriLower = (cleanName + ' ' + (asset.name || '') + ' ' + (asset.uri || '')).toLowerCase();
        const isPdf = cleanName.toLowerCase().endsWith('.pdf') || asset.mimeType?.includes('pdf') || nameOrUriLower.includes('.pdf');

        // Document selection state reset
        setFirstPageUri(null);
        setIsRenderingFirstPage(false);
        setDocPagesCount('1 page');

        setPendingDoc({
          uri: docUri,
          name: cleanName,
          size: formattedSize,
          mimeType: asset.mimeType || (isPdf ? 'application/pdf' : 'application/octet-stream'),
        });
        setDocCaption('');
        setShowDocEmojiPicker(false);
        setShowDocPreviewModal(true);
      }
    } catch (err) {
      console.warn('Error picking document:', err);
      Alert.alert('Document Picker', 'Unable to select document. Please try again.');
    }
  };

  const handleOpenMediaItem = async (msg: Message) => {
    try {
      let fileUri = msg.documentUri;
      const docName = msg.documentName || msg.text || 'Document.pdf';

      if (!fileUri && (msg.type === 'document' || docName.toLowerCase().endsWith('.pdf'))) {
        const { uri } = await Print.printToFileAsync({
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #1e293b; }
                  .header { border-bottom: 2px solid #3c72f2; padding-bottom: 14px; margin-bottom: 20px; }
                  .clinic-title { font-size: 22px; font-weight: 700; color: #3c72f2; }
                  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; }
                  .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="clinic-title">HEALTHCARE MEDICAL CLINIC</div>
                  <p>Official Electronic Medical Record</p>
                </div>
                <div class="card">
                  <div class="row"><span><strong>Document:</strong></span> <span>${docName}</span></div>
                  <div class="row"><span><strong>Date:</strong></span> <span>${new Date().toLocaleDateString()}</span></div>
                </div>
                <p>Consultation report verified and recorded electronically.</p>
              </body>
            </html>
          `,
        });
        fileUri = uri;
      }

      if (fileUri) {
        const mime = msg.documentMimeType || (docName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : '*/*');

        if (Platform.OS === 'android') {
          try {
            let contentUri = fileUri;
            if (fileUri.startsWith('file://')) {
              contentUri = await FileSystem.getContentUriAsync(fileUri);
            }
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: contentUri,
              flags: 1,
              type: mime,
            });
            return;
          } catch (intentErr) {
            console.warn('IntentLauncher failed, falling back to Sharing:', intentErr);
          }
        }

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, {
            mimeType: mime,
            dialogTitle: 'Open with...',
          });
          return;
        }
      }

      Alert.alert(docName, `File: ${docName}\nReady to view.`);
    } catch (err) {
      console.warn('Error opening media item:', err);
      Alert.alert('Open with', 'Could not open file.');
    }
  };

  const pickContact = () => {
    setShowAttachmentMenu(false);
    Alert.alert('Contacts', 'Contact picker opens here.');
  };

  const pickCamera = async () => {
    setShowAttachmentMenu(false);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to capture photos.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setPendingImageUri(asset.uri);
      setImageCaption('');
      setShowImageEmojiPicker(false);
      setShowImagePreviewModal(true);
    }
  };

  const pickAudio = () => {
    setShowAttachmentMenu(false);
    Alert.alert('Audio', 'Audio picker opens here.');
  };

  const handleCancelSelection = () => {
    setSelectedMessageIds([]);
    setSelectedMessage(null);
  };

  const handleBack = () => {
    if (showChatEmojiPicker) {
      setShowChatEmojiPicker(false);
      return;
    }
    if (selectedMessageIds.length > 0) {
      handleCancelSelection();
      return;
    }
    if (isSearchMode) {
      setIsSearchMode(false);
      setSearchQuery('');
      return;
    }
    navigation.goBack();
  };

  useEffect(() => {
    const onBackPress = () => {
      if (showChatEmojiPicker) {
        setShowChatEmojiPicker(false);
        return true;
      }
      if (selectedMessageIds.length > 0) {
        handleCancelSelection();
        return true;
      }
      if (isSearchMode) {
        setIsSearchMode(false);
        setSearchQuery('');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [selectedMessageIds.length, isSearchMode, showChatEmojiPicker]);

  const handleMessagePress = (msg: Message) => {
    if (selectedMessageIds.length === 0) return;

    setSelectedMessageIds((prev) => {
      const exists = prev.includes(msg.id);
      const next = exists ? prev.filter((id) => id !== msg.id) : [...prev, msg.id];
      if (next.length === 0) {
        setSelectedMessage(null);
      } else if (next.length === 1) {
        const found = messages.find((m) => m.id === next[0]) || null;
        setSelectedMessage(found);
      } else {
        setSelectedMessage(null);
      }
      return next;
    });
  };

  const handleMessageLongPress = (msg: Message) => {
    if (selectedMessageIds.includes(msg.id)) {
      handleMessagePress(msg);
      return;
    }
    setSelectedMessageIds((prev) => {
      const next = [...prev, msg.id];
      if (next.length === 1) {
        setSelectedMessage(msg);
      } else {
        setSelectedMessage(null);
      }
      return next;
    });
  };

  const handleEditSelected = () => {
    if (selectedMessageIds.length !== 1) return;
    const msg = messages.find((m) => m.id === selectedMessageIds[0]);
    if (!msg || !msg.isSender || msg.isDeleted || msg.type === 'audio') return;
    setEditingMessage(msg);
    setInputText(msg.text);
    handleCancelSelection();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleCopySelected = async () => {
    const selectedMsgs = messages.filter((m) => selectedMessageIds.includes(m.id));
    if (selectedMsgs.length === 0) return;

    const textToCopy = selectedMsgs
      .map((m) => {
        if (m.isDeleted) return 'This message was deleted';
        if (m.type === 'audio') return '🎤 Voice message';
        if (m.type === 'image' || m.imageUri) return m.text || '📷 Photo';
        return m.text;
      })
      .filter(Boolean)
      .join('\n');

    try {
      await Clipboard.setStringAsync(textToCopy);
      showToast('Copied');
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
    handleCancelSelection();
  };

  const handleForwardSelected = () => {
    setShowForwardModal(true);
  };

  const handleDeleteMultiSelected = () => {
    if (selectedMessageIds.length === 0) return;
    setShowDeleteModal(true);
  };

  const handleDeleteForMe = () => {
    setShowDeleteModal(false);
    const count = selectedMessageIds.length;
    if (count === 0) return;
    setMessages((prev) => {
      const updated = prev.filter((m) => !selectedMessageIds.includes(m.id));
      AsyncStorage.setItem(chatStorageKey, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    handleCancelSelection();
    showToast(count === 1 ? 'Message deleted' : `${count} messages deleted`);
  };

  const handleDeleteForEveryone = () => {
    setShowDeleteModal(false);
    const count = selectedMessageIds.length;
    if (count === 0) return;
    setMessages((prev) => {
      const updated = prev.map((m) => 
        selectedMessageIds.includes(m.id) ? { ...m, isDeleted: true } : m
      );
      AsyncStorage.setItem(chatStorageKey, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    handleCancelSelection();
    showToast(count === 1 ? 'Deleted for everyone' : `${count} messages deleted for everyone`);
  };

  const handleReplySelected = () => {
    if (selectedMessageIds.length !== 1) return;
    const msg = messages.find((m) => m.id === selectedMessageIds[0]);
    if (!msg) return;
    setReplyingTo(msg);
    handleCancelSelection();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleSelectReaction = (messageId: string, reaction: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id === messageId) {
          const newReaction = m.reaction === reaction ? undefined : reaction;
          return { ...m, reaction: newReaction };
        }
        return m;
      });
      AsyncStorage.setItem(chatStorageKey, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    handleCancelSelection();
  };

  const handleForwardToContact = (contactName: string) => {
    setShowForwardModal(false);
    let msgsToForward = messages.filter((m) => selectedMessageIds.includes(m.id));
    if (msgsToForward.length === 0 && selectedMessage) {
      msgsToForward = [selectedMessage];
    }
    if (msgsToForward.length === 0) return;

    const baseId = Date.now();
    const forwardedList: Message[] = msgsToForward.map((msg, index) => ({
      id: (baseId + index).toString(),
      text: msg.type === 'audio' 
        ? '↪ Forwarded voice note' 
        : msg.type === 'image'
          ? (msg.text ? `↪ Forwarded: ${msg.text}` : '')
          : `↪ Forwarded: ${msg.text}`,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: msg.type,
      audioUri: msg.audioUri,
      audioDuration: msg.audioDuration,
      imageUri: msg.imageUri,
      status: 'sent'
    }));

    setMessages((prev) => {
      const updated = [...prev, ...forwardedList];
      AsyncStorage.setItem(chatStorageKey, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    handleOutgoingMessageLifecycle(
      forwardedList[forwardedList.length - 1].id,
      `Forwarded ${forwardedList.length} message(s) to ${contactName} successfully.`
    );

    Alert.alert('Forwarded', `${forwardedList.length} message(s) forwarded to ${contactName}.`);
    handleCancelSelection();
  };


  const sendMessage = () => {
    if (isBlocked) {
      Alert.alert('Contact Blocked', `Unblock ${recipientName} to send messages.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unblock', onPress: () => setIsBlocked(false) }
      ]);
      return;
    }
    if (inputText.trim().length === 0) return;
    
    if (editingMessage) {
      const updatedText = inputText.trim();
      const editId = editingMessage.id;
      setMessages((prev) => {
        const updated = prev.map((m) => (m.id === editId ? { ...m, text: updatedText, isEdited: true } : m));
        AsyncStorage.setItem(chatStorageKey, JSON.stringify(updated)).catch(() => {});
        return updated;
      });
      setEditingMessage(null);
      setInputText('');
      setShowChatEmojiPicker(false);
      return;
    }

    const messageId = Date.now().toString();
    const replyMeta = replyingTo ? {
      id: replyingTo.id,
      text: replyingTo.type === 'audio' ? '🎤 Voice message' : replyingTo.text,
      senderName: replyingTo.isSender ? 'You' : recipientName
    } : undefined;

    const newMessage: Message = {
      id: messageId,
      text: inputText.trim(),
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      replyTo: replyMeta,
    };
    
    addMessageAndPersist(newMessage);
    setInputText('');
    setReplyingTo(null);
    setShowChatEmojiPicker(false);

    handleOutgoingMessageLifecycle(
      messageId,
      'Thank you for your message. We will get back to you shortly.'
    );
  };

  const filteredMessages = isSearchMode && searchQuery.trim().length > 0
    ? messages.filter((m) => 
        (m.text && m.text.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
        (m.replyTo?.text && m.replyTo.text.toLowerCase().includes(searchQuery.trim().toLowerCase()))
      )
    : messages;

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isSingleSelected = selectedMessageIds.length === 1 && selectedMessageIds[0] === item.id;
    const isLast = index === filteredMessages.length - 1;
    return (
      <View style={isLast ? { marginBottom: 6 } : undefined}>
        <ChatBubble 
          item={item} 
          onLongPress={handleMessageLongPress}
          onPress={handleMessagePress}
          isSelected={selectedMessageIds.includes(item.id)}
          isSelectionMode={selectedMessageIds.length > 0}
          showReactionPicker={isSingleSelected}
          onSelectReaction={handleSelectReaction}
          onForward={(msg) => {
            setSelectedMessage(msg);
            setShowForwardModal(true);
          }}
        />
      </View>
    );
  };

  const selectedMsgs = messages.filter((m) => selectedMessageIds.includes(m.id));
  const isAllSender = selectedMsgs.length > 0 && selectedMsgs.every((m) => m.isSender && !m.isDeleted);
  const deleteCount = selectedMessageIds.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {selectedMessageIds.length > 0 ? (
        <View style={styles.selectionHeader}>
          <View style={styles.selectionLeftGroup}>
            <TouchableOpacity 
              style={styles.selectionCloseBtn} 
              onPress={handleCancelSelection}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.selectionCountText}>
              {selectedMessageIds.length} Selected
            </Text>
          </View>

          <View style={styles.selectionRightGroup}>
            {selectedMessageIds.length === 1 && (
              <TouchableOpacity 
                style={styles.selectionActionBtn} 
                onPress={handleReplySelected}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-undo-outline" size={21} color="#334155" />
              </TouchableOpacity>
            )}

            {selectedMessageIds.length === 1 && selectedMessage?.isSender && !selectedMessage?.isDeleted && selectedMessage?.type !== 'audio' && (
              <TouchableOpacity 
                style={styles.selectionActionBtn} 
                onPress={handleEditSelected}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={21} color="#334155" />
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.selectionActionBtn} 
              onPress={handleCopySelected}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={21} color="#334155" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.selectionActionBtn} 
              onPress={handleForwardSelected}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-redo-outline" size={21} color="#334155" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.selectionActionBtn} 
              onPress={handleDeleteMultiSelected}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={21} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ) : isSearchMode ? (
        <View style={styles.searchHeader}>
          <TouchableOpacity 
            style={styles.searchHeaderBackBtn} 
            onPress={() => {
              setIsSearchMode(false);
              setSearchQuery('');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchHeaderInput}
              placeholder="Search in conversation..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.searchCloseTextBtn}
            onPress={() => {
              setIsSearchMode(false);
              setSearchQuery('');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.searchCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header}>
          <BackButton onPress={handleBack} />
          <TouchableOpacity 
            style={styles.headerTitleContainer} 
            onPress={() => setShowContactInfoModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerTitle} numberOfLines={1}>{recipientName}</Text>
            <View style={styles.onlineBadgeRow}>
              <View style={[styles.onlineDot, isBlocked && { backgroundColor: '#94A3B8' }]} />
              <Text style={styles.headerSubtitle}>
                {isBlocked ? 'Blocked' : isMuted ? 'Muted • Online' : 'Online'}
              </Text>
              {isMuted && (
                <Ionicons name="volume-mute" size={13} color="#94A3B8" style={{ marginLeft: 4 }} />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconBtn} 
            onPress={() => Alert.alert('Voice Call', `Calling ${recipientName}...`)}
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={22} color={Colors.color3C72F2} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconBtn} 
            onPress={() => setShowOverflowMenu(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={21} color="#475569" />
          </TouchableOpacity>
        </View>
      )}

      {isSearchMode && searchQuery.trim().length > 0 && (
        <View style={styles.searchResultBar}>
          <Text style={styles.searchResultText}>
            {filteredMessages.length} message{filteredMessages.length === 1 ? '' : 's'} found
          </Text>
        </View>
      )}

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[styles.chatList, filteredMessages.length === 0 && { flex: 1, justifyContent: 'center' }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          initialNumToRender={50}
          maxToRenderPerBatch={50}
          onContentSizeChange={() => {
            if (shouldScrollToEndRef.current || isFocused || keyboardHeight > 0 || showChatEmojiPicker) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            if (shouldScrollToEndRef.current || isFocused || keyboardHeight > 0 || showChatEmojiPicker) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          onScrollBeginDrag={() => {
            setShowChatEmojiPicker(false);
            shouldScrollToEndRef.current = false;
          }}
          onMomentumScrollEnd={(e) => {
            const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
            const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 80;
            shouldScrollToEndRef.current = isNearBottom;
          }}
          ListEmptyComponent={
            isSearchMode && searchQuery.trim().length > 0 ? (
              <View style={styles.emptySearchContainer}>
                <Ionicons name="search-outline" size={42} color="#CBD5E1" />
                <Text style={styles.emptySearchTitle}>No messages found</Text>
                <Text style={styles.emptySearchSubtitle}>
                  No messages matching "{searchQuery}" in this chat
                </Text>
              </View>
            ) : undefined
          }
        />

        {showAttachmentMenu && (
          <View style={styles.attachmentMenu}>
            <TouchableOpacity style={styles.attachmentOption} onPress={pickDocument}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#5E66D1' }]}>
                <Ionicons name="document-text" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Document</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachmentOption} onPress={pickCamera}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#D93025' }]}>
                <Ionicons name="camera" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#E95273' }]}>
                <Ionicons name="image" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={pickAudio}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#E87C28' }]}>
                <Ionicons name="headset" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={pickContact}>
              <View style={[styles.attachmentIconWrapper, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="person" size={26} color="#FFF" />
              </View>
              <Text style={styles.attachmentText}>Contact</Text>
            </TouchableOpacity>
          </View>
        )}

        {replyingTo && (
          <View style={styles.replyPreviewBar}>
            <View style={styles.replyAccentLine} />
            <View style={styles.replyPreviewContent}>
              <Text style={styles.replyPreviewSender} numberOfLines={1}>
                Replying to {replyingTo.isSender ? 'You' : recipientName}
              </Text>
              <Text style={styles.replyPreviewText} numberOfLines={1}>
                {replyingTo.type === 'audio' ? '🎤 Voice message' : replyingTo.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyingTo(null)} style={styles.closeReplyBtn}>
              <Ionicons name="close-circle" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        )}

        {editingMessage && (
          <View style={styles.editPreviewBar}>
            <Ionicons name="create-outline" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
            <View style={styles.editPreviewContent}>
              <Text style={styles.editPreviewTitle}>Editing message</Text>
              <Text style={styles.editPreviewText} numberOfLines={1}>{editingMessage.text}</Text>
            </View>
            <TouchableOpacity onPress={() => { setEditingMessage(null); setInputText(''); }} style={styles.closeReplyBtn}>
              <Ionicons name="close-circle" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        )}

        {isBlocked ? (
          <View style={[styles.blockedBannerContainer, { paddingBottom: Math.max(insets.bottom, 14) + 8 }]}>
            <Ionicons name="ban-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.blockedBannerText}>You have blocked {recipientName}.</Text>
            <TouchableOpacity onPress={() => setIsBlocked(false)} style={styles.unblockBannerBtn}>
              <Text style={styles.unblockBannerBtnText}>Unblock</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View 
            style={[
              styles.inputContainer, 
              { 
                paddingBottom: (keyboardHeight > 0 || showChatEmojiPicker) 
                  ? 6 
                  : (Platform.OS === 'ios' ? Math.max(insets.bottom, 12) + 4 : Math.max(insets.bottom, 0) + 10),
                marginBottom: (Platform.OS === 'android' && !showChatEmojiPicker) ? keyboardHeight : 0,
              }
            ]}
          >
            {isRecording ? (
              <View style={styles.recordingContainer}>
                <TouchableOpacity 
                  style={styles.cancelRecordingBtn} 
                  onPress={cancelRecording}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>

                <View style={styles.recordingIndicator}>
                  <View style={styles.redDot} />
                  <Text style={styles.recordingTime}>
                    {Math.floor(recordDuration / 60)}:{recordDuration % 60 < 10 ? '0' : ''}{recordDuration % 60}
                  </Text>
                  <Text style={styles.recordingPrompt} numberOfLines={1}>Recording... Release to send</Text>
                </View>
              </View>
            ) : (
              <Pressable 
                style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
                onPress={() => inputRef.current?.focus()}
              >
                <TouchableOpacity 
                  style={styles.innerAttachButton} 
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowChatEmojiPicker(false);
                    setShowAttachmentMenu(!showAttachmentMenu);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showAttachmentMenu ? "close-circle" : "attach"} 
                    size={23} 
                    color={showAttachmentMenu ? Colors.colorEF4444 : Colors.color666} 
                  />
                </TouchableOpacity>
                
                <TextInput
                  ref={inputRef}
                  style={styles.textInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={setInputText}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowAttachmentMenu(false);
                    setShowChatEmojiPicker(false);
                    triggerKeyboardScroll();
                  }}
                  onBlur={() => setIsFocused(false)}
                  multiline
                />

                <TouchableOpacity 
                  style={[styles.keyboardIconBtn, showChatEmojiPicker && styles.keyboardIconBtnActive]} 
                  onPress={toggleChatEmojiPicker}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialCommunityIcons 
                    name={showChatEmojiPicker ? "keyboard" : "keyboard-outline"} 
                    size={22} 
                    color={showChatEmojiPicker ? Colors.color3C72F2 : "#64748B"} 
                  />
                </TouchableOpacity>
              </Pressable>
            )}
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                isRecording && styles.sendButtonRecording
              ]} 
              onPress={inputText.trim().length > 0 ? sendMessage : handleMicTap}
              onLongPress={inputText.trim().length === 0 ? startRecording : undefined}
              onPressOut={inputText.trim().length === 0 ? stopAndSendRecording : undefined}
              delayLongPress={150}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={inputText.trim().length > 0 ? (editingMessage ? "checkmark" : "send") : "mic"} 
                size={inputText.trim().length > 0 ? (editingMessage ? 22 : 18) : (isRecording ? 25 : 22)} 
                color={Colors.colorFFF} 
                style={inputText.trim().length > 0 && !editingMessage ? { marginLeft: 2 } : undefined}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Chat Emoji Keyboard Panel */}
        {showChatEmojiPicker && (
          <View style={styles.chatEmojiPickerContainer}>
            <View style={styles.chatEmojiHeaderRow}>
              <View style={styles.chatEmojiTitleBadge}>
                <Ionicons name="sparkles" size={13} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={styles.chatEmojiTitleText}>EMOJIS</Text>
              </View>
              <Text style={styles.chatEmojiCountText}>{CAPTION_EMOJIS.length} available</Text>
            </View>
            <ScrollView 
              contentContainerStyle={styles.imageEmojiScrollContent}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              {CAPTION_EMOJIS.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageEmojiItem}
                  onPress={() => handleSelectChatEmoji(emoji)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.imageEmojiChar}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.chatEmojiBottomBar}>
              <TouchableOpacity 
                style={styles.imageEmojiBackspaceBtn}
                onPress={handleChatBackspace}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="backspace-outline" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>


      {/* Normal Clean Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable 
          style={styles.deleteModalOverlay}
          onPress={() => setShowDeleteModal(false)}
        >
          <Pressable 
            style={styles.deleteDialogCard}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.deleteDialogTitle}>
              {deleteCount === 1 ? 'Delete message?' : `Delete ${deleteCount} messages?`}
            </Text>

            <View style={styles.deleteButtonStack}>
              {isAllSender && (
                <TouchableOpacity 
                  style={styles.deleteActionBtn} 
                  onPress={handleDeleteForEveryone}
                  activeOpacity={0.6}
                >
                  <Text style={styles.deleteActionPrimaryText}>Delete for everyone</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.deleteActionBtn} 
                onPress={handleDeleteForMe}
                activeOpacity={0.6}
              >
                <Text style={styles.deleteActionPrimaryText}>Delete for me</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteActionBtn} 
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.6}
              >
                <Text style={styles.deleteActionCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Forward Modal */}
      <Modal
        visible={showForwardModal}
        transparent
        statusBarTranslucent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowForwardModal(false);
          setSelectedMessage(null);
        }}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => {
            setShowForwardModal(false);
            setSelectedMessage(null);
          }}
        >
          <View style={styles.forwardSheetContainer}>
            <View style={styles.forwardHeader}>
              <Text style={styles.forwardTitle}>Forward Message To</Text>
              <TouchableOpacity onPress={() => setShowForwardModal(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.forwardList}>
              {[
                { name: 'Dr. John Doe', spec: 'Cardiologist' },
                { name: 'Dr. Sarah Smith', spec: 'Cardiologist' },
                { name: 'Dr. Peter Parker', spec: 'Neurologist' },
                { name: 'Dr. Emily Rose', spec: 'Dentist' },
                { name: 'Dr. Bruce Wayne', spec: 'Orthopedist' },
                { name: recipientName, spec: 'Current Chat' },
              ].map((contact, idx) => (
                <TouchableOpacity 
                  key={idx}
                  style={styles.forwardItem}
                  onPress={() => handleForwardToContact(contact.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.forwardAvatar}>
                    <Ionicons name="person" size={20} color="#FFF" />
                  </View>
                  <View style={styles.forwardItemInfo}>
                    <Text style={styles.forwardItemName}>{contact.name}</Text>
                    <Text style={styles.forwardItemSpec}>{contact.spec}</Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={24} color={Colors.color3C72F2} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Three-Dot Overflow Dropdown Menu */}
      <Modal
        visible={showOverflowMenu}
        transparent
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={() => setShowOverflowMenu(false)}
      >
        <Pressable 
          style={styles.dropdownOverlay} 
          onPress={() => setShowOverflowMenu(false)}
        >
          <View style={[styles.overflowMenuCard, { top: (insets.top || 20) + 48 }]}>
            <TouchableOpacity 
              style={styles.overflowMenuItem} 
              onPress={() => {
                setShowOverflowMenu(false);
                setIsSearchMode(true);
              }}
              activeOpacity={0.6}
            >
              <Ionicons name="search-outline" size={18} color="#334155" style={styles.overflowMenuIcon} />
              <Text style={styles.overflowMenuText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.overflowMenuItem} 
              onPress={() => {
                setShowOverflowMenu(false);
                setShowContactInfoModal(true);
              }}
              activeOpacity={0.6}
            >
              <Ionicons name="person-circle-outline" size={18} color="#334155" style={styles.overflowMenuIcon} />
              <Text style={styles.overflowMenuText}>View Contact Info</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.overflowMenuItem} 
              onPress={() => {
                setShowOverflowMenu(false);
                setShowMediaModal(true);
              }}
              activeOpacity={0.6}
            >
              <Ionicons name="images-outline" size={18} color="#334155" style={styles.overflowMenuIcon} />
              <Text style={styles.overflowMenuText}>Media & Docs</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.overflowMenuItem} 
              onPress={() => {
                setShowOverflowMenu(false);
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                Alert.alert(
                  nextMuted ? 'Notifications Muted' : 'Notifications Unmuted',
                  nextMuted 
                    ? `Notifications from ${recipientName} have been muted.`
                    : `You will now receive notifications from ${recipientName}.`
                );
              }}
              activeOpacity={0.6}
            >
              <Ionicons 
                name={isMuted ? "notifications-outline" : "notifications-off-outline"} 
                size={18} 
                color="#334155" 
                style={styles.overflowMenuIcon} 
              />
              <Text style={styles.overflowMenuText}>
                {isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.overflowMenuItem} 
              onPress={() => {
                setShowOverflowMenu(false);
                handleExportChat();
              }}
              activeOpacity={0.6}
            >
              <Ionicons name="share-outline" size={18} color="#334155" style={styles.overflowMenuIcon} />
              <Text style={styles.overflowMenuText}>Export Chat</Text>
            </TouchableOpacity>

            <View style={styles.overflowMenuDivider} />

            <TouchableOpacity 
              style={styles.overflowMenuItem} 
              onPress={() => {
                setShowOverflowMenu(false);
                handleClearChat();
              }}
              activeOpacity={0.6}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" style={styles.overflowMenuIcon} />
              <Text style={[styles.overflowMenuText, { color: '#EF4444' }]}>Clear History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.overflowMenuItem} 
              onPress={() => {
                setShowOverflowMenu(false);
                handleToggleBlock();
              }}
              activeOpacity={0.6}
            >
              <Ionicons name="ban-outline" size={18} color="#EF4444" style={styles.overflowMenuIcon} />
              <Text style={[styles.overflowMenuText, { color: '#EF4444' }]}>
                {isBlocked ? 'Unblock Contact' : 'Block Contact'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Contact Info Modal */}
      <Modal
        visible={showContactInfoModal}
        transparent
        statusBarTranslucent={true}
        animationType="slide"
        onRequestClose={() => setShowContactInfoModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowContactInfoModal(false)}
        >
          <View style={styles.infoSheetContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>Contact Details</Text>
              <TouchableOpacity onPress={() => setShowContactInfoModal(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoProfileCard}>
              <View style={styles.infoAvatar}>
                <Ionicons name="person" size={36} color="#FFF" />
              </View>
              <Text style={styles.infoName}>{recipientName}</Text>
              <Text style={styles.infoBadge}>Verified Healthcare Provider</Text>
              <View style={styles.infoStatusRow}>
                <View style={[styles.onlineDot, isBlocked && { backgroundColor: '#94A3B8' }]} />
                <Text style={styles.infoStatusText}>
                  {isBlocked ? 'Blocked' : isMuted ? 'Muted • Online' : 'Online & Available'}
                </Text>
              </View>
            </View>

            <View style={styles.infoActionRow}>
              <TouchableOpacity 
                style={styles.infoActionBtn} 
                onPress={() => {
                  setShowContactInfoModal(false);
                  Alert.alert('Voice Call', `Calling ${recipientName}...`);
                }}
              >
                <View style={[styles.infoActionIconWrap, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="call" size={20} color={Colors.color3C72F2} />
                </View>
                <Text style={styles.infoActionLabel}>Voice Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.infoActionBtn} 
                onPress={() => {
                  setShowContactInfoModal(false);
                  Alert.alert('Video Call', `Starting video consultation with ${recipientName}...`);
                }}
              >
                <View style={[styles.infoActionIconWrap, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="videocam" size={20} color="#10B981" />
                </View>
                <Text style={styles.infoActionLabel}>Video Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.infoActionBtn} 
                onPress={() => {
                  const next = !isMuted;
                  setIsMuted(next);
                  Alert.alert(
                    next ? 'Notifications Muted' : 'Notifications Unmuted',
                    next ? `Notifications from ${recipientName} muted.` : `Notifications from ${recipientName} unmuted.`
                  );
                }}
              >
                <View style={[styles.infoActionIconWrap, { backgroundColor: '#FFFBEB' }]}>
                  <Ionicons name={isMuted ? "notifications" : "notifications-off"} size={20} color="#F59E0B" />
                </View>
                <Text style={styles.infoActionLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoDetailsList}>
              <View style={styles.infoDetailItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.color3C72F2} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoDetailLabel}>Security</Text>
                  <Text style={styles.infoDetailVal}>End-to-end encrypted medical chat</Text>
                </View>
              </View>

              <View style={styles.infoDetailItem}>
                <Ionicons name="time-outline" size={20} color={Colors.color3C72F2} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoDetailLabel}>Operating Hours</Text>
                  <Text style={styles.infoDetailVal}>Mon - Sat: 08:00 AM - 08:00 PM</Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Media & Docs Modal */}
      <Modal
        visible={showMediaModal}
        transparent
        statusBarTranslucent={true}
        animationType="slide"
        onRequestClose={() => setShowMediaModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowMediaModal(false)}
        >
          <View style={styles.mediaSheetContainer}>
            <View style={styles.mediaHeader}>
              <Text style={styles.mediaTitle}>Shared Media & Docs</Text>
              <TouchableOpacity onPress={() => setShowMediaModal(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              <View style={styles.mediaSummaryBox}>
                <View style={styles.mediaStatItem}>
                  <Ionicons name="image" size={22} color="#E95273" />
                  <Text style={styles.mediaStatCount}>
                    {messages.filter(m => m.type === 'image' || m.imageUri || m.text?.includes('Photo')).length}
                  </Text>
                  <Text style={styles.mediaStatLabel}>Photos</Text>
                </View>
                <View style={styles.mediaStatDivider} />
                <View style={styles.mediaStatItem}>
                  <Ionicons name="document-text" size={22} color="#5E66D1" />
                  <Text style={styles.mediaStatCount}>
                    {messages.filter(m => m.type === 'document' || !!m.documentUri || m.text?.includes('Document') || m.text?.includes('.pdf') || m.text?.includes('.doc')).length}
                  </Text>
                  <Text style={styles.mediaStatLabel}>Docs</Text>
                </View>
                <View style={styles.mediaStatDivider} />
                <View style={styles.mediaStatItem}>
                  <Ionicons name="mic" size={22} color="#0EA5E9" />
                  <Text style={styles.mediaStatCount}>
                    {messages.filter(m => m.type === 'audio').length}
                  </Text>
                  <Text style={styles.mediaStatLabel}>Voice Notes</Text>
                </View>
              </View>

              <Text style={styles.mediaSectionTitle}>Recent Attachments</Text>
              {messages.filter(m => m.type === 'audio' || m.type === 'image' || m.type === 'document' || !!m.imageUri || !!m.documentUri || m.text?.includes('Document')).length === 0 ? (
                <View style={{ paddingVertical: 26, alignItems: 'center' }}>
                  <Ionicons name="folder-open-outline" size={38} color="#CBD5E1" />
                  <Text style={{ marginTop: 8, fontSize: 13, color: '#94A3B8' }}>No media or files shared yet</Text>
                </View>
              ) : (
                messages
                  .filter(m => m.type === 'audio' || m.type === 'image' || m.type === 'document' || !!m.imageUri || !!m.documentUri || m.text?.includes('Document'))
                  .map((item, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={styles.mediaFileRow}
                      onPress={() => handleOpenMediaItem(item)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.mediaFileIconWrap,
                        item.type === 'audio' 
                          ? { backgroundColor: '#E0F2FE' } 
                          : (item.type === 'image' || item.imageUri 
                              ? { backgroundColor: '#FCE7F3' } 
                              : { backgroundColor: '#FEE2E2' })
                      ]}>
                        <Ionicons 
                          name={item.type === 'audio' ? 'mic' : (item.type === 'image' || item.imageUri ? 'image' : 'document-text')} 
                          size={18} 
                          color={item.type === 'audio' ? '#0284C7' : (item.type === 'image' || item.imageUri ? '#E11D48' : '#EF4444')} 
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.mediaFileName} numberOfLines={1}>{item.text || (item.imageUri ? 'Photo' : 'Media file')}</Text>
                        <Text style={styles.mediaFileMeta}>{item.isSender ? 'Sent by you' : 'Received'} • {item.time}</Text>
                      </View>
                      <Ionicons name="open-outline" size={18} color="#94A3B8" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                  ))
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Bottom Center Floating Toast (e.g. Copied) */}
      {toastMessage && (
        <Animated.View 
          pointerEvents="none" 
          style={[styles.toastContainer, { opacity: toastOpacity }]}
        >
          <View style={styles.toastPill}>
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}

      {/* WhatsApp-Style Image Preview & Optional Caption Modal */}
      <Modal
        visible={showImagePreviewModal}
        transparent={false}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCancelPendingImage}
      >
        <SafeAreaView style={styles.imagePreviewSafeArea} edges={['top']}>
          {/* Top Header */}
          <View style={styles.imagePreviewHeader}>
            <TouchableOpacity 
              style={styles.imagePreviewCloseBtn}
              onPress={handleCancelPendingImage}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.imagePreviewHeaderInfo}>
              <Text style={styles.imagePreviewRecipientTitle}>Send to</Text>
              <Text style={styles.imagePreviewRecipientName} numberOfLines={1}>{recipientName}</Text>
            </View>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Image Display */}
            <Pressable 
              style={styles.imagePreviewBody} 
              onPress={() => {
                Keyboard.dismiss();
                setShowImageEmojiPicker(false);
              }}
            >
              {pendingImageUri ? (
                <Image 
                  source={{ uri: pendingImageUri }} 
                  style={styles.imagePreviewImage} 
                  resizeMode="contain"
                />
              ) : null}
            </Pressable>

            {/* Bottom Caption & Send Bar */}
            <View 
              style={[
                styles.imageCaptionBar,
                { 
                  marginBottom: showImageEmojiPicker ? 0 : (Platform.OS === 'android' ? keyboardHeight : 0),
                  paddingBottom: (keyboardHeight > 0 || showImageEmojiPicker) ? 10 : Math.max(insets.bottom, 12),
                }
              ]}
            >
              <View style={styles.imageCaptionInputWrapper}>
                <TouchableOpacity 
                  style={[styles.captionEmojiBtn, showImageEmojiPicker && styles.captionEmojiBtnActive]} 
                  onPress={toggleImageEmojiPicker}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons 
                    name={showImageEmojiPicker ? "keyboard" : "keyboard-outline"} 
                    size={22} 
                    color={showImageEmojiPicker ? Colors.color3C72F2 : "#94A3B8"} 
                  />
                </TouchableOpacity>

                <TextInput
                  ref={captionInputRef}
                  style={styles.imageCaptionInput}
                  placeholder="Add a caption... (optional)"
                  placeholderTextColor="#94A3B8"
                  value={imageCaption}
                  onChangeText={setImageCaption}
                  onFocus={() => setShowImageEmojiPicker(false)}
                  multiline
                  maxLength={500}
                />
              </View>

              <TouchableOpacity 
                style={styles.imageSendBtn}
                onPress={handleSendPendingImage}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>

            {/* In-Modal Emoji Keyboard Panel */}
            {showImageEmojiPicker && (
              <View style={styles.imageEmojiPickerContainer}>
                <View style={styles.imageEmojiHeaderRow}>
                  <View style={styles.imageEmojiTitleBadge}>
                    <Ionicons name="sparkles" size={13} color="#FBBF24" style={{ marginRight: 4 }} />
                    <Text style={styles.imageEmojiTitleText}>EMOJIS</Text>
                  </View>
                </View>
                <ScrollView 
                  contentContainerStyle={styles.imageEmojiScrollContent}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                >
                  {CAPTION_EMOJIS.map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageEmojiItem}
                      onPress={() => handleSelectCaptionEmoji(emoji)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.imageEmojiChar}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.imageEmojiBottomBar}>
                  <TouchableOpacity 
                    style={styles.imageEmojiBackspaceBtn}
                    onPress={handleCaptionBackspace}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="backspace-outline" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* WhatsApp-Style Document Preview & Optional Caption Modal (Exact match to Reference Image 1) */}
      <Modal
        visible={showDocPreviewModal}
        transparent={false}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCancelPendingDoc}
      >
        <SafeAreaView style={styles.image1SafeArea} edges={['top', 'bottom']}>
          {/* Top Header: ←  DocName  ... */}
          <View style={styles.image1TopHeader}>
            <TouchableOpacity 
              style={styles.image1HeaderBtn}
              onPress={handleCancelPendingDoc}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.image1DocTitle} numberOfLines={1}>
              {cleanDocumentName(pendingDoc?.name, pendingDoc?.uri, 'Document.pdf')}
            </Text>

            <TouchableOpacity
              style={styles.image1HeaderBtn}
              activeOpacity={0.7}
              onPress={() => {
                if (pendingDoc?.uri) {
                  handleOpenMediaItem({
                    id: 'preview',
                    text: cleanDocumentName(pendingDoc.name, pendingDoc.uri, 'Document.pdf'),
                    type: 'document',
                    documentUri: pendingDoc.uri,
                    documentName: cleanDocumentName(pendingDoc.name, pendingDoc.uri, 'Document.pdf'),
                    documentSize: pendingDoc.size,
                    documentMimeType: pendingDoc.mimeType,
                    isSender: true,
                    time: '',
                    status: 'sent',
                  });
                }
              }}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Center Area: Normal Document Preview Card */}
            <Pressable 
              style={styles.image1CenterArea}
              onPress={() => {
                Keyboard.dismiss();
                setShowDocEmojiPicker(false);
              }}
            >
              <View style={styles.normalDocPreviewCard}>
                <View style={styles.normalDocIconContainer}>
                  <Ionicons 
                    name={cleanDocumentName(pendingDoc?.name, pendingDoc?.uri, '').toLowerCase().endsWith('.pdf') ? "document-text" : "document"} 
                    size={64} 
                    color={cleanDocumentName(pendingDoc?.name, pendingDoc?.uri, '').toLowerCase().endsWith('.pdf') ? "#EF4444" : "#3C72F2"} 
                  />
                  <View style={[
                    styles.normalDocBadge,
                    { backgroundColor: cleanDocumentName(pendingDoc?.name, pendingDoc?.uri, '').toLowerCase().endsWith('.pdf') ? '#EF4444' : '#3C72F2' }
                  ]}>
                    <Text style={styles.normalDocBadgeText}>
                      {cleanDocumentName(pendingDoc?.name, pendingDoc?.uri, 'PDF').split('.').pop()?.toUpperCase() || 'PDF'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.normalDocTitleText} numberOfLines={2}>
                  {cleanDocumentName(pendingDoc?.name, pendingDoc?.uri, 'Document.pdf')}
                </Text>

                <Text style={styles.normalDocSubtitleText}>
                  {pendingDoc?.size || 'Document'} • {cleanDocumentName(pendingDoc?.name, pendingDoc?.uri, 'PDF').split('.').pop()?.toUpperCase() || 'PDF'}
                </Text>
              </View>
            </Pressable>

            {/* Bottom Caption Pill & Action Row */}
            <View 
              style={[
                styles.image1BottomContainer,
                { 
                  marginBottom: showDocEmojiPicker ? 0 : (Platform.OS === 'android' ? keyboardHeight : 0),
                  paddingBottom: (keyboardHeight > 0 || showDocEmojiPicker) ? 10 : Math.max(insets.bottom, 12),
                }
              ]}
            >
              {/* Add a caption... pill */}
              <View style={styles.image1CaptionPill}>
                <TouchableOpacity 
                  style={styles.image1EmojiBtn} 
                  onPress={toggleDocEmojiPicker}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons 
                    name={showDocEmojiPicker ? "keypad-outline" : "happy-outline"} 
                    size={24} 
                    color="#8696A0" 
                  />
                </TouchableOpacity>

                <TextInput
                  ref={docCaptionInputRef}
                  style={styles.image1CaptionInput}
                  placeholder="Add a caption..."
                  placeholderTextColor="#8696A0"
                  value={docCaption}
                  onChangeText={setDocCaption}
                  onFocus={() => setShowDocEmojiPicker(false)}
                  multiline
                  maxLength={500}
                />
              </View>

              {/* Bottom Row: ✓ ( You ) on left, WhatsApp green circular send on right */}
              <View style={styles.image1BottomRow}>
                <View style={styles.image1RecipientPill}>
                  <Ionicons name="checkmark" size={14} color="#3C72F2" style={{ marginRight: 5 }} />
                  <Text style={styles.image1RecipientText} numberOfLines={1}>
                    {recipientName}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.image1SendCircle}
                  onPress={handleSendPendingDoc}
                  activeOpacity={0.8}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              </View>
            </View>

            {/* In-Modal Emoji Keyboard Panel */}
            {showDocEmojiPicker && (
              <View style={styles.imageEmojiPickerContainer}>
                <View style={styles.imageEmojiHeaderRow}>
                  <View style={styles.imageEmojiTitleBadge}>
                    <Ionicons name="sparkles" size={13} color="#FBBF24" style={{ marginRight: 4 }} />
                    <Text style={styles.imageEmojiTitleText}>EMOJIS</Text>
                  </View>
                </View>
                <ScrollView 
                  contentContainerStyle={styles.imageEmojiScrollContent}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                >
                  {CAPTION_EMOJIS.map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageEmojiItem}
                      onPress={() => handleSelectDocCaptionEmoji(emoji)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.imageEmojiChar}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.imageEmojiBottomBar}>
                  <TouchableOpacity 
                    style={styles.imageEmojiBackspaceBtn}
                    onPress={handleDocCaptionBackspace}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="backspace-outline" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorFFF,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.colorF5F5F5,
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
    color: '#10B981',
    fontWeight: '500',
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  headerIconBtn: {
    padding: 7,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  phoneButton: {
    padding: 8,
  },
  chatList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 6,
    backgroundColor: Colors.colorFFF,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 4 : 2,
    minHeight: 46,
    maxHeight: 110,
    marginRight: 8,
  },
  inputWrapperFocused: {
    borderColor: Colors.color3C72F2,
    backgroundColor: Colors.colorFFF,
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  innerAttachButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.color333,
    paddingHorizontal: 6,
    paddingTop: Platform.OS === 'ios' ? 8 : 6,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    maxHeight: 90,
  },
  innerActionBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.color3C72F2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    minHeight: 46,
    marginRight: 8,
  },
  cancelRecordingBtn: {
    padding: 6,
    marginRight: 4,
  },
  recordingIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingTime: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    marginRight: 8,
    fontVariant: ['tabular-nums'],
  },
  recordingPrompt: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  sendButtonRecording: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 1.12 }],
    shadowColor: '#DC2626',
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  replyPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  replyAccentLine: {
    width: 4,
    height: '90%',
    backgroundColor: Colors.color3C72F2,
    borderRadius: 2,
    marginRight: 10,
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewSender: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.color3C72F2,
    marginBottom: 2,
  },
  replyPreviewText: {
    fontSize: 12,
    color: '#64748B',
  },
  closeReplyBtn: {
    padding: 4,
    marginLeft: 6,
  },
  editPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  editPreviewContent: {
    flex: 1,
  },
  editPreviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 1,
  },
  editPreviewText: {
    fontSize: 12,
    color: '#78350F',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },

  forwardSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '60%',
  },
  forwardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  forwardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  forwardList: {
    marginBottom: 10,
  },
  forwardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  forwardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.color3C72F2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  forwardItemInfo: {
    flex: 1,
  },
  forwardItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  forwardItemSpec: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // Multi-Selection Action Header
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  selectionLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionCloseBtn: {
    padding: 6,
    marginRight: 10,
  },
  selectionCountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectionRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionActionBtn: {
    padding: 7,
    marginLeft: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search Bar Header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchHeaderBackBtn: {
    padding: 6,
    marginRight: 6,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  searchHeaderInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  searchCloseTextBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 4,
  },
  searchCloseText: {
    fontSize: 14,
    color: Colors.color3C72F2,
    fontWeight: '600',
  },
  searchResultBar: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  searchResultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  emptySearchContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptySearchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySearchSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // Blocked Banner
  blockedBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },
  blockedBannerText: {
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '500',
  },
  unblockBannerBtn: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  unblockBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Overflow Dropdown Menu
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  overflowMenuCard: {
    position: 'absolute',
    right: 12,
    width: 215,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  overflowMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  overflowMenuIcon: {
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  overflowMenuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  overflowMenuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },

  // Contact Info Sheet
  infoSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoProfileCard: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  infoAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.color3C72F2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  infoBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.color3C72F2,
    marginBottom: 6,
  },
  infoStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoStatusText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
  infoActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  infoActionBtn: {
    alignItems: 'center',
  },
  infoActionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  infoDetailsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoDetailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoDetailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 1,
  },

  // Media Sheet
  mediaSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '75%',
  },
  mediaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mediaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  mediaSummaryBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mediaStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  mediaStatCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  mediaStatLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  mediaStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  mediaSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  mediaFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  mediaFileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mediaFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  mediaFileMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  deleteDialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
  deleteDialogTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 18,
  },
  deleteButtonStack: {
    alignItems: 'flex-end',
    gap: 6,
  },
  deleteActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  deleteActionPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.color3C72F2,
  },
  deleteActionCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  imagePreviewSafeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
  },
  imagePreviewCloseBtn: {
    padding: 6,
    marginRight: 12,
  },
  imagePreviewHeaderInfo: {
    flex: 1,
  },
  imagePreviewRecipientTitle: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  imagePreviewRecipientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  imagePreviewBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  imagePreviewImage: {
    width: '100%',
    height: '100%',
  },
  imageCaptionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  imageCaptionInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    marginRight: 10,
    maxHeight: 100,
  },
  imageCaptionInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 4,
  },
  imageSendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.color3C72F2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  keyboardIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  keyboardIconBtnActive: {
    backgroundColor: '#EFF6FF',
  },
  captionEmojiBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  captionEmojiBtnActive: {
    backgroundColor: 'rgba(60, 114, 242, 0.22)',
  },
  imageEmojiPickerContainer: {
    height: 240,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  imageEmojiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0B132B',
  },
  imageEmojiTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  imageEmojiTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  imageEmojiScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  imageEmojiItem: {
    width: `${100 / 8}%`,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmojiChar: {
    fontSize: 24,
  },
  imageEmojiBottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  imageEmojiBackspaceBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  chatEmojiPickerContainer: {
    height: 250,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  chatEmojiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
  },
  chatEmojiTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  chatEmojiTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  chatEmojiCountText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  chatEmojiBottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  docPreviewBody: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  docFirstPageContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  docFirstPageTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0B132B',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  docPageNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  docPageNumberBadgeText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  docOpenSystemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#475569',
  },
  docOpenSystemBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  docFirstPageScroll: {
    flex: 1,
  },
  docFirstPageContent: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  firstPageSheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sheetClinicLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.color3C72F2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sheetClinicTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
  sheetClinicSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  hiddenRenderer: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
    left: -100,
  },
  renderedFirstPageContainer: {
    width: '100%',
    minHeight: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderedFirstPageImage: {
    width: '100%',
    height: 380,
    backgroundColor: '#FFFFFF',
  },
  firstPageLoadingBox: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconLargeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  firstPageLoadingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  firstPageLoadingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: 240,
  },
  firstPageLoadingSize: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  sheetDocMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sheetDocIconTiny: {
    marginRight: 6,
  },
  sheetDocNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  sheetDocSizeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  // WhatsApp Reference Image 1 Styles
  image1SafeArea: {
    flex: 1,
    backgroundColor: '#0B141B',
  },
  image1TopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0B141B',
  },
  image1HeaderBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image1DocTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginHorizontal: 12,
  },
  image1CenterArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  normalDocPreviewCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#1F2C34',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  normalDocIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#111B21',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  normalDocBadge: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  normalDocBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  normalDocTitleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  normalDocSubtitleText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  image1BottomContainer: {
    paddingHorizontal: 14,
    backgroundColor: '#0B141B',
  },
  image1CaptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2C34',
    borderRadius: 24,
    paddingHorizontal: 12,
    minHeight: 46,
    marginBottom: 10,
  },
  image1EmojiBtn: {
    padding: 4,
    marginRight: 6,
  },
  image1CaptionInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  image1BottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
  },
  image1RecipientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2C34',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: '70%',
  },
  image1RecipientText: {
    color: '#E9EDEF',
    fontSize: 13,
    fontWeight: '600',
  },
  image1SendCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3C72F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  dynamicPreviewSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'space-between',
  },
  dynamicPreviewHeader: {
    alignItems: 'center',
    paddingTop: 10,
  },
  dynamicPreviewBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 12,
  },
  dynamicPreviewBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  dynamicPreviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  dynamicPreviewSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  dynamicPreviewDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  dynamicPreviewBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
  previewLineWide: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  previewLineMedium: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    width: '75%',
    alignSelf: 'center',
  },
  previewLineShort: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    width: '60%',
    alignSelf: 'center',
  },
  previewTable: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  previewTableRow: {
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
  },
  medSheetScroll: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  medSheetContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  medSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medSheetLogoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.color3C72F2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  medSheetClinicName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
  medSheetClinicSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  medSheetDivider: {
    height: 2,
    backgroundColor: Colors.color3C72F2,
    marginVertical: 10,
  },
  medSheetMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medSheetMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  medSheetMetaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  medSheetPatientBox: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  medSheetPatientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medSheetPatientText: {
    fontSize: 13,
    color: '#334155',
  },
  medSheetVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  medSheetVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  medSheetSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  medSheetTable: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  medSheetTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  medSheetColHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  medSheetTableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medSheetTableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medSheetTableCell: {
    fontSize: 11,
    color: '#334155',
  },
  medSheetNotesBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: Colors.color3C72F2,
    marginBottom: 14,
  },
  medSheetNotesText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  medSheetFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  medSheetDocSign: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  medSheetDocReg: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  medSheetPageNumberBox: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  medSheetPageNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
});


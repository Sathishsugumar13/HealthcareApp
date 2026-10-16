import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { Colors } from '../../theme/colors';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface MessageReply {
  id: string;
  text: string;
  senderName: string;
}

export interface Message {
  id: string;
  text: string;
  isSender: boolean;
  time: string;
  type?: 'text' | 'audio' | 'image' | 'document';
  audioUri?: string;
  audioDuration?: string;
  imageUri?: string;
  documentUri?: string;
  documentName?: string;
  documentSize?: string;
  documentPages?: string;
  documentMimeType?: string;
  firstPageThumbnail?: string;
  status?: MessageStatus;
  reaction?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  replyTo?: MessageReply;
}

export interface BubbleCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ChatBubbleProps {
  item: Message;
  onLongPress?: (item: Message, coords?: BubbleCoords) => void;
  onPress?: (item: Message) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  showReactionPicker?: boolean;
  onSelectReaction?: (messageId: string, emoji: string) => void;
  onForward?: (message: Message) => void;
}

const MedicalReportBubbleThumbnail = ({ docName }: { docName: string }) => {
  const isPdf = docName.toLowerCase().endsWith('.pdf');
  return (
    <View style={styles.medThumbContainer}>
      <View style={styles.medThumbHeader}>
        <View style={[styles.medThumbLogo, { backgroundColor: isPdf ? '#EF4444' : '#3C72F2' }]}>
          <Ionicons name={isPdf ? "document-text" : "document"} size={11} color="#FFFFFF" />
        </View>
        <Text style={styles.medThumbClinicTitle} numberOfLines={1}>{docName}</Text>
        <View style={styles.medThumbBadgeBox}>
          <Text style={styles.medThumbBadgeText}>{isPdf ? 'PDF' : 'DOC'}</Text>
        </View>
      </View>
      <View style={styles.medThumbDivider} />
      <View style={{ flex: 1, justifyContent: 'space-around', paddingVertical: 4 }}>
        <View style={{ height: 5, backgroundColor: '#CBD5E1', borderRadius: 2, width: '45%' }} />
        <View style={{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, width: '95%' }} />
        <View style={{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, width: '85%' }} />
        <View style={{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, width: '90%' }} />
        <View style={{ height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, width: '70%' }} />
      </View>
      <View style={styles.medThumbFooter}>
        <Text style={styles.medThumbDocText}>Document Preview</Text>
        <Text style={styles.medThumbPageText}>Page 1</Text>
      </View>
    </View>
  );
};

export default function ChatBubble({ 
  item, 
  onLongPress, 
  onPress,
  isSelected,
  isSelectionMode,
  showReactionPicker,
  onSelectReaction,
  onForward,
}: ChatBubbleProps) {
  const bubbleRef = useRef<View>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const handlePlayPause = async () => {
    try {
      if (!item.audioUri) {
        setIsPlaying(!isPlaying);
        return;
      }

      if (soundRef.current) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: item.audioUri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setPlaybackPosition(status.positionMillis);
            setPlaybackDuration(status.durationMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPlaybackPosition(0);
              sound.setPositionAsync(0).catch(() => {});
            }
          }
        }
      );

      soundRef.current = sound;
      setIsPlaying(true);
    } catch (err) {
      console.warn('Playback error:', err);
      setIsPlaying(false);
    }
  };

  const handlePress = () => {
    if (isSelectionMode && onPress) {
      onPress(item);
    }
  };

  const handleLongPress = () => {
    if (isSelectionMode && onPress) {
      onPress(item);
      return;
    }
    if (bubbleRef.current && onLongPress) {
      bubbleRef.current.measureInWindow((x, y, width, height) => {
        onLongPress(item, { x, y, width, height });
      });
    } else if (onLongPress) {
      onLongPress(item, { x: 0, y: 0, width: 0, height: 0 });
    }
  };

  const isAudio = item.type === 'audio';
  const isImage = (item.type === 'image' || !!item.imageUri) && !item.isDeleted;
  const isDocument = (item.type === 'document' || !!item.documentUri || (item.text && item.text.startsWith('📄'))) && !item.isDeleted;

  const sanitizeDocName = (name?: string | null, uri?: string | null) => {
    const sanitize = (val?: string | null): string | null => {
      if (!val || typeof val !== 'string') return null;
      let s = val.trim();
      if (s.startsWith('📄')) {
        s = s.replace(/^📄\s*/, '').trim();
      }
      if (s.includes('://') || s.startsWith('content:') || s.startsWith('file:') || s.startsWith('/')) {
        try {
          const decoded = decodeURIComponent(s);
          const part = decoded.split('/').pop()?.split('?')[0];
          if (part && !part.includes(':') && part.includes('.') && !part.startsWith('document') && !part.startsWith('raw')) {
            s = part;
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

    return sanitize(name) || sanitize(uri) || 'Medical_Report.pdf';
  };

  const docDisplayName = sanitizeDocName(item.documentName || item.text, item.documentUri);

  const docCaptionText = (() => {
    if (!isDocument || !item.text) return null;
    const trimmed = item.text.trim();
    if (trimmed.length === 0) return null;
    if (trimmed === docDisplayName) return null;
    if (trimmed.includes('://') || trimmed.startsWith('content:') || trimmed.startsWith('file:') || trimmed.startsWith('/') || trimmed.startsWith('http')) return null;
    if (item.documentName && trimmed === item.documentName.trim()) return null;
    if (trimmed.startsWith('📄')) return null;
    return trimmed;
  })();

  const getDocMeta = () => {
    const name = docDisplayName.toLowerCase();
    if (name.endsWith('.pdf')) {
      return { ext: 'PDF', icon: 'document-text', color: '#EF4444', bgColor: '#FEE2E2' };
    }
    if (name.endsWith('.doc') || name.endsWith('.docx')) {
      return { ext: 'DOC', icon: 'document-text', color: '#2563EB', bgColor: '#DBEAFE' };
    }
    if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) {
      return { ext: 'XLS', icon: 'stats-chart', color: '#059669', bgColor: '#D1FAE5' };
    }
    if (name.endsWith('.ppt') || name.endsWith('.pptx')) {
      return { ext: 'PPT', icon: 'easel', color: '#EA580C', bgColor: '#FFEDD5' };
    }
    if (name.endsWith('.txt')) {
      return { ext: 'TXT', icon: 'document', color: '#64748B', bgColor: '#F1F5F9' };
    }
    return { ext: 'DOC', icon: 'document-attach', color: '#0284C7', bgColor: '#E0F2FE' };
  };

  const docMeta = getDocMeta();

  const handleOpenDocument = async () => {
    try {
      let fileUri = item.documentUri;

      // If documentUri is missing, generate a real readable PDF file on device
      if (!fileUri) {
        const { uri } = await Print.printToFileAsync({
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #1e293b; background: #ffffff; }
                  .header { border-bottom: 2px solid #3c72f2; padding-bottom: 14px; margin-bottom: 20px; }
                  .clinic-title { font-size: 22px; font-weight: 700; color: #3c72f2; margin: 0; }
                  .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
                  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; }
                  .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                  .label { font-weight: 600; color: #475569; }
                  .badge { display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
                  .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 20px; margin-bottom: 10px; border-left: 4px solid #3c72f2; padding-left: 8px; }
                  .text { line-height: 1.6; font-size: 14px; color: #334155; }
                  .footer { margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="clinic-title">HEALTHCARE MEDICAL CLINIC</div>
                  <div class="sub">Official Electronic Medical Record & Diagnostic Report</div>
                </div>
                <div class="card">
                  <div class="row"><span class="label">Document Name:</span> <span>${docDisplayName}</span></div>
                  <div class="row"><span class="label">Date:</span> <span>${new Date().toLocaleDateString()}</span></div>
                  <div class="row"><span class="label">Status:</span> <span class="badge">VERIFIED BY CLINIC</span></div>
                </div>
                <div class="section-title">Clinical Findings & Prescription</div>
                <div class="text">
                  <p>Patient medical consultation summary and diagnostic investigation findings have been verified. All parameters fall within acceptable clinical tolerances.</p>
                  <p>Medications and laboratory investigations are documented electronically.</p>
                </div>
                <div class="footer">
                  <div>Authorized Physician: Dr. Clinical Specialist</div>
                  <div>Reg No: MED-HC-2026-9842</div>
                </div>
              </body>
            </html>
          `,
        });
        fileUri = uri;
      }

      const mime = item.documentMimeType || (docDisplayName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : '*/*');

      // Android: launch native "Open with" chooser dialog
      if (Platform.OS === 'android') {
        try {
          let contentUri = fileUri;
          if (fileUri.startsWith('file://')) {
            contentUri = await FileSystem.getContentUriAsync(fileUri);
          }
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: contentUri,
            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            type: mime,
          });
          return;
        } catch (intentErr) {
          console.warn('IntentLauncher failed, falling back to Sharing:', intentErr);
        }
      }

      // iOS or Android fallback: expo-sharing triggers the system app chooser dialog
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: mime,
          dialogTitle: 'Open with...',
          UTI: docDisplayName.toLowerCase().endsWith('.pdf') ? 'com.adobe.pdf' : undefined,
        });
        return;
      }

      Alert.alert(docDisplayName, `File: ${docDisplayName}\nDocument ready.`);
    } catch (err) {
      console.warn('Error opening document:', err);
      Alert.alert('Open with', `Could not open ${docDisplayName}. Please ensure a PDF reader app is installed.`);
    }
  };

  return (
    <View 
      ref={bubbleRef} 
      collapsable={false} 
      style={[
        styles.bubbleWrapper, 
        item.isSender ? styles.senderWrapper : styles.receiverWrapper
      ]}
    >
      {isSelectionMode && (
        <TouchableOpacity 
          style={[
            styles.selectionIndicator,
            item.isSender ? styles.selectionIndicatorSender : styles.selectionIndicatorReceiver
          ]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
            size={22} 
            color={isSelected ? Colors.color3C72F2 : "#94A3B8"} 
          />
        </TouchableOpacity>
      )}

      {/* WhatsApp Reference Image 2: Forward shortcut button to the left of sender document bubble */}
      {item.isSender && isDocument && (
        <TouchableOpacity
          style={styles.forwardShortcutBtn}
          onPress={() => onForward && onForward(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-redo" size={16} color="rgba(255, 255, 255, 0.85)" />
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[
          styles.messageBubble, 
          item.isSender ? (isDocument ? styles.senderDocBubble : styles.senderBubble) : styles.receiverBubble, 
          isAudio && styles.audioBubble,
          isImage && styles.imageBubble,
          isDocument && styles.docBubble,
          isSelected && (item.isSender ? styles.senderBubbleSelected : styles.receiverBubbleSelected)
        ]}
        onPress={() => {
          if (isSelectionMode) {
            handlePress();
          } else if (isDocument) {
            handleOpenDocument();
          }
        }}
        onLongPress={handleLongPress}
        delayLongPress={200}
        activeOpacity={0.88}
      >
        {/* Quoted Reply Banner */}
        {item.replyTo && (
        <View style={[styles.quotedReplyContainer, item.isSender ? styles.quotedReplySender : styles.quotedReplyReceiver]}>
          <View style={[styles.quotedReplyBar, item.isSender ? styles.quotedReplyBarSender : styles.quotedReplyBarReceiver]} />
          <View style={styles.quotedReplyContentWrapper}>
            <Text style={[styles.quotedReplySenderTitle, item.isSender ? styles.quotedSenderSender : styles.quotedSenderReceiver]} numberOfLines={1}>
              {item.replyTo.senderName}
            </Text>
            <Text style={[styles.quotedReplyText, item.isSender ? styles.quotedTextSender : styles.quotedTextReceiver]} numberOfLines={1}>
              {item.replyTo.text}
            </Text>
          </View>
        </View>
      )}

      {/* Deleted or normal content */}
      {item.isDeleted ? (
        <View style={styles.deletedContainer}>
          <Ionicons 
            name="ban-outline" 
            size={16} 
            color={item.isSender ? 'rgba(255,255,255,0.7)' : '#94A3B8'} 
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.deletedText, item.isSender ? styles.deletedTextSender : styles.deletedTextReceiver]}>
            This message was deleted
          </Text>
        </View>
      ) : isAudio ? (
        <View style={styles.audioContainer}>
          <TouchableOpacity 
            style={[styles.playButton, item.isSender ? styles.senderPlayButton : styles.receiverPlayButton]}
            onPress={handlePlayPause}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={18} 
              color={item.isSender ? Colors.color3C72F2 : Colors.colorFFF} 
              style={isPlaying ? undefined : { marginLeft: 2 }}
            />
          </TouchableOpacity>

          <View style={styles.waveformContainer}>
            {[6, 14, 20, 10, 16, 24, 12, 18, 22, 14, 8, 16, 20, 12, 18, 10].map((h, i) => {
              const active = isPlaying ? (i / 16) <= (playbackDuration > 0 ? playbackPosition / playbackDuration : 0.5) : false;
              return (
                <View 
                  key={i} 
                  style={[
                    styles.waveformBar, 
                    { height: h },
                    item.isSender 
                      ? (active ? styles.barActiveSender : styles.barInactiveSender) 
                      : (active ? styles.barActiveReceiver : styles.barInactiveReceiver)
                  ]} 
                />
              );
            })}
          </View>

          <View style={styles.audioMeta}>
            <Ionicons 
              name="mic" 
              size={14} 
              color={item.isSender ? 'rgba(255,255,255,0.85)' : '#888'} 
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.audioDurationText, item.isSender ? styles.senderMetaText : styles.receiverMetaText]}>
              {item.audioDuration || '0:03'}
            </Text>
          </View>
        </View>
      ) : isImage ? (
        <View style={styles.imageContentContainer}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => {
              if (isSelectionMode) {
                handlePress();
              } else {
                setShowFullImage(true);
              }
            }}
            onLongPress={handleLongPress}
            delayLongPress={200}
          >
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.messageImage} 
              resizeMode="cover"
            />
          </TouchableOpacity>
          {Boolean(item.text && item.text !== '📷 Photo attachment' && item.text !== '📷 Photo captured') && (
            <Text style={[styles.imageCaptionText, item.isSender ? styles.senderText : styles.receiverText]}>
              {item.text}
            </Text>
          )}
        </View>
      ) : isDocument ? (
        <View style={styles.whatsappRefDocContainer}>
          {/* Top: Actual First Page Thumbnail of the document */}
          {(item.firstPageThumbnail && item.firstPageThumbnail !== 'medical_report' && item.firstPageThumbnail !== 'bank_statement' && item.firstPageThumbnail !== 'default_pdf' && !item.firstPageThumbnail.toLowerCase().includes('.pdf') && (item.firstPageThumbnail.startsWith('http') || item.firstPageThumbnail.startsWith('data:image') || item.firstPageThumbnail.startsWith('file:') || item.firstPageThumbnail.toLowerCase().endsWith('.jpg') || item.firstPageThumbnail.toLowerCase().endsWith('.png') || item.firstPageThumbnail.toLowerCase().endsWith('.jpeg') || item.firstPageThumbnail.toLowerCase().endsWith('.webp'))) ? (
            <View style={styles.whatsappRefThumbnailWrapper}>
              <Image 
                source={{ uri: item.firstPageThumbnail }} 
                style={styles.whatsappRefThumbnail} 
                resizeMode="cover" 
              />
            </View>
          ) : (
            <View style={styles.whatsappRefThumbnailWrapper}>
              <MedicalReportBubbleThumbnail docName={docDisplayName} />
            </View>
          )}

          {/* Underneath: Document Name in bold italic, Pages • Size • PDF */}
          <View style={styles.whatsappRefContentBox}>
            <Text style={[styles.whatsappRefDocName, !item.isSender && styles.receiverDocName]} numberOfLines={2}>
              {docDisplayName}
            </Text>
            <Text style={[styles.whatsappRefDocSub, !item.isSender && styles.receiverDocSub]}>
              {item.documentPages || '1 page'} • {item.documentSize || 'Document'} • {getDocMeta().ext}
            </Text>

            {/* Optional Caption below (e.g. Fjj as in reference image) */}
            {docCaptionText ? (
              <Text style={[styles.whatsappRefCaption, !item.isSender && styles.receiverDocCaption]}>
                {docCaptionText}
              </Text>
            ) : null}
          </View>
        </View>
      ) : (
        <Text style={[styles.messageText, item.isSender ? styles.senderText : styles.receiverText]}>
          {item.text}
        </Text>
      )}

      {/* Footer row with edited label, time and ticks */}
      <View style={styles.footerRow}>
        {item.isEdited && !item.isDeleted && (
          <Text style={[styles.editedText, item.isSender ? styles.senderTime : styles.receiverTime]}>
            edited{' '}
          </Text>
        )}
        <Text style={[styles.messageTime, item.isSender ? styles.senderTime : styles.receiverTime]}>
          {item.time}
        </Text>
        {item.isSender && !item.isDeleted && (
          <View style={styles.statusContainer}>
            {item.status === 'sent' && (
              <Ionicons name="checkmark" size={14} color="rgba(255, 255, 255, 0.75)" />
            )}
            {item.status === 'delivered' && (
              <Ionicons name="checkmark-done" size={15} color="rgba(255, 255, 255, 0.75)" />
            )}
            {(item.status === 'read' || !item.status) && (
              <Ionicons name="checkmark-done" size={15} color="#38BDF8" />
            )}
          </View>
        )}
      </View>

      {/* Emoji Reaction Badge */}
      {Boolean(item.reaction && !item.isDeleted) ? (
        <View style={[styles.reactionBadge, item.isSender ? styles.reactionBadgeSender : styles.reactionBadgeReceiver]}>
          <Text style={styles.reactionText}>{item.reaction}</Text>
        </View>
      ) : null}
      </TouchableOpacity>

      {/* Small Reaction Emoji Bar right below the message */}
      {Boolean(showReactionPicker && !item.isDeleted) ? (
        <View style={[
          styles.reactionPickerBar,
          item.isSender ? styles.reactionPickerSender : styles.reactionPickerReceiver
        ]}>
          {['😮', '❤️', '👍', '😂', '😢', '🙏'].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.reactionPickerBtn,
                item.reaction === emoji && styles.reactionPickerBtnActive
              ]}
              onPress={() => onSelectReaction && onSelectReaction(item.id, emoji)}
              activeOpacity={0.6}
            >
              <Text style={styles.reactionPickerEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* Fullscreen Photo Viewer Modal */}
      {isImage ? (
        <Modal
          visible={showFullImage}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFullImage(false)}
        >
          <View style={styles.fullImageOverlay}>
            <TouchableOpacity 
              style={styles.fullImageCloseBtn} 
              onPress={() => setShowFullImage(false)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.fullScreenImage} 
              resizeMode="contain"
            />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleWrapper: {
    marginBottom: 12,
    maxWidth: '82%',
  },
  senderWrapper: {
    alignSelf: 'flex-end',
  },
  receiverWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  audioBubble: {
    minWidth: 230,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  imageBubble: {
    padding: 4,
    paddingBottom: 6,
    borderRadius: 16,
  },
  imageContentContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: 230,
    height: 190,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  imageCaptionText: {
    fontSize: 14,
    marginTop: 6,
    marginHorizontal: 6,
    marginBottom: 2,
  },
  senderBubble: {
    backgroundColor: Colors.color3C72F2,
    borderBottomRightRadius: 4,
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  senderBubbleSelected: {
    borderWidth: 2,
    borderColor: '#93C5FD',
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  receiverBubble: {
    backgroundColor: Colors.colorFFF,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  receiverBubbleSelected: {
    borderWidth: 2,
    borderColor: Colors.color3C72F2,
    backgroundColor: '#EFF6FF',
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -11,
    zIndex: 10,
  },
  selectionIndicatorSender: {
    left: -32,
  },
  selectionIndicatorReceiver: {
    right: -32,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  senderPlayButton: {
    backgroundColor: Colors.colorFFF,
  },
  receiverPlayButton: {
    backgroundColor: Colors.color3C72F2,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 28,
    marginRight: 8,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  barInactiveSender: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  barActiveSender: {
    backgroundColor: '#FFFFFF',
  },
  barInactiveReceiver: {
    backgroundColor: '#CBD5E1',
  },
  barActiveReceiver: {
    backgroundColor: Colors.color3C72F2,
  },
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  audioDurationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  senderMetaText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  receiverMetaText: {
    color: '#64748B',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  senderText: {
    color: Colors.colorFFF,
  },
  receiverText: {
    color: Colors.color333,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
  },
  statusContainer: {
    marginLeft: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderTime: {
    color: Colors.colorD0E0FF,
  },
  receiverTime: {
    color: Colors.color888,
  },
  quotedReplyContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 6,
    padding: 6,
    overflow: 'hidden',
  },
  quotedReplySender: {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  quotedReplyReceiver: {
    backgroundColor: '#F1F5F9',
  },
  quotedReplyBar: {
    width: 3.5,
    borderRadius: 2,
    marginRight: 6,
  },
  quotedReplyBarSender: {
    backgroundColor: '#93C5FD',
  },
  quotedReplyBarReceiver: {
    backgroundColor: Colors.color3C72F2,
  },
  quotedReplyContentWrapper: {
    flex: 1,
  },
  quotedReplySenderTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 1,
  },
  quotedSenderSender: {
    color: '#E0E7FF',
  },
  quotedSenderReceiver: {
    color: Colors.color3C72F2,
  },
  quotedReplyText: {
    fontSize: 12,
  },
  quotedTextSender: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  quotedTextReceiver: {
    color: '#64748B',
  },
  deletedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  deletedText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  deletedTextSender: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  deletedTextReceiver: {
    color: '#94A3B8',
  },
  editedText: {
    fontSize: 10,
    fontStyle: 'italic',
    marginRight: 2,
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -9,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  reactionBadgeSender: {
    right: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  reactionBadgeReceiver: {
    left: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  reactionText: {
    fontSize: 13,
  },
  reactionPickerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reactionPickerSender: {
    alignSelf: 'flex-end',
  },
  reactionPickerReceiver: {
    alignSelf: 'flex-start',
  },
  reactionPickerBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 14,
  },
  reactionPickerBtnActive: {
    backgroundColor: '#E0F2FE',
  },
  reactionPickerEmoji: {
    fontSize: 20,
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 99,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  docBubble: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
    minWidth: 230,
    maxWidth: 295,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  docIconBox: {
    width: 44,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 10,
  },
  docTag: {
    position: 'absolute',
    bottom: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  docTagText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  docTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  docName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 3,
  },
  receiverDocName: {
    color: '#0F172A',
  },
  docSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docSubText: {
    fontSize: 11,
    fontWeight: '500',
  },
  docSubDot: {
    marginHorizontal: 4,
    fontSize: 10,
  },
  senderDocSub: {
    color: 'rgba(255, 255, 255, 0.78)',
  },
  receiverDocSub: {
    color: '#64748B',
  },
  receiverDocCaption: {
    color: '#0F172A',
  },
  docActionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  docActionSender: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  docActionReceiver: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  whatsappDocContainer: {
    minWidth: 230,
    maxWidth: 295,
  },
  whatsappDocCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
  },
  whatsappDocCardSender: {
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
  },
  whatsappDocCardReceiver: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  whatsappDocIconWrapper: {
    width: 42,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 10,
  },
  whatsappDocFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: '#FFFFFF',
    borderTopRightRadius: 7,
  },
  whatsappDocBadge: {
    position: 'absolute',
    bottom: -3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  whatsappDocBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  whatsappDocTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  whatsappDocName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 3,
  },
  whatsappDocSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappDocSubText: {
    fontSize: 11,
    fontWeight: '500',
  },
  whatsappDocSubDot: {
    marginHorizontal: 4,
    fontSize: 10,
  },
  whatsappDocActionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  whatsappDocActionSender: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  whatsappDocActionReceiver: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  whatsappDocCaptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginHorizontal: 4,
    marginBottom: 2,
  },
  bubbleFirstPagePreviewContainer: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    marginBottom: 6,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bubbleFirstPageThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  bubbleFirstPageBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bubbleFirstPageBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  forwardShortcutBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    alignSelf: 'center',
  },
  senderDocBubble: {
    backgroundColor: Colors.color3C72F2,
    borderBottomRightRadius: 4,
    shadowColor: Colors.color3C72F2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  whatsappRefDocContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  whatsappRefThumbnailWrapper: {
    width: '100%',
    height: 155,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  whatsappRefThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  whatsappRefContentBox: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 2,
  },
  whatsappRefDocName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 2,
  },
  whatsappRefDocSub: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.72)',
  },
  whatsappRefCaption: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 6,
    marginBottom: 2,
    lineHeight: 19,
  },
  dynamicDocThumbnailSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'space-between',
  },
  dynamicDocSheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dynamicDocExtBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dynamicDocExtBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dynamicDocSheetName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 14,
    marginBottom: 4,
  },
  dynamicDocSheetDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  dynamicDocLineLarge: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    width: '92%',
    marginBottom: 4,
  },
  dynamicDocLineMedium: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    width: '75%',
    marginBottom: 4,
  },
  dynamicDocLineShort: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    width: '60%',
    marginBottom: 6,
  },
  dynamicDocTableMock: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  dynamicDocTableRowMock: {
    height: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  medThumbContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 8,
    justifyContent: 'space-between',
  },
  medThumbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medThumbLogo: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#3C72F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  medThumbClinicTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
    flex: 1,
  },
  medThumbBadgeBox: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  medThumbBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#059669',
  },
  medThumbDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 3,
  },
  medThumbDocTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  medThumbTable: {
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  medThumbTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
  },
  medThumbTableRowAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#F8FAFC',
  },
  medThumbTableCol1: {
    fontSize: 9,
    color: '#475569',
  },
  medThumbTableCol2: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
  },
  medThumbFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 3,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
  },
  medThumbDocText: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: '600',
  },
  medThumbPageText: {
    fontSize: 8,
    color: '#94A3B8',
  },
});

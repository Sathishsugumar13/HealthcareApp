import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function CustomAlertModal() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({ title: '', message: '', buttons: [] as any[] });

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('SHOW_CUSTOM_ALERT', (data) => {
      setConfig(data);
      setVisible(true);
    });
    return () => subscription.remove();
  }, []);

  const handlePress = (onPress?: () => void) => {
    setVisible(false);
    if (onPress) {
      setTimeout(() => onPress(), 300); // Wait for modal fade out
    }
  };

  if (!visible) return null;

  // Default to a single "OK" button if none provided
  const buttons = config.buttons && config.buttons.length > 0 
    ? config.buttons 
    : [{ text: 'OK', onPress: () => {} }];

  // Determine icon based on title
  let iconName = "information-circle";
  let iconColor = Colors.color3C72F2;
  
  const titleLower = config.title.toLowerCase();
  if (titleLower.includes('error') || titleLower.includes('invalid') || titleLower.includes('failed')) {
    iconName = "alert-circle";
    iconColor = Colors.colorEF4444; // Red
  } else if (titleLower.includes('success') || titleLower.includes('confirmed')) {
    iconName = "checkmark-circle";
    iconColor = Colors.color10B981; // Green
  } else if (titleLower.includes('warning')) {
    iconName = "warning";
    iconColor = Colors.colorF59E0B; // Orange
  }

  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => handlePress()}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          
          <View style={styles.iconContainer}>
            <Ionicons name={iconName as any} size={48} color={iconColor} />
          </View>
          
          <Text style={styles.title}>{config.title}</Text>
          {config.message ? <Text style={styles.message}>{config.message}</Text> : null}

          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.button, 
                  buttons.length === 2 && index === 0 ? styles.buttonOutline : styles.buttonSolid,
                  buttons.length > 2 && { marginBottom: 10 }
                ]} 
                onPress={() => handlePress(btn.onPress)}
              >
                <Text style={[
                  styles.buttonText, 
                  buttons.length === 2 && index === 0 ? styles.buttonTextOutline : styles.buttonTextSolid
                ]}>
                  {btn.text || 'OK'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 9999,
  },
  alertBox: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: Colors.color666,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  buttonSolid: {
    backgroundColor: Colors.color3C72F2,
  },
  buttonOutline: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.color3C72F2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSolid: {
    color: Colors.white,
  },
  buttonTextOutline: {
    color: Colors.color3C72F2,
  }
});

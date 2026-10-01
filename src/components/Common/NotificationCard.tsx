import React, { useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface NotificationCardProps {
  item: any;
  isUnread: boolean;
  onPress: (item: any, isUnread: boolean) => void;
  onDelete?: (item: any) => void;
}

export default function NotificationCard({ item, isUnread, onPress, onDelete }: NotificationCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  
  const currentPanValue = useRef(0);
  
  React.useEffect(() => {
    pan.addListener((value) => {
      currentPanValue.current = value.x;
    });
    return () => {
      pan.removeAllListeners();
    };
  }, [pan]);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const startShaking = () => {
    shakeAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 300, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 150, useNativeDriver: false })
      ])
    );
    shakeAnimation.current.start();
  };

  const stopShaking = () => {
    if (shakeAnimation.current) {
      shakeAnimation.current.stop();
    }
    Animated.timing(shakeAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  };

  const handleDeletePress = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    if (onDelete) onDelete(item);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        pan.setOffset({ x: currentPanValue.current, y: 0 });
        pan.setValue({ x: 0, y: 0 });
        startShaking();
      },
      onPanResponderMove: (evt, gestureState) => {
        let newX = gestureState.dx;
        
        if (currentPanValue.current + newX > 0) {
          newX = -currentPanValue.current; 
        }
        
        if (currentPanValue.current + newX < -90) {
           const excess = (currentPanValue.current + newX) + 90;
           newX = -currentPanValue.current - 90 + (excess * 0.3);
        }

        pan.setValue({ x: newX, y: 0 });
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        stopShaking();
        
        if (gestureState.dx < -20 || currentPanValue.current < -60) {
          Animated.spring(pan, {
            toValue: { x: -90, y: 0 },
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.cardContainer, !isUnread && styles.cardContainerRead]}>
      <View style={styles.deleteBackground}>
        <TouchableOpacity 
          style={styles.deleteAction} 
          onPress={handleDeletePress}
        >
          <Ionicons name="trash-outline" size={24} color={Colors.white} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.foregroundCard, 
          !isUnread && styles.foregroundCardRead,
          { 
            marginRight: pan.x.interpolate({
              inputRange: [-90, 0],
              outputRange: [90, 0],
              extrapolate: 'clamp'
            }),
            transform: [
              {
                translateX: shakeAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-6, 6]
                })
              }
            ]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity 
          style={styles.touchableArea} 
          onPress={() => onPress(item, isUnread)}
          activeOpacity={1}
        >
          {item.request.content.title && (
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isUnread ? Colors.color333 : Colors.color777, marginBottom: 4 }}>
              {item.request.content.title}
            </Text>
          )}
          <Text style={{ fontSize: 16, color: isUnread ? Colors.color555 : Colors.color888 }} numberOfLines={2}>
            {item.request.content.body}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.colorD0E3F0,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.white,
  },
  cardContainerRead: {
    borderColor: Colors.colorE0E0E0,
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#FF4D4D',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
  },
  deleteText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginTop: 4,
  },
  foregroundCard: {
    backgroundColor: Colors.colorEEF3FF,
  },
  foregroundCardRead: {
    backgroundColor: Colors.colorF5F5F5,
  },
  touchableArea: {
    padding: 15,
  },
});

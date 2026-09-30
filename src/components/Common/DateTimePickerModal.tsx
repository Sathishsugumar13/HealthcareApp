import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface DateTimePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  tempDate: number | null;
  setTempDate: (date: number | null) => void;
  tempTime: string | null;
  setTempTime: (time: string | null) => void;
  onConfirm: () => void;
}

export default function DateTimePickerModal({ 
  isVisible, 
  onClose, 
  tempDate, 
  setTempDate, 
  tempTime, 
  setTempTime, 
  onConfirm 
}: DateTimePickerModalProps) {
  
  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.calendarModalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.calendarModalContainer} activeOpacity={1} onPress={() => {}}>
          
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarMonthText}>
              {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
            </Text>
            <View style={styles.calendarNav}>
              <MaterialCommunityIcons name="chevron-left" size={24} color={Colors.color333} />
              <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.color333} style={styles.inlineMarginleft16} />
            </View>
          </View>
          
          <View style={styles.calendarDaysRow}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
              <Text key={day} style={styles.calendarDayLabel}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.calendarGrid}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              let todayDate = new Date().getDate();
              let isOldDate = day < todayDate;
              return (
              <TouchableOpacity 
                key={day} 
                style={[styles.calendarDateCell, tempDate === day && styles.calendarDateCellActive, isOldDate && { opacity: 0.3 }]}
                onPress={() => {
                  if (isOldDate) {
                    Alert.alert('Invalid Date', 'Old dates cannot be selected.');
                  } else {
                    setTempDate(day);
                    setTempTime(null);
                  }
                }}
                activeOpacity={isOldDate ? 1 : 0.2}
              >
                <Text style={[styles.calendarDateText, tempDate === day && styles.calendarDateTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            )})}
          </View>

          <Text style={styles.timeTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:30 PM'].map(time => {
              let isOldTime = false;
              let todayDate = new Date().getDate();
              if (tempDate === todayDate) {
                let [timePart, modifier] = time.split(' ');
                let [hours, minutes] = timePart.split(':');
                let hr = parseInt(hours, 10);
                let min = parseInt(minutes, 10);
                if (modifier === 'PM' && hr !== 12) hr += 12;
                if (modifier === 'AM' && hr === 12) hr = 0;
                
                let currentHour = new Date().getHours();
                let currentMinute = new Date().getMinutes();
                if (hr < currentHour || (hr === currentHour && min < currentMinute)) {
                  isOldTime = true;
                }
              }

              return (
              <TouchableOpacity 
                key={time} 
                style={[styles.timeGridChip, tempTime === time && styles.timeGridChipActive, isOldTime && { opacity: 0.3 }]}
                onPress={() => {
                  if (isOldTime) {
                    Alert.alert('Invalid Time', 'Old times cannot be selected.');
                  } else {
                    setTempTime(time);
                  }
                }}
                activeOpacity={isOldTime ? 1 : 0.2}
              >
                <Text style={[styles.timeGridChipText, tempTime === time && styles.timeGridChipTextActive]}>{time}</Text>
              </TouchableOpacity>
            )})}
          </View>

          <TouchableOpacity style={styles.confirmDateTimeButton} onPress={onConfirm}>
            <Text style={styles.confirmDateTimeButtonText}>Confirm</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inlineMarginleft16: { marginLeft: 16 },

  calendarModalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay50,
    justifyContent: 'center',
    padding: 20,
  },
  calendarModalContainer: {
    backgroundColor: Colors.colorFFF,
    borderRadius: 24,
    padding: 20,
    shadowColor: Colors.color000,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.color333,
  },
  calendarNav: {
    flexDirection: 'row',
  },
  calendarDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calendarDayLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.color888,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarDateCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 10,
  },
  calendarDateCellActive: {
    backgroundColor: Colors.color8B5CF6,
    shadowColor: Colors.color8B5CF6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  calendarDateText: {
    fontSize: 14,
    color: Colors.color333,
    fontWeight: '500',
  },
  calendarDateTextActive: {
    color: Colors.colorFFF,
    fontWeight: 'bold',
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.color333,
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeGridChip: {
    width: '31%',
    backgroundColor: Colors.colorF0F4F8,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.transparent,
  },
  timeGridChipActive: {
    backgroundColor: Colors.colorE5F1F8,
    borderColor: Colors.color3C72F2,
  },
  timeGridChipText: {
    fontSize: 13,
    color: Colors.color555,
    fontWeight: '600',
  },
  timeGridChipTextActive: {
    color: Colors.color3C72F2,
  },
  confirmDateTimeButton: {
    backgroundColor: Colors.color00C473,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmDateTimeButtonText: {
    color: Colors.colorFFF,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

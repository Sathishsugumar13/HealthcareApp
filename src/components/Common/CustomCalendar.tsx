import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import CustomDropdown from './CustomDropdown';

interface CustomCalendarProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  initialDate?: Date;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CustomCalendar({ visible, onClose, onSelectDate, initialDate }: CustomCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [currentMonth, setCurrentMonth] = useState<number>((initialDate || new Date()).getMonth());
  const [currentYear, setCurrentYear] = useState<number>((initialDate || new Date()).getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Generate years from 1920 to current year
  const currentYearActual = new Date().getFullYear();
  const YEARS = Array.from({ length: currentYearActual - 1920 + 1 }, (_, i) => currentYearActual - i);

  useEffect(() => {
    if (visible && initialDate) {
      setSelectedDate(initialDate);
      setCurrentMonth(initialDate.getMonth());
      setCurrentYear(initialDate.getFullYear());
      setShowYearPicker(false);
      setShowMonthPicker(false);
    }
  }, [visible, initialDate]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (newDate > new Date()) return;
    setSelectedDate(newDate);
    onSelectDate(newDate);
    onClose();
  };

  const changeMonth = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
  };

  const isFuture = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date > new Date();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.sectionHeading}>Month</Text>
              <CustomDropdown
                value={MONTHS[currentMonth]}
                options={MONTHS}
                onSelect={(val) => setCurrentMonth(MONTHS.indexOf(val))}
                placeholder="Month"
                centered={true}
                highlightSelected={true}
                variant="pill"
                menuMaxHeight={400}
              />
            </View>
            
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.sectionHeading}>Year</Text>
              <CustomDropdown
                value={currentYear.toString()}
                options={YEARS.map(y => y.toString())}
                onSelect={(val) => setCurrentYear(parseInt(val, 10))}
                placeholder="Year"
                centered={true}
                highlightSelected={true}
                variant="pill"
                menuMaxHeight={400}
              />
            </View>
          </View>

          <View>
            <Text style={styles.sectionHeading}>Select Date</Text>
            <View style={styles.weekDaysContainer}>
              {DAYS_OF_WEEK.map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {generateCalendarDays().map((day, index) => {
                const future = day ? isFuture(day) : false;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.dayItem}
                    onPress={() => day && !future && handleDaySelect(day)}
                    disabled={!day || future}
                  >
                    {day && (
                      <View style={[
                        styles.dayCircle,
                        isSelected(day) && styles.dayCircleSelected,
                        isToday(day) && !isSelected(day) && styles.dayCircleToday,
                      ]}>
                        <Text style={[
                          styles.dayText,
                          isSelected(day) && styles.dayTextSelected,
                          isToday(day) && !isSelected(day) && styles.dayTextToday,
                          future && styles.dayTextDisabled
                        ]}>
                          {day}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: Colors.white, borderRadius: 24, padding: 24, width: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  sectionHeading: { fontSize: 16, fontWeight: 'bold', color: Colors.color333, marginBottom: 12 },
  pillItem: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: Colors.border },
  pillItemSelected: { backgroundColor: Colors.color3C72F2, borderColor: Colors.color3C72F2 },
  pillText: { fontSize: 15, color: Colors.color333, fontWeight: '500' },
  pillTextSelected: { color: Colors.white, fontWeight: 'bold' },
  weekDaysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekDayText: { width: '14.28%', textAlign: 'center', fontSize: 13, fontWeight: '600', color: Colors.colorA0AAB5 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayItem: { width: '14.28%', paddingVertical: 4, justifyContent: 'center', alignItems: 'center' },
  dayCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  dayCircleSelected: { backgroundColor: Colors.color3C72F2 },
  dayCircleToday: { backgroundColor: '#F0F5FF', borderWidth: 1, borderColor: Colors.color3C72F2 },
  dayText: { fontSize: 15, color: Colors.color333, fontWeight: '500' },
  dayTextSelected: { color: Colors.white, fontWeight: 'bold' },
  dayTextToday: { color: Colors.color3C72F2, fontWeight: 'bold' },
  dayTextDisabled: { color: '#D0D0D0' },
  closeButton: { marginTop: 16, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F8F9FA' },
  closeButtonText: { fontSize: 16, fontWeight: '600', color: Colors.colorEF4444 },
});

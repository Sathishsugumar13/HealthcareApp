import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function NotificationContent() {
  
  // setting empty array to show the no data image
  const [notifications, setNotifications] = useState([]);

  return (
    <View style={styles.mainBox}>
      
      {/* checking if length is 0 */}
      {notifications.length === 0 ? (
        
        // showing image when no data - centered properly
        <View style={styles.centerBox}>
          <Image 
            source={require('../../assets/images/no_data.png')} 
            style={styles.imageStyle} 
          />
          <Text style={{ marginTop: 20, fontSize: 16, color: 'gray' }}>No new notifications</Text>
        </View>

      ) : (

        // showing list when data is there
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'black' }}>Notification</Text>
          {notifications.map((item: any) => {
            return (
              <View style={styles.notiBox} key={item.id}>
                <Text style={{ fontSize: 16, color: '#333' }}>{item.message}</Text>
              </View>
            )
          })}
        </ScrollView>

      )}

    </View>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    padding: 20,
    paddingTop: 50, // giving space for top status bar
    backgroundColor: 'white',
    flex: 1, // using flex to allow centering
  },
  centerBox: {
    flex: 1, // this makes it take full available height
    alignItems: 'center',
    justifyContent: 'center', // perfect center vertically
  },
  imageStyle: {
    width: 350, // made image even bigger
    height: 350,
    resizeMode: 'contain',
  },
  notiBox: {
    padding: 15,
    backgroundColor: '#EEF3FF', // light blue
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0E3F0' // border color
  }
});

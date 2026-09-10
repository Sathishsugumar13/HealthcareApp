import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// importing icons
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

export default function ReportsContent() {
  // dummy data for reports
  const reportsList = [
    { id: 1, title: 'General report', date: 'Jul 10, 2023' },
    { id: 2, title: 'General report', date: 'Jul 5, 2023' },
  ];

  return (
    <ScrollView style={styles.mainContainer}>
      
      {/* Top Heart Rate Box */}
      <View style={styles.topBox}>
        <View style={styles.leftSide}>
          <Text style={styles.headingText}>Heart rate</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 5 }}>
            <Text style={styles.bigNumber}>97</Text>
            <Text style={styles.smallText}>bpm</Text>
          </View>
        </View>

        <View style={styles.rightSide}>
           {/* Graph line using svg */}
           <Svg width="100" height="50" viewBox="0 0 120 60" fill="none">
              <Path
                d="M0 45 L15 45 L20 20 L28 50 L38 25 L45 55 L55 5 L65 50 L70 30 L75 45 L120 45"
                stroke="black"
                strokeWidth="2"
              />
            </Svg>
        </View>
      </View>

      {/* Two cards below */}
      <View style={styles.twoBoxContainer}>
        {/* Box 1 for Blood Group */}
        <View style={styles.box1}>
          <Ionicons name="water" size={25} color="#8D4C60" />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#333' }}>Blood Group</Text>
          <Text style={{ marginTop: 5, fontSize: 32, fontWeight: 'bold' }}>B+</Text>
        </View>

        {/* Box 2 for Weight */}
        <View style={styles.box2}>
          <MaterialCommunityIcons name="weight-lifter" size={25} color="#A27D40" />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#333' }}>Weight</Text>
          <Text style={{ marginTop: 5, fontSize: 32, fontWeight: 'bold' }}>155lbs</Text>
        </View>
      </View>

      {/* Reports list section */}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Latest report</Text>
        
        {/* mapping reports */}
        {reportsList.map((item) => {
          return (
            <TouchableOpacity style={styles.listItem} key={item.id}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="clipboard-pulse-outline" size={20} color="#5D85CE" />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.title}</Text>
                <Text style={{ color: 'gray', fontSize: 13, marginTop: 2 }}>{item.date}</Text>
              </View>
              
              <View>
                <Feather name="more-horizontal" size={20} color="black" />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={{ height: 30 }}></View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 15,
    paddingTop: 70, // pushed down further
    backgroundColor: 'white',
    // height: '100%'
  },
  topBox: {
    backgroundColor: '#E6EEFD', // light blue background
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftSide: {
    width: '50%',
  },
  rightSide: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 16,
    color: 'black',
  },
  bigNumber: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  twoBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  box1: {
    width: '47%',
    backgroundColor: '#DFCCD3', // light pink
    padding: 15,
    borderRadius: 10,
  },
  box2: {
    width: '47%',
    backgroundColor: '#FCECD2', // light yellow
    padding: 15,
    borderRadius: 10,
  },
  listItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc', // gray border color
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#EEF3FF',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  }
});

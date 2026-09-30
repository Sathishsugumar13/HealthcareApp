import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import ReportCard from '../Common/ReportCard';
import { Colors } from '../../theme/colors';

export default function ReportsContent() {
  
  const reportsList = [
    { id: 1, title: 'General report', date: 'Jul 10, 2023' },
    { id: 2, title: 'General report', date: 'Jul 5, 2023' },
  ];

  return (
    <ScrollView style={styles.mainContainer}>
      
      {}
      <View style={styles.topBox}>
        <View style={styles.leftSide}>
          <Text style={styles.headingText}>Heart rate</Text>
          <View style={styles.inlineFlexdirectionRowAlignite}>
            <Text style={styles.bigNumber}>97</Text>
            <Text style={styles.smallText}>bpm</Text>
          </View>
        </View>

        <View style={styles.rightSide}>
           {}
           <Svg width="100" height="50" viewBox="0 0 120 60" fill="none">
              <Path
                d="M0 45 L15 45 L20 20 L28 50 L38 25 L45 55 L55 5 L65 50 L70 30 L75 45 L120 45"
                stroke="black"
                strokeWidth="2"
              />
            </Svg>
        </View>
      </View>

      {}
      <View style={styles.twoBoxContainer}>
        {}
        <View style={styles.box1}>
          <Ionicons name="water" size={25} color={Colors.color8D4C60} />
          <Text style={styles.inlineMargintop10Fontsize16Col}>Blood Group</Text>
          <Text style={styles.inlineMargintop5Fontsize32Font}>B+</Text>
        </View>

        {}
        <View style={styles.box2}>
          <MaterialCommunityIcons name="weight-lifter" size={25} color={Colors.colorA27D40} />
          <Text style={styles.inlineMargintop10Fontsize16Col}>Weight</Text>
          <Text style={styles.inlineMargintop5Fontsize32Font}>155lbs</Text>
        </View>
      </View>

      {}
      <View style={styles.inlineMargintop10}>
        <Text style={styles.inlineFontsize18FontweightBold}>Latest report</Text>
        
        {}
        {reportsList.map((item) => {
          return (
            <ReportCard key={item.id} item={item} />
          )
        })}
      </View>

      <View style={styles.spacerHeight30}></View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inlineFlexdirectionRowAlignite: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 5 },
  inlineMargintop10Fontsize16Col: { marginTop: 10, fontSize: 16, color: Colors.color333 },
  inlineMargintop5Fontsize32Font: { marginTop: 5, fontSize: 32, fontWeight: 'bold' },
  inlineMargintop10: { marginTop: 10 },
  inlineFontsize18FontweightBold: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  spacerHeight30: { height: 30 },

  mainContainer: {
    padding: 15,
    paddingTop: 70, 
    backgroundColor: Colors.white,
    
  },
  topBox: {
    backgroundColor: Colors.colorE6EEFD, 
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
    color: Colors.black,
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
    backgroundColor: Colors.colorDFCCD3, 
    padding: 15,
    borderRadius: 10,
  },
  box2: {
    width: '47%',
    backgroundColor: Colors.colorFCECD2, 
    padding: 15,
    borderRadius: 10,
  }
});

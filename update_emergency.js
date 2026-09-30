const fs = require('fs');
let code = fs.readFileSync('src/components/HomeComponent/EmergencyButton.tsx', 'utf8');

code = code.replace("import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';", "import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';");
code = code.replace("onPress={() => Alert.alert('Emergency', 'Calling Ambulance 108...')}", "onPress={() => { Linking.openURL('tel:7904176040').catch(err => console.error('Failed to open dialer', err)); }}");
code = code.replace("Dial 108 immediately", "Dial 7904176040 immediately");

fs.writeFileSync('src/components/HomeComponent/EmergencyButton.tsx', code, 'utf8');
console.log('Updated emergency button');

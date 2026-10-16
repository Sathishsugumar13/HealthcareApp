import 'react-native-gesture-handler';
import { enableScreens, enableFreeze } from 'react-native-screens';

enableScreens(true);
enableFreeze(false);

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Alert, DeviceEventEmitter, AppState } from 'react-native';
import CustomAlertModal from './src/components/Common/CustomAlertModal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import Splash from './src/screens/Splash';
import Onboarding from './src/screens/Onboarding';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import ForgotPassword from './src/screens/ForgotPassword';
import DoctorsListScreen from './src/screens/doctorsList';
import PharmacyScreen from './src/screens/Pharmacy';
import HospitalScreen from './src/screens/Hospital';
import AppointmentsScreen from './src/screens/Appointments';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { NotificationProvider } from './src/context/NotificationContext';
import { AppointmentProvider } from './src/context/AppointmentContext';
import { PharmacyProvider } from './src/context/PharmacyContext';

import DoctorDetailsScreen from './src/screens/DoctorDetailsScreen';
import HospitalDetailsScreen from './src/screens/HospitalDetailsScreen';
import ChatScreen from './src/screens/ChatScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SavedScreen from './src/screens/SavedScreen';
import MyAppointmentsScreen from './src/screens/MyAppointmentsScreen';
import MyDetailsScreen from './src/screens/MyDetailsScreen';
import AddPersonScreen from './src/screens/AddPersonScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class RootErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.log('RootErrorBoundary caught error:', error, info);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Healthcare App</Text>
          <Text style={errorStyles.subtitle}>An unexpected error occurred while restoring the app.</Text>
          <TouchableOpacity style={errorStyles.button} onPress={this.handleRestart}>
            <Text style={errorStyles.buttonText}>Restart App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B3B60',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  console.log("App component started rendering"); 

  useEffect(() => {
    const configureAudio = () => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      }).catch(() => {});
    };

    configureAudio();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        configureAudio();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootErrorBoundary>
        <SafeAreaProvider>
          <PaperProvider>
            <NotificationProvider>
              <PharmacyProvider>
                <AppointmentProvider>
                  <StatusBar style="dark" translucent={true} backgroundColor="transparent" />
                  <CustomAlertModal />
                  <NavigationContainer>
                    <Stack.Navigator 
                      screenOptions={{ 
                        headerShown: false, 
                        freezeOnBlur: false,
                        statusBarStyle: 'dark',
                        statusBarTranslucent: true,
                      }} 
                      initialRouteName="Splash"
                    >
                      <Stack.Screen name="Splash" component={Splash} />
                      <Stack.Screen name="Onboarding" component={Onboarding} />
                      <Stack.Screen name="SignUp" component={SignUp} />
                      <Stack.Screen name="SignIn" component={SignIn} />
                      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                      <Stack.Screen name="DoctorsList" component={DoctorsListScreen} />
                      <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} />
                      <Stack.Screen name="Pharmacy" component={PharmacyScreen} />
                      <Stack.Screen name="Hospital" component={HospitalScreen} />
                      <Stack.Screen name="HospitalDetails" component={HospitalDetailsScreen} />
                      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
                      <Stack.Screen name="Chat" component={ChatScreen} />
                      <Stack.Screen name="Payment" component={PaymentScreen} />
                      <Stack.Screen name="Saved" component={SavedScreen} />
                      <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
                      <Stack.Screen name="MyDetails" component={MyDetailsScreen} />
                      <Stack.Screen name="AddPerson" component={AddPersonScreen} />
                      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
                      <Stack.Screen name="MainTab" component={MainTabNavigator} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </AppointmentProvider>
              </PharmacyProvider>
            </NotificationProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </RootErrorBoundary>
    </GestureHandlerRootView>
  );
}

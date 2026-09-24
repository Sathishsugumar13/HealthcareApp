import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './src/screens/Splash/Splash';
import Onboarding from './src/screens/Onboarding/Onboarding';
import SignUp from './src/screens/SignUp/SignUp';
import SignIn from './src/screens/SignIn/SignIn';
import ForgotPassword from './src/screens/ForgotPassword/ForgotPassword';
import DoctorsListScreen from './src/screens/doctorsList/doctorsList';
import PharmacyScreen from './src/screens/Pharmacy/Pharmacy';
import HospitalScreen from './src/screens/Hospital/Hospital';
import AppointmentsScreen from './src/screens/Appointments/Appointments';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { NotificationProvider } from './src/context/NotificationContext';
import { AppointmentProvider } from './src/context/AppointmentContext';

import DoctorDetailsScreen from './src/screens/DoctorDetails/DoctorDetailsScreen';
import HospitalDetailsScreen from './src/screens/HospitalDetails/HospitalDetailsScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log("App component started rendering"); // checking if app starts

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NotificationProvider>
          <AppointmentProvider>
            <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{ headerShown: false }} 
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
              <Stack.Screen name="MainTab" component={MainTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
          </AppointmentProvider>
        </NotificationProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
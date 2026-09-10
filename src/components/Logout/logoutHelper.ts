import { Alert } from 'react-native';

// reusable logout function for both profile pages
export const handleAppLogout = (logoutFunction: any) => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel" // cancel button does nothing
      },
      { 
        text: "Yes", 
        onPress: () => {
          // if yes, calling the original logout function
          if (logoutFunction) {
             logoutFunction();
          }
        }
      }
    ]
  );
};

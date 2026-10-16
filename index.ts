import 'react-native-gesture-handler';
import { enableScreens, enableFreeze } from 'react-native-screens';

enableScreens(true);
enableFreeze(false);

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
import { useState } from 'react';

import {
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../theme/colors';

import PrimaryButton from '../../components/Common/PrimaryButton';
import OutlineButton from '../../components/Onboarding/OutlineButton';
import IconButton from '../../components/Onboarding/IconButton';
import PaginationDots from '../../components/Onboarding/PaginationDots';
import Logo from '../../components/Common/Logo';

export default function Onboarding(props: any) {
  // state to track which page we are on
  const [currentPage, setCurrentPage] = useState(props.initialPage || 1);

  // if user is on the last page (page 3)
  if (currentPage === 3) {
    return (
      <SafeAreaView style={styles.last} edges={['top', 'bottom']}>

        <Logo size={120} style={styles.logo} />

        <Text style={styles.healthcare}>
          Healthcare
        </Text>

        <Text style={styles.start}>
          Let’s get started!
        </Text>

        <Text style={styles.gray}>
          Login to Stay healthy and fit
        </Text>

        <PrimaryButton 
          title="Login" 
          onPress={props.login} 
          style={{ width: '100%', marginBottom: 15 }} 
        />

        <OutlineButton 
          title="Sign Up" 
          onPress={props.signUp} 
        />

      </SafeAreaView>
    );
  }

  // variables for image and title based on current page
  let currentImage;
  let currentTitle;

  if (currentPage === 1) {
    currentImage = require('../../assets/images/onboarding-1.png');
    currentTitle = 'Find a lot of specialist doctor in one place';
  } else {
    currentImage = require('../../assets/images/onboarding-2.png');
    currentTitle = 'Get advice only from a doctor you believe in.';
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Skip button jumps to page 3 */}
      <Pressable
        style={styles.skip}
        onPress={() => setCurrentPage(3)}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <Image
        source={currentImage}
        style={styles.image}
      />

      <Text style={styles.title}>
        {currentTitle}
      </Text>

      <View style={styles.bottom}>
        
        <PaginationDots totalPages={2} currentPage={currentPage} />

        {/* Go to next page by adding 1 */}
        <IconButton 
          icon="arrow-right" 
          onPress={() => setCurrentPage(currentPage + 1)} 
        />

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: Colors.white,
  },
  skip: {
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 20,
  },
  skipText: {
    color: Colors.secondaryText,
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'left',
    color: Colors.black,
    marginTop: 20,
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  last: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  healthcare: {
    fontSize: 28,
    fontWeight: '800',
    color: '#223A6A',
    marginTop: 10,
    marginBottom: 50,
  },
  start: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: 8,
  },
  gray: {
    color: Colors.secondaryText,
    fontSize: 16,
    marginBottom: 30,
  },
});
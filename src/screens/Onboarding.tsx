import { useState } from 'react';

import {
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../theme/colors';

import CustomButton from '../components/Common/CustomButton';
import PaginationDots from '../components/Onboarding/PaginationDots';
import Logo from '../components/Common/Logo';
import { images } from '../assets/images';

export default function Onboarding(props: any) {
  
  let initPage = 1;
  if (props.route && props.route.params && props.route.params.initialPage) {
    initPage = props.route.params.initialPage;
  }
  const [currentPage, setCurrentPage] = useState(initPage);

  const onLoginBtnClick = () => {
    console.log("user clicked login button in onboarding");
    props.navigation.navigate('SignIn');
  };

  const onSignUpBtnClick = () => {
    console.log("user clicked sign up button in onboarding");
    props.navigation.navigate('SignUp');
  };

  
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

        <View style={styles.buttonContainer}>
          <View style={styles.loginButtonWrapper}>
            <CustomButton
              title="Login"
              onPress={onLoginBtnClick}
            />
          </View>
          
          <View style={styles.signupButtonWrapper}>
            <CustomButton
              title="Sign Up"
              variant="outline"
              onPress={onSignUpBtnClick} 
            />
          </View>
        </View>

      </SafeAreaView>
    );
  }

  
  let currentImage;
  let currentTitle;

  if (currentPage === 1) {
    currentImage = images.onboarding.onboarding1;
    currentTitle = 'Find a lot of specialist doctor in one place';
  } else {
    currentImage = images.onboarding.onboarding2;
    currentTitle = 'Get advice only from a doctor you believe in.';
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {}
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

        {}
        <CustomButton 
          rightIcon="arrow-right"
          iconFamily="Feather" 
          isRound={true}
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
    color: Colors.brandDark,
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
  buttonContainer: {
    width: '100%',
  },
  loginButtonWrapper: {
    marginBottom: 15,
  },
  signupButtonWrapper: {
  },
});

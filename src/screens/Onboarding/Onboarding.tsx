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

import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import OutlineButton from '../../components/OutlineButton/OutlineButton';
import IconButton from '../../components/IconButton/IconButton';
import PaginationDots from '../../components/PaginationDots/PaginationDots';

export default function Onboarding(props: any) {
  const [page, setPage] = useState(props.initialPage || 1);

  if (page === 3) {
    return (
      <SafeAreaView style={styles.last} edges={['top', 'bottom']}>

        <Image
          source={require('../../assets/images/healthcare-logo.png')}
          style={styles.logo}
        />

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

  const image =
    page === 1
      ? require('../../assets/images/onboarding-1.png')
      : require('../../assets/images/onboarding-2.png');

  const title =
    page === 1
      ? 'Find a lot of specialist doctor in one place'
      : 'Get advice only from a doctor you believe in.';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      <Pressable
        style={styles.skip}
        onPress={() => setPage(3)}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <Image
        source={image}
        style={styles.image}
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.bottom}>
        
        <PaginationDots totalPages={2} currentPage={page} />

        <IconButton 
          icon="arrow-right" 
          onPress={() => setPage(page + 1)} 
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
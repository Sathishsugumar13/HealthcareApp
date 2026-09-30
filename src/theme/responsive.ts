import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const scale = SCREEN_WIDTH / 375;
const scaleHeight = SCREEN_HEIGHT / 812;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export function verticalScale(size: number) {
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleHeight));
}

export function wp(widthPercent: string | number) {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent as string);
  return PixelRatio.roundToNearestPixel(SCREEN_WIDTH * elemWidth / 100);
}

export function hp(heightPercent: string | number) {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent as string);
  return PixelRatio.roundToNearestPixel(SCREEN_HEIGHT * elemHeight / 100);
}

export const SCREEN_W = SCREEN_WIDTH;
export const SCREEN_H = SCREEN_HEIGHT;

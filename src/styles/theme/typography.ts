import { TextStyle } from 'react-native';

export const FontWeights = {
  thin: '100',
  light: '300',
  medium: '500',
  bold: '700',
} as const;

export const FontFamilies = {
  vazir: {
    thin: 'Vazir-Thin',
    light: 'Vazir-Light',
    medium: 'Vazir-Medium',
    bold: 'Vazir-Bold',
  },
} as const;

export const FontSizes = {
  xxs: 10,
  xs: 12,
  s: 14,
  m: 16,
  lg: 18,
  xl: 22,
  xxl: 26
} as const

export const Typography = {
  variants: {
    // Headings
    h1: {
      fontFamily: FontFamilies.vazir.bold,
      fontSize: FontSizes.xxl,
      lineHeight: 40,
      fontWeight: FontWeights.bold,
    } as TextStyle,

    h2: {
      fontFamily: FontFamilies.vazir.bold,
      fontSize: FontSizes.xl,
      lineHeight: 36,
      fontWeight: FontWeights.bold,
    } as TextStyle,

    h3: {
      fontFamily: FontFamilies.vazir.medium,
      fontSize: FontSizes.lg,
      lineHeight: 32,
      fontWeight: FontWeights.medium,
    } as TextStyle,

    h4: {
      fontFamily: FontFamilies.vazir.medium,
      fontSize: FontSizes.m,
      lineHeight: 28,
      fontWeight: FontWeights.medium,
    } as TextStyle,

    // Body text
    large: {
      fontFamily: FontFamilies.vazir.medium,
      fontSize: FontSizes.s,
      lineHeight: 26,
      fontWeight: FontWeights.medium,
    } as TextStyle,

    medium: {
      fontFamily: FontFamilies.vazir.medium,
      fontSize: FontSizes.xs,
      lineHeight: 24,
      fontWeight: FontWeights.medium,
    } as TextStyle,

    small: {
      fontFamily: FontFamilies.vazir.medium,
      fontSize: FontSizes.xxs,
      lineHeight: 20,
      fontWeight: FontWeights.medium,
    } as TextStyle,

    // Special text styles
    caption: {
      fontFamily: FontFamilies.vazir.light,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: FontWeights.light,
    } as TextStyle,

    button: {
      fontFamily: FontFamilies.vazir.medium,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: FontWeights.medium,
    } as TextStyle,
  },
  weights: {
    thin: {
      fontFamily: FontFamilies.vazir.thin,
      fontWeight: FontWeights.thin,
    } as TextStyle,

    light: {
      fontFamily: FontFamilies.vazir.light,
      fontWeight: FontWeights.light,
    } as TextStyle,

    medium: {
      fontFamily: FontFamilies.vazir.medium,
      fontWeight: FontWeights.medium,
    } as TextStyle,

    bold: {
      fontFamily: FontFamilies.vazir.bold,
      fontWeight: FontWeights.bold,
    } as TextStyle,
  },
};

export default Typography;

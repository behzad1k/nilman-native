import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Typography, FontFamilies } from '@/src/styles/theme/typography';

type FontWeight = keyof typeof Typography.weights;
type TypographyVariant = keyof typeof Typography.variants;

interface TextViewProps extends TextProps {
  variant?: TypographyVariant;
  weight?: FontWeight;
  children: React.ReactNode;
}

const TextView: React.FC<TextViewProps> = ({
                                                 variant,
                                                 weight,
                                                 style,
                                                 children,
                                                 ...props
                                               }) => {
  const getTextStyle = (): TextStyle => {
    let baseStyle: TextStyle = {};

    if (variant && Typography.variants[variant]) {
      baseStyle = { ...Typography.variants[variant] };
    }

    if (weight) {
      baseStyle.fontFamily = FontFamilies.vazir[weight];
    }

    if (!weight && !variant){
      baseStyle.fontFamily = FontFamilies.vazir.medium
    }

    return baseStyle;
  };

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

export default TextView;

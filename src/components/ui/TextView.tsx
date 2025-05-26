import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Typography, FontFamilies } from '@/src/styles/theme/typography';

type FontWeight = 'thin' | 'light' | 'medium' | 'bold';
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

    // Apply variant style if provided
    if (variant && Typography.variants[variant]) {
      baseStyle = { ...Typography.variants[variant] };
    }

    // Override with weight if provided
    if (weight) {
      baseStyle.fontFamily = FontFamilies.vazir[weight];
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

import { useLanguage } from '@/src/hooks/useLanguage';
import { engNumToPersian } from '@/src/utils/funs';
import { type } from 'node:os';
import React, { ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Typography, FontFamilies } from '@/src/styles/theme/typography';
import { useTheme } from '@/src/components/contexts/ThemeContext';

type FontWeight = keyof typeof Typography.weights;
type TypographyVariant = keyof typeof Typography.variants;

interface TextViewProps extends TextProps {
  variant?: TypographyVariant;
  weight?: FontWeight;
  children?: string | string[] | ReactNode
}

const TextView: React.FC<TextViewProps> = ({
                                                 variant,
                                                 weight,
                                                 style,
                                                 children,
                                                 ...props
                                               }) => {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();

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

    baseStyle.color = theme.text

    return baseStyle;
  };

  const formatNumbers = (str: string | string[]) => {
    let newString = str
    try{
      if (currentLanguage == 'fa'){
        if (Array.isArray(str)){
          return str.map(e => engNumToPersian(e))
        }
        return engNumToPersian(str.toString())
      }
    } catch (e){
      console.log(str);
    }
    return str;
  }

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {typeof children == 'string' ? formatNumbers(children || '') : children}
    </Text>
  );
};

export default TextView;

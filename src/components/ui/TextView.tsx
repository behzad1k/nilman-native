import { useTheme } from '@/src/components/contexts/ThemeContext';
import { useLanguage } from '@/src/hooks/useLanguage';
import { Typography, weightTransforms } from '@/src/styles/theme/typography';
import { engNumToPersian } from '@/src/utils/funs';
import React, { ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

type FontWeight = keyof typeof Typography.weights;
type TypographyVariant = keyof typeof Typography.variants;

interface TextViewProps extends TextProps {
  variant?: TypographyVariant;
  weight?: FontWeight;
  children?: string | string[] | ReactNode;
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

    baseStyle = { ...baseStyle, ...Typography.weights[weight || (weightTransforms[(style as TextStyle)?.fontWeight || 'normal'])] };

    baseStyle.color = theme.text;

    return baseStyle;
  };

  const formatNumbers = (str: string | string[]) => {
    try {
      if (currentLanguage == 'fa') {
        if (Array.isArray(str)) {
          return str.map(e => engNumToPersian(e));
        }
        return engNumToPersian(str.toString());
      }
    } catch (e) {
      console.log(str);
    }
    return str;
  };

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {typeof children == 'string' ? formatNumbers(children || '') : children}
    </Text>
  );
};

export default TextView;

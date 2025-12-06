import React from 'react';
import { Image, ImageStyle, Platform, StyleProp } from 'react-native';
import { useTheme } from '@/src/components/contexts/ThemeContext';

interface ServiceIconProps {
  slug: string;
  style?: StyleProp<ImageStyle>;
  width?: number;
  height?: number;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({
                                                   slug,
                                                   style,
                                                   width = 60,
                                                   height = 60
                                                 }) => {
  const { theme, isDark } = useTheme();

  const imageStyle: any = [
    { width, height },
    style,
  ];

  // For web, use CSS filter instead of tintColor
  if (Platform.OS === 'web') {
    imageStyle.push({
      filter: isDark
        ? 'brightness(0) saturate(100%) invert(94%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(91%) contrast(91%)'
        : 'brightness(0) saturate(100%) invert(19%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)',
    });
  } else {
    // For native, use tintColor
    imageStyle.push({
      tintColor: theme.text,
    });
  }

  return (
    <Image
      source={{ uri: `/images/services/${encodeURIComponent(slug)}.png` }}
      style={imageStyle}
      resizeMode="contain"
    />
  );
};

export default ServiceIcon;
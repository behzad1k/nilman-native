import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import { Theme } from '@/src/styles/theme/colors';

export const useThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleFactory: (theme: Theme) => T
) => {
  const { theme } = useTheme();

  return useMemo(() => styleFactory(theme), [theme, styleFactory]);
};

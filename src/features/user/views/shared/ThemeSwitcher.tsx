import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import TextView from '@/src/components/ui/TextView';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import { Themes } from '@/src/utils/enums';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle, } from 'react-native';

const ThemeSwitcher: React.FC = () => {
  const { closeDrawer } = useDrawer();
  const { t } = useLanguage();
  const {
    setThemeMode,
    themeMode
  } = useTheme();
  const styles = useThemedStyles(createStyles);

  const handleThemeChange = (theme: Themes) => {
    setThemeMode(theme);
    closeDrawer();
  };

  return (
    <View style={[styles.container]}>
      <TextView style={styles.title}>{t('general.selectTheme')}:</TextView>
      {Object.entries(Themes).map(([key, value]) =>
        <TouchableOpacity
          key={key}
          style={[
            styles.languageButton,
            key == themeMode && styles.activeLanguage,
          ]}
          onPress={() => handleThemeChange(value)}
          accessibilityLabel={`Select ${value} language`}
          accessibilityRole="button">
          <TextView
            style={[
              styles.languageText,
              key == themeMode && styles.activeLanguageText,
            ]}>
            {value}
          </TextView>
        </TouchableOpacity>
      )}

    </View>
  );
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  languageButton: ViewStyle;
  activeLanguage: ViewStyle;
  languageText: TextStyle;
  activeLanguageText: TextStyle;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create<Styles>({
    container: {
      padding: 20,
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: theme.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    languageButton: {
      justifyContent: 'center',
      width: '100%',
      padding: 12,
      marginVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#f9f9f9',
    },
    activeLanguage: {
      backgroundColor: colors.pink,
      borderColor: colors.pink
      ,
    },
    languageText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#333',
    },
    activeLanguageText: {
      color: colors.white,
      fontWeight: 'bold',
    },
  });

export default ThemeSwitcher;

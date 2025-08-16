import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Language } from '@/src/types/translation';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle, } from 'react-native';
import { colors } from '@/src/styles/theme/colors'
import { Theme } from '@/src/types/theme';

interface LanguageSwitcherProps {
  style?: ViewStyle;
  showFlags?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
                                                             style,
                                                             showFlags = true,
                                                           }) => {
  const {
    currentLanguage,
    languageOptions,
    changeLanguage,
    t
  } = useLanguage();

  const { closeDrawer } = useDrawer();
  const handleLanguageChange = async (languageCode: Language) => {
    await changeLanguage(languageCode);
    closeDrawer()
  };
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]}>
      <TextView style={styles.title}>{t('general.selectLanguage')}:</TextView>
      {languageOptions.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageButton,
            currentLanguage === lang.code && styles.activeLanguage,
          ]}
          onPress={() => handleLanguageChange(lang.code)}
          accessibilityLabel={`Select ${lang.name} language`}
          accessibilityRole="button">
          <TextView
            style={[
              styles.languageText,
              currentLanguage === lang.code && styles.activeLanguageText,
            ]}>
            {showFlags && lang.flag ? `${lang.flag} ` : ''}
            {lang.name}
          </TextView>
        </TouchableOpacity>
      ))}
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
    backgroundColor: theme.primary
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  languageButton: {
    justifyContent: 'center',
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
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;

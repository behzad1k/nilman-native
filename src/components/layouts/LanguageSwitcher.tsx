import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useLanguage} from '@/src/hooks/useLanguage';
import {Language} from '@/src/types/translation';

interface LanguageSwitcherProps {
  style?: ViewStyle;
  showFlags?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
                                                             style,
                                                             showFlags = true,
                                                           }) => {
  const {currentLanguage, languageOptions, changeLanguage, t} = useLanguage();

  const handleLanguageChange = (languageCode: Language): void => {
    changeLanguage(languageCode);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{t('Select Language')}:</Text>
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
          <Text
            style={[
              styles.languageText,
              currentLanguage === lang.code && styles.activeLanguageText,
            ]}>
            {showFlags && lang.flag ? `${lang.flag} ` : ''}
            {lang.name}
          </Text>
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

const styles = StyleSheet.create<Styles>({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  languageButton: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  activeLanguage: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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

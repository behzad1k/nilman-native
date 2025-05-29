import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import { ThemeMode } from '@/src/styles/theme/colors';

export const ThemeSelector: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themeOptions: { label: string; value: ThemeMode; icon: string }[] = [
    { label: 'Light', value: 'light', icon: '☀️' },
    { label: 'Dark', value: 'dark', icon: '🌙' },
    { label: 'System', value: 'system', icon: '⚙️' },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const showThemeSelector = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      themeOptions.map(option => ({
        text: `${option.icon} ${option.label}`,
        onPress: () => handleThemeChange(option.value),
        style: themeMode === option.value ? 'default' : 'cancel',
      }))
    );
  };

  const currentThemeOption = themeOptions.find(option => option.value === themeMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>Theme</Text>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={showThemeSelector}
      >
        <Text style={[styles.selectorText, { color: theme.text }]}>
          {currentThemeOption?.icon} {currentThemeOption?.label}
        </Text>
        <Text style={[styles.arrow, { color: theme.textSecondary }]}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectorText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

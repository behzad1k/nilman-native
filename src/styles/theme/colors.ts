export const colors = {
  primary: '#c89dc7',
  lightPink: '#fbe4f8',
  midPink: '#c89dc7',
  lightBlack: 'rgb(66, 66, 66)',
  whitePink: 'rgba(248, 243, 243, 0.74)',
  lightGrey: 'rgba(224, 222, 222, 1)',
  darkPink: '#6d1f60',
  logoPink: '#a3238e',
  whitePinkOpacity: 'rgba(236, 170, 151, 0.5)',
  dashboardDark: '#3f4d67',
  success: '#4b794b',
  error: '#e76f6f',
  warning: '#f8d486',
  info: '#758fbe',
  white: '#FFFFFF',
  black: '#000000',
  background: '#f9f9f9',
  surface: '#FFFFFF',
  text: '#333333',
  border: '#E0E0E0',
  placeholder: '#9E9E9E',
} as const;

export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  secondary: '#1C1C1E',
  primary: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E5E5E5',
  card: '#FFFFFF',
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

export const darkTheme = {
  background: '#000000',
  primary: '#1C1C1E',
  secondary: '#FFFFFF',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  card: '#1C1C1E',
  notification: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
};

export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeMode = 'light' | 'dark' | 'system';

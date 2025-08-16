export interface ButtonTheme {
  colors: {
    primary: string;
    secondary: string;
    danger: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    disabled: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
}

export const defaultButtonTheme: ButtonTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#F2F2F7',
    danger: '#FF3B30',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5EA',
    disabled: '#B0B0B0',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: {
    small: 6,
    medium: 8,
    large: 10,
  },
};

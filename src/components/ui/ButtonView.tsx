import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  // Core functionality
  children: React.ReactNode;
  onPress: () => void;

  // Loading state
  loading?: boolean;
  loadingText?: string;
  loadingComponent?: React.ReactNode; // Custom loading component

  // Appearance
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;

  // Styling
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle; // Applied to Text children

  // Colors (override theme colors)
  backgroundColor?: string;
  textColor?: string;
  loadingColor?: string;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;

  // Full width
  fullWidth?: boolean;

  // Loading behavior
  hideChildrenWhenLoading?: boolean; // Whether to hide children when loading
}

const ButtonView: React.FC<ButtonProps> = ({
                                                children,
                                                onPress,
                                                loading = false,
                                                loadingText,
                                                loadingComponent,
                                                variant = 'primary',
                                                size = 'medium',
                                                disabled = false,
                                                style,
                                                textStyle,
                                                backgroundColor,
                                                textColor,
                                                loadingColor,
                                                accessibilityLabel,
                                                accessibilityHint,
                                                testID,
                                                fullWidth = false,
                                                hideChildrenWhenLoading = false,
                                              }) => {
  const isDisabled = disabled || loading;

  // Get variant styles
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  // Override colors if provided
  const buttonBackgroundColor = backgroundColor || variantStyles.backgroundColor;
  const buttonTextColor = textColor || variantStyles.textColor;
  const spinnerColor = loadingColor || variantStyles.loadingColor;

  // Apply disabled styles
  const finalBackgroundColor = isDisabled
    ? variantStyles.disabledBackgroundColor
    : buttonBackgroundColor;
  const finalTextColor = isDisabled
    ? variantStyles.disabledTextColor
    : buttonTextColor;

  const buttonStyle: ViewStyle[] = [
    // styles.button,
    // sizeStyles.button,
    {
      backgroundColor: finalBackgroundColor,
      borderColor: variantStyles.borderColor,
      borderWidth: variantStyles.borderWidth,
    },
    fullWidth ? styles.fullWidth : {},
    isDisabled ? styles.disabled : {},
    style ? (Array.isArray(style) ? StyleSheet.flatten(style) : style) : {},
  ];

  // Function to apply text color to Text children
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === Text) {
        return React.cloneElement(child, {
          // @ts-ignore
          style: [child.props.style, { color: finalTextColor }, textStyle,],
        });
      }
      return child;
    });
  };

  const renderLoadingContent = () => {
    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size={sizeStyles.spinnerSize}
          color={spinnerColor}
        />
        {loadingText && (
          <Text style={[
            styles.loadingText,
            sizeStyles.text,
            { color: finalTextColor },
            textStyle,
          ]}>
            {loadingText}
          </Text>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      if (hideChildrenWhenLoading) {
        return renderLoadingContent();
      } else {
        return (
          <View style={styles.contentWithLoading}>
            {renderLoadingContent()}
            <View style={styles.childrenContainer}>
              {processChildren(children)}
            </View>
          </View>
        );
      }
    }

    return processChildren(children);
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Variant styles configuration (same as before)
const getVariantStyles = (variant: ButtonVariant) => {
  const variants = {
    primary: {
      backgroundColor: '#007AFF',
      textColor: '#FFFFFF',
      borderColor: '#007AFF',
      borderWidth: 0,
      loadingColor: '#FFFFFF',
      disabledBackgroundColor: '#B0B0B0',
      disabledTextColor: '#FFFFFF',
    },
    secondary: {
      backgroundColor: '#F2F2F7',
      textColor: '#007AFF',
      borderColor: '#F2F2F7',
      borderWidth: 0,
      loadingColor: '#007AFF',
      disabledBackgroundColor: '#E5E5EA',
      disabledTextColor: '#B0B0B0',
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: '#007AFF',
      borderColor: '#007AFF',
      borderWidth: 1,
      loadingColor: '#007AFF',
      disabledBackgroundColor: 'transparent',
      disabledTextColor: '#B0B0B0',
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: '#007AFF',
      borderColor: 'transparent',
      borderWidth: 0,
      loadingColor: '#007AFF',
      disabledBackgroundColor: 'transparent',
      disabledTextColor: '#B0B0B0',
    },
    danger: {
      backgroundColor: '#FF3B30',
      textColor: '#FFFFFF',
      borderColor: '#FF3B30',
      borderWidth: 0,
      loadingColor: '#FFFFFF',
      disabledBackgroundColor: '#B0B0B0',
      disabledTextColor: '#FFFFFF',
    },
    textOnly: {
      border: 0,
      backgroundColor: 'rgb(0,0,0,0)'
    }
  };

  return variants[variant];
};

// Size styles configuration (same as before)
const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    small: {
      button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
        borderRadius: 6,
      },
      text: {
        fontSize: 14,
        fontWeight: '600' as const,
      },
      spinnerSize: 'small' as const,
    },
    medium: {
      button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minHeight: 48,
        borderRadius: 8,
      },
      text: {
        fontSize: 16,
        fontWeight: '600' as const,
      },
      spinnerSize: 'small' as const,
    },
    large: {
      button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minHeight: 56,
        borderRadius: 10,
      },
      text: {
        fontSize: 18,
        fontWeight: '600' as const,
      },
      spinnerSize: 'small' as const,
    },
  };

  return sizes[size];
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWithLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  childrenContainer: {
    marginLeft: 8,
  },
});
export default ButtonView
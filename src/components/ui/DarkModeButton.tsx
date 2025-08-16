import { useTheme } from '@/src/components/contexts/ThemeContext';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Sun, Moon } from 'phosphor-react-native';

const ThemeSwitchButton = () => {
  const { setThemeMode, isDark } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const slideAnim = useState(new Animated.Value(isDark ? 1 : 0))[0];

  // Sync animation with theme changes from other sources
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  const toggleTheme = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newTheme = isDark ? 'light' : 'dark';

    Animated.timing(slideAnim, {
      toValue: newTheme === 'dark' ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setThemeMode(newTheme);
      setIsAnimating(false);
    });
  };

  // Animation interpolations
  const moonOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const sunOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const moonTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const sunTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 0],
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={styles.button}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {/* Moon Icon (slides down and fades out) */}
        <Animated.View
          style={[
            styles.icon,
            {
              opacity: moonOpacity,
              transform: [{ translateY: moonTranslateY }],
            },
          ]}>
          <Sun size={30} color={"#888"} weight="fill" />
        </Animated.View>

        {/* Sun Icon (slides up and fades in) */}
        <Animated.View
          style={[
            styles.icon,
            {
              opacity: sunOpacity,
              transform: [{ translateY: sunTranslateY }],
            },
          ]}>
          <Moon size={30} color={"#F8EA17"} weight="fill" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 2,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
  },
});

export default ThemeSwitchButton;
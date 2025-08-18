import { useLanguage } from '@/src/hooks/useLanguage';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Text, Image } from 'react-native';

const LanguageSwitchButton = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  const slideAnim = useState(new Animated.Value(currentLanguage === 'en' ? 0 : 1))[0];

  // Sync animation with language changes from other sources
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentLanguage === 'en' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentLanguage]);

  const toggleLanguage = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';

    Animated.timing(slideAnim, {
      toValue: newLanguage === 'en' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      changeLanguage(newLanguage);
      setIsAnimating(false);
    });
  };

  // Animation interpolations
  const englishOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const farsiOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const englishTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const farsiTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 0],
  });

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={styles.button}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        {/* English (UK) Option - shown when currentLanguage is 'en' */}
        <Animated.View
          style={[
            styles.optionContainer,
            {
              opacity: englishOpacity,
              transform: [{ translateY: englishTranslateY }],
            },
          ]}>
          <Image
            style={[styles.flagBackground]}
            source={require('@/src/assets/images/uk.png')}
            resizeMode="cover"
          />
          <Text style={styles.languageText}>EN</Text>
        </Animated.View>

        {/* Farsi (Iran) Option - shown when currentLanguage is 'fa' */}
        <Animated.View
          style={[
            styles.optionContainer,
            {
              opacity: farsiOpacity,
              transform: [{ translateY: farsiTranslateY }],
            },
          ]}>
          <Image
            style={[styles.flagBackground]}
            source={require('@/src/assets/images/iran.png')}
            resizeMode="cover"
          />
          <Text style={styles.languageText}>FA</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 2,
  },
  container: {
    width: 32,
    height: 32,
    borderRadius: 16, // Half of width/height for perfect circle
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.1)', // subtle background for better visibility
  },
  optionContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  languageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default LanguageSwitchButton;
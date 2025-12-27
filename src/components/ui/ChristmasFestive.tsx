import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/src/styles/theme/colors';

interface ChristmasFestiveProps {
  children: React.ReactNode;
  enabled?: boolean;
}

/**
 * Wraps components with a subtle festive glow effect for Christmas
 * Perfect for buttons, cards, or any interactive elements
 */
const ChristmasFestive: React.FC<ChristmasFestiveProps> = ({ 
  children, 
  enabled = true 
}) => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    glowAnimation.start();

    return () => {
      glowAnimation.stop();
    };
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  const glowColor = glow.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['rgba(200, 157, 199, 0)', 'rgba(200, 157, 199, 0.3)', 'rgba(200, 157, 199, 0)'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glow,
          {
            shadowColor: glowColor,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
});

export default ChristmasFestive;

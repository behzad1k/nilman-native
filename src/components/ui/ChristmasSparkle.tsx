import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ChristmasSparkleProps {
  children: React.ReactNode;
}

const ChristmasSparkle: React.FC<ChristmasSparkleProps> = ({ children }) => {
  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createSparkleAnimation = (sparkleValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(sparkleValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleValue, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ])
      );
    };

    createSparkleAnimation(sparkle1, 0).start();
    createSparkleAnimation(sparkle2, 500).start();
    createSparkleAnimation(sparkle3, 1000).start();
  }, []);

  const sparkleOpacity1 = sparkle1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkleScale1 = sparkle1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 0],
  });

  const sparkleOpacity2 = sparkle2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkleScale2 = sparkle2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 0],
  });

  const sparkleOpacity3 = sparkle3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkleScale3 = sparkle3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 0],
  });

  return (
    <View style={styles.container}>
      {/* Sparkle effects */}
      <Animated.View
        style={[
          styles.sparkle,
          { top: -2, right: -2 },
          {
            opacity: sparkleOpacity1,
            transform: [{ scale: sparkleScale1 }],
          },
        ]}
      >
        <View style={styles.sparkleInner} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          { top: 8, left: -2 },
          {
            opacity: sparkleOpacity2,
            transform: [{ scale: sparkleScale2 }],
          },
        ]}
      >
        <View style={styles.sparkleInner} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          { bottom: -2, right: 5 },
          {
            opacity: sparkleOpacity3,
            transform: [{ scale: sparkleScale3 }],
          },
        ]}
      >
        <View style={styles.sparkleInner} />
      </Animated.View>

      {/* Original content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    width: 12,
    height: 12,
    zIndex: 10,
  },
  sparkleInner: {
    width: 12,
    height: 12,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 10,
    transform: [{ rotate: '45deg' }],
  },
});

export default ChristmasSparkle;

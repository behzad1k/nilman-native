import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/src/components/contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Snowflake {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
  speed: number;
  swing: Animated.Value;
}

const ChristmasSnow: React.FC = () => {
  const { isDark } = useTheme();
  const snowflakesRef = useRef<Snowflake[]>([]);

  useEffect(() => {
    // Create 50 snowflakes
    const snowflakes: Snowflake[] = Array.from({ length: 50 }, () => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(-20 - Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(0),
      size: Math.random() * 8 + 4, // 4-12px
      speed: Math.random() * 2000 + 3000, // 3-5 seconds
      swing: new Animated.Value(0),
    }));

    snowflakesRef.current = snowflakes;

    // Animate each snowflake
    snowflakes.forEach((flake, index) => {
      const animateSnowflake = () => {
        // Reset position
        flake.y.setValue(-20);
        flake.x.setValue(Math.random() * SCREEN_WIDTH);
        flake.opacity.setValue(0);
        flake.swing.setValue(0);

        // Fade in
        Animated.timing(flake.opacity, {
          toValue: isDark ? 0.8 : 0.6,
          duration: 500,
          useNativeDriver: true,
        }).start();

        // Swing motion
        Animated.loop(
          Animated.sequence([
            Animated.timing(flake.swing, {
              toValue: 1,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(flake.swing, {
              toValue: 0,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Fall animation
        Animated.timing(flake.y, {
          toValue: SCREEN_HEIGHT + 20,
          duration: flake.speed,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            // Restart animation
            setTimeout(() => animateSnowflake(), Math.random() * 2000);
          }
        });
      };

      // Stagger the start
      setTimeout(() => animateSnowflake(), index * 100);
    });

    return () => {
      // Cleanup
      snowflakes.forEach((flake) => {
        flake.y.stopAnimation();
        flake.swing.stopAnimation();
        flake.opacity.stopAnimation();
      });
    };
  }, [isDark]);

  return (
    <View style={styles.container} pointerEvents="none">
      {snowflakesRef.current.map((flake, index) => {
        const swingInterpolate = flake.swing.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 20],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.snowflake,
              {
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
                transform: [
                  { translateX: Animated.add(flake.x, swingInterpolate) },
                  { translateY: flake.y },
                ],
                backgroundColor: isDark ? '#ffffff' : '#e8f4f8',
                shadowColor: isDark ? '#ffffff' : '#b8d4e8',
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  snowflake: {
    position: 'absolute',
    borderRadius: 100,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default ChristmasSnow;

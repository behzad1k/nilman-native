import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import TextView from './TextView';

const ChristmasHeaderDecoration: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      {/* Christmas lights garland */}
      <View style={styles.lightsContainer}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.light,
              {
                backgroundColor: ['#ff4444', '#44ff44', '#4444ff', '#ffaa00', '#ff44ff'][index % 5],
                opacity: isDark ? 0.9 : 0.7,
              },
            ]}
          />
        ))}
      </View>
      
      {/* Decorative string */}
      <View style={[styles.string, { backgroundColor: isDark ? '#555' : '#888' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: '100%',
    position: 'relative',
    overflow: 'visible',
    marginBottom: 5,
  },
  lightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 10,
  },
  light: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  string: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 2,
    zIndex: -1,
  },
});

export default ChristmasHeaderDecoration;

import { useSplash } from '@/src/components/contexts/SplashContext';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import { colors } from '@/src/styles/theme/colors';
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';



export default function Splash({ textValue }: { textValue: string }) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.darkPink }]}>
      {/* You can add your app logo here */}
      <Image source={require('@/src/assets/images/logo.png')} style={styles.logo} />

      <Text style={[styles.appName, { color: isDark ? '#fff' : '#000' }]}>
        nilman
      </Text>

      <Text style={[styles.loadingText, { color: isDark ? '#ccc' : '#666' }]}>
        { textValue }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
});

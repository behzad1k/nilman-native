import { useTheme } from '@/src/components/contexts/ThemeContext';
import { Header } from '@/src/components/layouts/Header';
import ProfilePage from '@/src/features/user/views/profile';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

export default function Profile() {
  const styles = useThemedStyles(createStyles);
  const theme = useTheme();
  return (
    <SafeAreaView style={styles.profileContainer}>
      <StatusBar barStyle={theme.isDark ? 'dark-content' : 'light-content'}/>
      <Header/>
      <ProfilePage/>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    profileContainer: {
      backgroundColor: theme.primary,
      flex: 1,
    }
  });
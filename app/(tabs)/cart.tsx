import { useTheme } from '@/src/components/contexts/ThemeContext';
import { Header } from '@/src/components/layouts/Header';
import CartPage from '@/src/features/cart/views/cart';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

export default function Cart() {
  const { theme, isDark } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }} >
      <StatusBar barStyle={isDark ? 'dark-content' : 'light-content'} />
      <Header/>
      <CartPage />
    </SafeAreaView>
  );
}

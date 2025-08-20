import { useTheme } from '@/src/components/contexts/ThemeContext';
import { Header } from '@/src/components/layouts/Header';
import CartPage from '@/src/features/cart/views/cart';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

export default function Cart() {
  const { theme, isDark } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }} >
      <Header/>
      <CartPage />
    </SafeAreaView>
  );
}

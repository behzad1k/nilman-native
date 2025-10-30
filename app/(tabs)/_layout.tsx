import { useAuth } from '@/src/components/contexts/AuthContext';
import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { useSplash } from '@/src/components/contexts/SplashContext';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { fetchColors } from '@/src/configs/redux/slices/globalSlice';
import { cart, order } from '@/src/configs/redux/slices/orderSlice';
import { fetchServices } from '@/src/configs/redux/slices/serviceSlice';
import { addresses, fetchUser, getWorkers } from '@/src/configs/redux/slices/userSlice';
import LoginDrawer from '@/src/features/auth/views/LoginDrawer';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import Typography from '@/src/styles/theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Tabs, useRouter } from 'expo-router';
import { Clipboard, PlusCircle, User } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '@/src/components/contexts/ThemeContext'

export default function TabLayout() {
  const {
    t,
  } = useLanguage();
  const styles = useThemedStyles(createStyles)
  const { theme } = useTheme()
  const { openDrawer } = useDrawer();
  const {
    isAuthenticated,
  } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: theme.text,
        headerShown: false,
        tabBarStyle: styles.container
      }}>
      <Tabs.Screen
        name="cart"
        options={{
          title: t('general.orders'),
          tabBarLabelStyle: {
            ...Typography.variants.large
          },
          tabBarIcon: ({ color }) => <Clipboard
            color={color}
            size={26}
          />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('general.newOrder'),
          tabBarLabelStyle: {
            ...Typography.variants.large
          },
          tabBarIcon: ({ color }) =>
            <PlusCircle
              // weight={isActive('NewOrder') ? 'fill' : 'regular'}
              color={color}
              size={26}
            />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? t('general.profile') : t('general.login'),
          tabBarLabelStyle: {
            ...Typography.variants.large
          },
          tabBarIcon: ({ color }) =>
            <User
              color={color}
              size={26}
            />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            if (isAuthenticated) {
              router.push('/profile');
            } else {
              openDrawer('login', <LoginDrawer/>, {
                position: 'bottom',
                drawerHeight: 'auto',
                drawerWidth: width,

              });
            }
          },
        }}
      />
    </Tabs>
  );
}
const { width } = Dimensions.get('window');

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: theme.background,
      height: 80,
      width: width,
      position: 'absolute',
      bottom: 0,
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabText: {
      color: colors.white,
      marginTop: spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ff0000',
      marginBottom: 10,
    },
    errorDetail: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
    },
  });
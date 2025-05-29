import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { useSplash } from '@/src/components/contexts/SplashContext';
import LanguageSwitcher from '@/src/components/layouts/LanguageSwitcher';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { cart, order } from '@/src/configs/redux/slices/orderSlice';
import { fetchServices } from '@/src/configs/redux/slices/serviceSlice';
import { addresses, fetchUser, getWorkers } from '@/src/configs/redux/slices/userSlice';
import { services } from '@/src/configs/services';
import LoginDrawer from '@/src/features/auth/views/LoginDrawer';
import { useLanguage } from '@/src/hooks/useLanguage';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import Typography from '@/src/styles/theme/typography';
import { router, Tabs } from 'expo-router';
import { Clipboard, PlusCircle, User } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

export default function TabLayout() {
  const dispatch = useAppDispatch();
  const {
    loading: serviceLoading,
    error: serviceError
  } = useAppSelector((state) => state.service);
  const { hideSplash } = useSplash();
  const { openDrawer } = useDrawer();
  const {
    t,
    isLanguageLoaded,
  } = useLanguage();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  const initializeApp = async () => {
    const userLoggedIn = await services.auth.isAuthenticated()

    setUserIsLoggedIn(userLoggedIn)

    dispatch(fetchServices());

    if (userLoggedIn) {
      await Promise.all([
        dispatch(fetchUser()),
        dispatch(order()),
        dispatch(cart()),
        dispatch(getWorkers()),
        dispatch(addresses()),
      ]);
    }
  };

  useEffect(() => {
    initializeApp();

  }, [dispatch]);

  useEffect(() => {
    if (!serviceLoading && !serviceError && isLanguageLoaded) {
      const timer = setTimeout(() => {
        hideSplash();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [serviceLoading, hideSplash, isLanguageLoaded]);

  if (serviceError && !serviceLoading) {
    console.error('User fetch error:', serviceError);
  }

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: styles.container
      }}>
      <LanguageSwitcher/>
      <Tabs.Screen
        name="cart"
        options={{
          title: t('general.orders'),
          tabBarLabelStyle: {
            color: colors.white,
            ...Typography.variants.h4
          },
          tabBarIcon: ({ color }) => <Clipboard
            color={colors.white}
            size={26}
          />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('general.newOrder'),
          tabBarLabelStyle: {
            color: colors.white,
            ...Typography.variants.h4
          },
          tabBarIcon: ({ color }) =>
            <PlusCircle
              // weight={isActive('NewOrder') ? 'fill' : 'regular'}
              color={colors.white}
              size={26}
            />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: userIsLoggedIn ? t('general.profile') : t('general.login'),
          tabBarLabelStyle: {
            color: colors.white,
            ...Typography.variants.h4
          },
          tabBarIcon: ({ color }) =>
            <User
              // weight={isActive('Profile') || isActive('Login') ? 'fill' : 'regular'}
              color={colors.white}
              size={26}
            />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            if (userIsLoggedIn) {
              router.push('/profile');
            } else {
              openDrawer('login', <LoginDrawer/>, {
                position: 'bottom',
                drawerHeight: 'auto',
                drawerWidth: width
              });
            }
          },
        }}
      />
    </Tabs>
  );
}
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.logoPink,
    height: 70,
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
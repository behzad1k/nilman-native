import LanguageSwitcher from '@/src/components/layouts/LanguageSwitcher';
import { fetchServices } from '@/src/configs/redux/slices/serviceSlice';
import { useSplash } from '@/src/contexts/SplashContext';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import { Tabs } from 'expo-router';
import { PlusCircle, User, Clipboard } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const dispatch = useAppDispatch();
  const { loading: serviceLoading, error: serviceError } = useAppSelector((state) => state.service);
  const { hideSplash } = useSplash();
  const {t, isLanguageLoaded, currentLanguage} = useLanguage();
  console.log('c', currentLanguage);
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);
  useEffect(() => {
    if (!serviceLoading && isLanguageLoaded) {
      const timer = setTimeout(() => {
        hideSplash();
      }, 500); // 500ms delay

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
        sceneStyle: {
          height: 300,
          backgroundColor: 'red'
        },
        tabBarStyle: styles.container
      }}>
      <LanguageSwitcher />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabelStyle: {
            color: colors.white
          },
          title: 'Orders',
          tabBarIcon: ({ color }) =>  <Clipboard
            color={colors.white}
            size={24}
          />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabelStyle: {
            color: colors.white
          },
          tabBarIcon: ({ color }) =>
              <PlusCircle
                // weight={isActive('NewOrder') ? 'fill' : 'regular'}
                color={colors.white}
                size={24}
              />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabelStyle: {
            color: colors.white
          },
          tabBarIcon: ({ color }) =>
            <User
            // weight={isActive('Profile') || isActive('Login') ? 'fill' : 'regular'}
            color={colors.white}
            size={24}
          />,
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
    backgroundColor: colors.midPink,
    height: 55,
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
})
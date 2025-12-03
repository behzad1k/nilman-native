import { AuthProvider, useAuth } from '@/src/components/contexts/AuthContext';
import { DrawerProvider } from '@/src/components/contexts/DrawerContext';
import { LanguageProvider, useI18nContext } from '@/src/components/contexts/LanguageContext';
import { LoadingProvider } from '@/src/components/contexts/LoadingContext';
import { SplashProvider, useSplash } from '@/src/components/contexts/SplashContext';
import { ThemeProvider, useTheme } from '@/src/components/contexts/ThemeContext';
import Splash from '@/src/components/layouts/Splash';
import { Drawer } from '@/src/components/ui/Drawer';
import { LoadingGlobal } from '@/src/components/ui/LoadingGlobal';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { fetchColors } from '@/src/configs/redux/slices/globalSlice';
import { cart, order } from '@/src/configs/redux/slices/orderSlice';
import { fetchServices } from '@/src/configs/redux/slices/serviceSlice';
import { addresses, fetchUser, getWorkers } from '@/src/configs/redux/slices/userSlice';
import { store } from '@/src/configs/redux/store';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { FontFamilies } from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import { STORAGE_KEYS } from '@/src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import ToastManager from 'toastify-react-native';
import { ToastManagerProps } from 'toastify-react-native/utils/interfaces';
import { services } from '@/src/configs/services';

function AppContent() {
  const {
    showSplash,
    textValue
  } = useSplash();
  const {
    theme,
    isDark
  } = useTheme();
  const { isRTL } = useI18nContext()
  const toastConfig: ToastManagerProps = {
    useModal: false,
    isRTL: isRTL,
    theme: isDark? 'dark' : 'light',
    topOffset: 60,

  }
  const {
    t,
    isLanguageLoaded,
  } = useLanguage();
  const dispatch = useAppDispatch();
  const {
    loading: serviceLoading,
    error: serviceError
  } = useAppSelector((state) => state.service);
  const { hideSplash } = useSplash();
  const {
    checkAuthStatus
  } = useAuth();
  const initializeApp = async () => {
    const themeToken = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    if (!themeToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, 'dark')
    }
    dispatch(fetchServices());
    dispatch(fetchColors());

    if (await checkAuthStatus()) {
      await Promise.all([
        dispatch(fetchUser()),
        dispatch(order()),
        dispatch(cart()),
        dispatch(getWorkers()),
        dispatch(addresses()),
      ]);
    } else {
      AsyncStorage.removeItem('token')
    }
  };

  useEffect(() => {
    initializeApp();
  }, [dispatch, t]);

  useEffect(() => {
    if (!serviceLoading && !serviceError && isLanguageLoaded) {
      const timer = setTimeout(() => {
        hideSplash();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [serviceLoading, hideSplash, isLanguageLoaded]);

  if (serviceError && !serviceLoading) {
    console.error('Service fetch error:', serviceError);
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerProvider>
          <Drawer>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)"/>
              <Stack.Screen name="+not-found"/>
            </Stack>
            <StatusBar
              barStyle={(isDark ? 'light-content' : 'dark-content')}
              backgroundColor={theme.background}
            />
            {showSplash && <Splash textValue={textValue}/>}
          </Drawer>
        </DrawerProvider>
        <ToastManager {...toastConfig} />

      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'Vazir-Thin': require('../src/assets/fonts/Vazir-Thin.ttf'),
    'Vazir-Light': require('../src/assets/fonts/Vazir-Light.ttf'),
    'Vazir-Medium': require('../src/assets/fonts/Vazir-Medium.ttf'),
    'Vazir-Bold': require('../src/assets/fonts/Vazir-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <LoadingProvider>
        <LanguageProvider>
          <AuthProvider>
              <SplashProvider>
                <KeyboardProvider>
                  <ThemeProvider>
                    <AppContent/>
                    <LoadingGlobal/>
                  </ThemeProvider>
                </KeyboardProvider>
              </SplashProvider>
          </AuthProvider>
        </LanguageProvider>
      </LoadingProvider>
    </Provider>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    }
  });

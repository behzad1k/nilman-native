import { AuthProvider } from '@/src/components/contexts/AuthContext';
import { DrawerProvider } from '@/src/components/contexts/DrawerContext';
import { LanguageProvider, useI18nContext } from '@/src/components/contexts/LanguageContext';
import { LoadingProvider } from '@/src/components/contexts/LoadingContext';
import { SplashProvider, useSplash } from '@/src/components/contexts/SplashContext';
import { ThemeProvider, useTheme } from '@/src/components/contexts/ThemeContext';
import Splash from '@/src/components/layouts/Splash';
import { Drawer } from '@/src/components/ui/Drawer';
import { LoadingGlobal } from '@/src/components/ui/LoadingGlobal';
import { store } from '@/src/configs/redux/store';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { FontFamilies } from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import ToastManager from 'toastify-react-native';
import { ToastManagerProps } from 'toastify-react-native/utils/interfaces';

function AppContent() {
  const {
    showSplash,
    textValue
  } = useSplash();
  const {
    theme,
    isDark
  } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { isRTL } = useI18nContext()

  const toastConfig: ToastManagerProps = {
    isRTL: isRTL,
    theme: isDark? 'dark' : 'light',
    topOffset: 60
  }
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerProvider>
          <Drawer>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="address"/>
              <Stack.Screen name="privacy"/>
              <Stack.Screen name="(tabs)"/>
              <Stack.Screen name="+not-found"/>
            </Stack>
            <StatusBar
              barStyle={(isDark ? 'light-content' : 'dark-content')}
              backgroundColor={theme.background}
            />
            {showSplash && <Splash textValue={textValue}/>}
            <ToastManager {...toastConfig} />
          </Drawer>
        </DrawerProvider>
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

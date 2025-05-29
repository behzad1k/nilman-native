import Splash from '@/src/components/layouts/Splash';
import { Drawer } from '@/src/components/ui/Drawer';
import { LoadingGlobal } from '@/src/components/ui/LoadingGlobal';
import { store } from '@/src/configs/redux/store';
import { DrawerProvider } from '@/src/components/contexts/DrawerContext';
import { LanguageProvider } from '@/src/components/contexts/LanguageContext';
import { LoadingProvider } from '@/src/components/contexts/LoadingContext';
import { SplashProvider, useSplash } from '@/src/components/contexts/SplashContext';
import { ThemeProvider, useTheme } from '@/src/components/contexts/ThemeContext';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/styles/theme/colors';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

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

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerProvider
          initialConfig={{
            position: 'left',
            transitionType: 'slide',
            transitionDuration: 300,
            overlayOpacity: 0.5,
            drawerWidth: 280,
            enableGestures: true,
            enableOverlay: true,
          }}
        >
          <Drawer>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
              <Stack.Screen name="+not-found"/>
            </Stack>
            <StatusBar
              barStyle={(isDark ? 'light-content' : 'dark-content')}
              backgroundColor={theme.background}
            />
            {showSplash && <Splash textValue={textValue}/>}
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
          <SplashProvider>
            <ThemeProvider>
              <AppContent/>
              <LoadingGlobal />
            </ThemeProvider>
          </SplashProvider>
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
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    content: {
      padding: 20,
    },
    contentText: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
      textAlign: 'center',
    },
    colorDemo: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    colorBox: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
  });

import Splash from '@/src/components/layouts/Splash';
import { store } from '@/src/configs/redux/store';
import { LanguageProvider } from '@/src/contexts/LanguageContext';
import { SplashProvider, useSplash } from '@/src/contexts/SplashContext';
import { ThemeProvider, useTheme } from '@/src/contexts/ThemeContext';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/styles/theme/colors';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

function AppContent() {
  const { showSplash } = useSplash();
  const {
    theme,
    isDark
  } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="+not-found"/>
      </Stack>
      <StatusBar barStyle={(isDark ? 'light-content' : 'dark-content')}
                 backgroundColor={theme.background}/>
      {showSplash && <Splash/>}
    </>
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
      <LanguageProvider>
        <SplashProvider>
          <ThemeProvider>
            <AppContent/>
          </ThemeProvider>
        </SplashProvider>
      </LanguageProvider>
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


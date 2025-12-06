// hooks/usePWADisplayMode.ts
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const usePWADisplayMode = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if running as PWA (standalone mode)
      const checkStandalone = () => {
        const isInStandaloneMode =
          window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true ||
          document.referrer.includes('android-app://');

        setIsStandalone(isInStandaloneMode);
      };

      checkStandalone();

      // Listen for display mode changes
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  return { isStandalone, isPWA: Platform.OS === 'web' && isStandalone };
};
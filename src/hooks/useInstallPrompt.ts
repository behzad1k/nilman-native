import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INSTALL_PROMPT_KEY = '@install_prompt_dismissed';
const INSTALL_PROMPT_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptState {
  showPrompt: boolean;
  dismissPrompt: () => void;
  installApp: () => Promise<void>;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  supportsNativeInstall: boolean; // Chrome's native install prompt
}

export const useInstallPrompt = (): InstallPromptState => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [supportsNativeInstall, setSupportsNativeInstall] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  // Detect platform
  const isWeb = Platform.OS === 'web';
  const isIOS = isWeb && typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = isWeb && typeof window !== 'undefined' && /Android/.test(navigator.userAgent);

  useEffect(() => {
    if (!isWeb || typeof window === 'undefined') {
      // Not web platform, don't show prompt
      return;
    }

    // Listen for the beforeinstallprompt event (Chrome/Edge on Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setSupportsNativeInstall(true);
      console.log('beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const checkInstallStatus = async () => {
      try {
        // Check if app is already installed (running in standalone mode)
        // @ts-ignore - PWA specific
        const isInStandalone = window.navigator.standalone === true ||
          window.matchMedia('(display-mode: standalone)').matches ||
          window.matchMedia('(display-mode: fullscreen)').matches;

        setIsStandalone(isInStandalone);

        // Don't show prompt if already installed
        if (isInStandalone) {
          return;
        }

        // Check if user has dismissed the prompt recently
        const dismissedData = await AsyncStorage.getItem(INSTALL_PROMPT_KEY);

        if (dismissedData) {
          const { timestamp } = JSON.parse(dismissedData);
          const now = Date.now();
          const timeSinceDismissed = now - timestamp;

          // Don't show prompt if dismissed within cooldown period
          if (timeSinceDismissed < INSTALL_PROMPT_COOLDOWN) {
            return;
          }
        }

        // Only show on iOS or Android mobile browsers
        if (isIOS || isAndroid) {
          // Add a small delay to let the app load first
          setTimeout(() => {
            setShowPrompt(true);
          }, 2000); // Show after 2 seconds
        }
      } catch (error) {
        console.error('Error checking install status:', error);
      }
    };

    checkInstallStatus();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isWeb, isIOS, isAndroid]);

  const dismissPrompt = async () => {
    setShowPrompt(false);

    try {
      // Save dismissal timestamp
      const dismissData = {
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(INSTALL_PROMPT_KEY, JSON.stringify(dismissData));
    } catch (error) {
      console.error('Error saving dismiss data:', error);
    }
  };

  const installApp = async () => {
    if (!deferredPrompt.current) {
      console.log('No deferred prompt available');
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.current.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.current.userChoice;

      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // Close our custom prompt
        dismissPrompt();
      }

      // Clear the deferredPrompt for next time
      deferredPrompt.current = null;
      setSupportsNativeInstall(false);
    } catch (error) {
      console.error('Error during app installation:', error);
    }
  };

  const canInstall = (isIOS || isAndroid) && !isStandalone;

  return {
    showPrompt,
    dismissPrompt,
    installApp,
    isIOS,
    isAndroid,
    isStandalone,
    canInstall,
    supportsNativeInstall,
  };
};